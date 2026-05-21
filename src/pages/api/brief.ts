import type { APIRoute } from 'astro';
import { z } from 'zod';
import { Resend } from 'resend';
import { PRICING, RUSH_MULTIPLIER, type ServiceKey, type PublishingOption } from '../../config/pricing';
import { PRICING_ES, localizeConfig } from '../../config/pricing.es';
import { LOGO_BASE64 } from '../../lib/email/logo';

export const prerender = false;

const SERVICE_KEYS = ['bedrock', 'unity', 'flutter', 'websites'] as const;

const BriefSchema = z.object({
    service: z.enum(SERVICE_KEYS),
    scale: z.string().min(1),
    toggles: z.array(z.string()).max(20),
    publishing: z.array(z.string()).max(10).optional().default([]),
    rush: z.boolean(),
    name: z.string().min(2).max(120),
    email: z.email(),
    company: z.string().max(200).optional().default(''),
    deadline: z.string().max(40).optional().default(''),
    notes: z.string().max(4000),
    website: z.string().optional().default(''),
    version: z.string().max(40).optional().default(''),
    lang: z.enum(['es', 'en']).optional().default('es'),
    turnstileToken: z.string().min(1).max(2048),
});

const json = (status: number, body: unknown) =>
    new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' },
    });

const esc = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const MONO = "'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,monospace";

const RUSH_PCT = Math.round((RUSH_MULTIPLIER - 1) * 100);

// Email chrome per locale. Terminology mirrors the on-page configurator
// (ServicePage.astro) so the client sees the same words they just read.
// Service/scale/add-on labels are NOT here — they come localized from
// pricing.es.ts via localizeConfig, so prices never drift between locales.
const COPY = {
    en: {
        title: 'New project brief', submittedVia: 'Submitted via joseveiga.dev',
        contact: 'Contact', configuration: 'Configuration', addons: 'Add-ons',
        publishing: 'Publishing', notes: 'Notes', estimate: 'Estimate', timeline: 'Timeline',
        name: 'Name', email: 'Email', company: 'Company', deadline: 'Deadline',
        service: 'Service', scale: 'Scale', rush: 'Rush',
        noneSelected: 'None selected',
        clientPublishes: 'Client publishes — account fees on them.',
        noNotes: 'No additional notes.',
        rushYes: `Yes (+${RUSH_PCT}%)`, rushNo: 'No', expedited: 'Expedited',
        role: 'Freelance developer',
    },
    es: {
        title: 'Nuevo brief de proyecto', submittedVia: 'Enviado desde joseveiga.dev',
        contact: 'Contacto', configuration: 'Configuración', addons: 'Add-ons',
        publishing: 'Publicación', notes: 'Notas', estimate: 'Rango orientativo', timeline: 'Entrega',
        name: 'Nombre', email: 'Email', company: 'Empresa', deadline: 'Fecha límite',
        service: 'Servicio', scale: 'Escala', rush: 'Exprés',
        noneSelected: 'Sin extras',
        clientPublishes: 'Lo publica el cliente — las cuotas de cuenta corren de su parte.',
        noNotes: 'Sin notas adicionales.',
        rushYes: `Sí (+${RUSH_PCT}%)`, rushNo: 'No', expedited: 'Exprés',
        role: 'Desarrollador freelance',
    },
} as const;

export const POST: APIRoute = async ({ request }) => {
    let raw: unknown;
    try {
        raw = await request.json();
    } catch {
        return json(400, { error: 'bad_json' });
    }

    const parsed = BriefSchema.safeParse(raw);
    if (!parsed.success) return json(400, { error: 'invalid' });

    const data = parsed.data;

    if (data.website.trim() !== '') return json(200, { ok: true });

    const turnstileSecret = import.meta.env.TURNSTILE_SECRET_KEY;
    if (!turnstileSecret) return json(500, { error: 'send_failed' });
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '';
    const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            secret: turnstileSecret,
            response: data.turnstileToken,
            ...(ip ? { remoteip: ip } : {}),
        }),
    });
    const outcome = (await verify.json().catch(() => null)) as { success?: boolean } | null;
    if (!outcome?.success) return json(403, { error: 'captcha' });

    const copy = COPY[data.lang];
    const serviceKey = data.service as ServiceKey;
    const config = data.lang === 'es'
        ? localizeConfig(PRICING[serviceKey], PRICING_ES[serviceKey])
        : PRICING[serviceKey];
    const scale = config.scale.find(s => s.value === data.scale);
    if (!scale) return json(400, { error: 'invalid' });

    const versionLabel = config.version
        ? (config.version.options.find(o => o.value === data.version)?.label ?? '')
        : '';

    const selectedToggles = data.toggles
        .map(v => config.toggles.find(t => t.value === v))
        .filter((t): t is (typeof config.toggles)[number] => Boolean(t));

    const publishingOptions = config.publishing?.options ?? [];
    const selectedPublishing: PublishingOption[] = data.publishing
        .map(v => publishingOptions.find(o => o.value === v))
        .filter((o): o is PublishingOption => Boolean(o));

    let min = scale.range[0];
    let max = scale.range[1];
    for (const t of selectedToggles) {
        if (t.range) {
            min += t.range[0];
            max += t.range[1];
        }
    }
    const baseMin = min;
    const baseMax = max;
    for (const t of selectedToggles) {
        if (t.percent) {
            const months = t.months ?? 12;
            const floor = t.minAmount ?? 0;
            min += Math.max(Math.round(baseMin * t.percent[0] / 100 * months / 12), floor);
            max += Math.max(Math.round(baseMax * t.percent[1] / 100 * months / 12), floor);
        }
    }
    for (const p of selectedPublishing) {
        min += p.range[0];
        max += p.range[1];
    }
    if (data.rush) {
        min = Math.round(min * RUSH_MULTIPLIER);
        max = Math.round(max * RUSH_MULTIPLIER);
    }

    const fmt = (n: number) => `€${n.toLocaleString('en-US')}`;
    const timeline = data.rush ? `${esc(scale.timeline)} (${copy.expedited})` : esc(scale.timeline);

    const addonsHtml = selectedToggles.length
        ? selectedToggles
              .map(
                  t =>
                      `<span style="display:inline-block;background-color:#1a1a1a;border:1px solid rgba(56,189,248,0.25);color:#f5f5f5;font-family:${MONO};font-size:12px;padding:4px 10px;border-radius:999px;margin:0 6px 6px 0;line-height:1.4">${esc(t.label)}</span>`
              )
              .join('')
        : `<span style="color:#737373;font-style:italic;font-family:${MONO};font-size:13px">${copy.noneSelected}</span>`;

    const publishingHtml = selectedPublishing.length
        ? selectedPublishing
              .map(
                  p =>
                      `<span style="display:inline-block;background-color:#1a1a1a;border:1px solid rgba(56,189,248,0.25);color:#f5f5f5;font-family:${MONO};font-size:12px;padding:4px 10px;border-radius:999px;margin:0 6px 6px 0;line-height:1.4">${esc(p.label)}</span>`
              )
              .join('')
        : `<span style="color:#737373;font-style:italic;font-family:${MONO};font-size:13px">${copy.clientPublishes}</span>`;

    const companyRow = data.company.trim()
        ? `<tr><td width="70" style="padding:4px 0;color:#a3a3a3;vertical-align:top">${copy.company}</td><td style="padding:4px 0;color:#f5f5f5;word-break:break-word">${esc(data.company)}</td></tr>`
        : '';
    const deadlineRow = data.deadline.trim()
        ? `<tr><td width="70" style="padding:4px 0;color:#a3a3a3;vertical-align:top">${copy.deadline}</td><td style="padding:4px 0;color:#f5f5f5">${esc(data.deadline)}</td></tr>`
        : '';

    const notesContent = data.notes.trim()
        ? `<p style="margin:0;white-space:pre-wrap;font-family:${MONO};font-size:14px;line-height:1.6;color:#f5f5f5">${esc(data.notes)}</p>`
        : `<p style="margin:0;font-family:${MONO};font-size:14px;color:#737373;font-style:italic">${copy.noNotes}</p>`;

    const rushLabel = data.rush ? copy.rushYes : copy.rushNo;

    const subject = `[Brief] ${config.serviceLabel} · ${fmt(min)}–${fmt(max)} · ${data.name}`;

    const html = `<!doctype html><html><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<style>
@media only screen and (max-width:600px) {
  .container { width:100% !important; max-width:100% !important; border-radius:0 !important; border-left:none !important; border-right:none !important; }
  .px { padding-left:16px !important; padding-right:16px !important; }
  .stack-l { display:block !important; width:100% !important; padding:0 0 14px !important; }
  .stack-r { display:block !important; width:100% !important; padding:14px 0 0 !important; border-left:none !important; border-top:1px solid rgba(255,255,255,0.06) !important; }
  .estimate-box { padding:14px 16px !important; }
  .estimate-cell { display:block !important; width:100% !important; }
  .timeline-cell { display:block !important; width:100% !important; text-align:left !important; padding:12px 0 0 !important; }
  .estimate-value { font-size:18px !important; line-height:1.3 !important; }
}
</style></head>
<body style="margin:0;padding:0;background-color:#0a0a0a">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#0a0a0a;font-family:${MONO};color:#f5f5f5">
  <tr><td align="center" style="padding:12px 8px">
    <table role="presentation" class="container" cellpadding="0" cellspacing="0" border="0" width="760" style="max-width:760px;background-color:#0f0f0f;border:1px solid rgba(255,255,255,0.08);border-radius:12px;overflow:hidden">
      <tr><td class="px" style="padding:14px 24px;border-bottom:1px solid rgba(56,189,248,0.25);background-color:#0a0a0a">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
          <td align="left" valign="middle"><img src="cid:logo" alt="Jose Veiga" height="28" style="display:block;height:28px;width:auto;border:0"></td>
          <td align="right" valign="middle" style="font-family:${MONO};font-size:12px;color:#a3a3a3;letter-spacing:0.02em"><a href="https://joseveiga.dev" style="color:#a3a3a3;text-decoration:none">joseveiga.dev</a></td>
        </tr></table>
      </td></tr>
      <tr><td class="px" style="padding:18px 24px 0">
        <h1 style="margin:0 0 2px;font-family:${MONO};font-size:18px;font-weight:600;color:#ffffff;letter-spacing:-0.01em">${copy.title}</h1>
        <p style="margin:0;font-family:${MONO};font-size:11px;color:#737373">${copy.submittedVia}</p>
      </td></tr>
      <tr><td class="px" style="padding:16px 24px 0">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
          <td class="stack-l" width="50%" valign="top" style="padding-right:14px">
            <p style="margin:0 0 8px;font-family:${MONO};font-size:13px;font-weight:600;color:#38bdf8;text-transform:uppercase;letter-spacing:0.08em">${copy.contact}</p>
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="font-family:${MONO};font-size:14px">
              <tr><td width="70" style="padding:3px 0;color:#a3a3a3;vertical-align:top">${copy.name}</td><td style="padding:3px 0;color:#f5f5f5;word-break:break-word">${esc(data.name)}</td></tr>
              <tr><td width="70" style="padding:3px 0;color:#a3a3a3;vertical-align:top">${copy.email}</td><td style="padding:3px 0;word-break:break-all"><a href="mailto:${esc(data.email)}" style="color:#38bdf8;text-decoration:none">${esc(data.email)}</a></td></tr>
              ${companyRow}
              ${deadlineRow}
            </table>
          </td>
          <td class="stack-r" width="50%" valign="top" style="padding-left:14px;border-left:1px solid rgba(255,255,255,0.06)">
            <p style="margin:0 0 8px;font-family:${MONO};font-size:13px;font-weight:600;color:#38bdf8;text-transform:uppercase;letter-spacing:0.08em">${copy.configuration}</p>
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="font-family:${MONO};font-size:14px">
              <tr><td width="70" style="padding:3px 0;color:#a3a3a3;vertical-align:top">${copy.service}</td><td style="padding:3px 0;color:#f5f5f5">${esc(config.serviceLabel)}</td></tr>
              ${versionLabel ? `<tr><td width="70" style="padding:3px 0;color:#a3a3a3;vertical-align:top">${esc(config.version!.label)}</td><td style="padding:3px 0;color:#f5f5f5">${esc(versionLabel)}</td></tr>` : ''}
              <tr><td width="70" style="padding:3px 0;color:#a3a3a3;vertical-align:top">${copy.scale}</td><td style="padding:3px 0;color:#f5f5f5">${esc(scale.label)}</td></tr>
              <tr><td width="70" style="padding:3px 0;color:#a3a3a3;vertical-align:top">${copy.rush}</td><td style="padding:3px 0;color:#f5f5f5">${rushLabel}</td></tr>
            </table>
          </td>
        </tr></table>
      </td></tr>
      <tr><td class="px" style="padding:16px 24px 0">
        <p style="margin:0 0 8px;font-family:${MONO};font-size:13px;font-weight:600;color:#38bdf8;text-transform:uppercase;letter-spacing:0.08em">${copy.addons}</p>
        <div>${addonsHtml}</div>
      </td></tr>
      ${config.publishing ? `<tr><td class="px" style="padding:16px 24px 0">
        <p style="margin:0 0 8px;font-family:${MONO};font-size:13px;font-weight:600;color:#38bdf8;text-transform:uppercase;letter-spacing:0.08em">${copy.publishing}</p>
        <div>${publishingHtml}</div>
      </td></tr>` : ''}
      <tr><td class="px" style="padding:16px 24px 0">
        <p style="margin:0 0 8px;font-family:${MONO};font-size:13px;font-weight:600;color:#38bdf8;text-transform:uppercase;letter-spacing:0.08em">${copy.notes}</p>
        ${notesContent}
      </td></tr>
      <tr><td class="px" style="padding:18px 24px 4px">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:rgba(56,189,248,0.05);border:1px solid rgba(56,189,248,0.25);border-radius:8px"><tr><td class="estimate-box" style="padding:14px 20px">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
            <td class="estimate-cell" valign="middle">
              <p style="margin:0 0 4px;font-family:${MONO};font-size:11px;font-weight:600;color:#38bdf8;text-transform:uppercase;letter-spacing:0.08em">${copy.estimate}</p>
              <p class="estimate-value" style="margin:0;font-family:${MONO};font-size:20px;font-weight:600;color:#ffffff;letter-spacing:-0.01em">${fmt(min)} – ${fmt(max)} <span style="font-size:13px;font-weight:400;color:#a3a3a3">+ IVA</span></p>
            </td>
            <td class="timeline-cell" valign="middle" align="right" style="font-family:${MONO};font-size:13px;color:#a3a3a3">${copy.timeline}<br><span style="color:#f5f5f5;font-size:14px">${timeline}</span></td>
          </tr></table>
        </td></tr></table>
      </td></tr>
      <tr><td class="px" style="padding:14px 24px 18px">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-top:1px solid rgba(255,255,255,0.08)"><tr><td style="padding-top:14px">
          <p style="margin:0;font-family:${MONO};font-size:12px;color:#737373">Jose Veiga · ${copy.role} · <a href="https://joseveiga.dev" style="color:#38bdf8;text-decoration:none">joseveiga.dev</a></p>
        </td></tr></table>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;

    const apiKey = import.meta.env.RESEND_API_KEY;
    const fromBase = import.meta.env.QUOTE_FROM;
    const to = import.meta.env.QUOTE_RECIPIENT;
    if (!apiKey || !fromBase || !to) return json(500, { error: 'send_failed' });

    const fromMatch = fromBase.match(/<([^>]+)>/);
    const fromEmail = fromMatch ? fromMatch[1] : fromBase.trim();
    const safeName = data.name.replace(/[<>"\r\n]/g, '').trim();
    const from = `"${safeName} (via joseveiga.dev)" <${fromEmail}>`;

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
        from,
        to,
        cc: data.email,
        replyTo: data.email,
        subject,
        html,
        attachments: [
            {
                filename: 'logo.png',
                content: LOGO_BASE64,
                contentId: 'logo',
            },
        ],
    });

    if (error) return json(500, { error: 'send_failed' });
    return json(200, { ok: true });
};
