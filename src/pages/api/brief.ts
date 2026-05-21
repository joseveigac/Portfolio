import type { APIRoute } from 'astro';
import { z } from 'zod';
import { Resend } from 'resend';
import { PRICING, RUSH_MULTIPLIER, type ServiceKey, type PublishingOption } from '../../config/pricing';
import { PRICING_ES, localizeConfig } from '../../config/pricing.es';
import { renderBriefEmail, type BriefEmailModel } from '../../lib/email/brief-template';
import { PERSONAL_LOGO_BASE64, SERVICE_ICON_BASE64 } from '../../lib/email/logos';

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

const RUSH_PCT = Math.round((RUSH_MULTIPLIER - 1) * 100);

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
    const subject = `[Brief] ${config.serviceLabel} · ${fmt(min)}–${fmt(max)} · ${data.name}`;

    const model: BriefEmailModel = {
        lang: data.lang,
        service: serviceKey,
        serviceLabel: config.serviceLabel,
        name: data.name,
        email: data.email,
        company: data.company,
        deadline: data.deadline,
        versionFieldLabel: config.version?.label ?? '',
        versionLabel,
        scaleLabel: scale.label,
        rush: data.rush,
        rushPct: RUSH_PCT,
        addons: selectedToggles.map(t => t.label),
        hasPublishingField: Boolean(config.publishing),
        publishing: selectedPublishing.map(p => p.label),
        notes: data.notes,
        estimateMin: min,
        estimateMax: max,
        timeline: scale.timeline,
    };

    const html = renderBriefEmail(model);

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
                content: PERSONAL_LOGO_BASE64,
                contentId: 'logo',
            },
            {
                filename: 'service.png',
                content: SERVICE_ICON_BASE64[serviceKey],
                contentId: 'service',
            },
        ],
    });

    if (error) return json(500, { error: 'send_failed' });
    return json(200, { ok: true });
};
