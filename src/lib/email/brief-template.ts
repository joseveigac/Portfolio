// Renders the brief email sent by /api/brief. Editorial layout, light by default with a
// prefers-color-scheme dark variant, themed per service (see theme.ts). Inline styles carry
// the light design (universal); the <style> block only holds dark-mode + responsive overrides
// (with !important so they beat the inline light styles). Logos ship as cid: attachments
// (logos.ts) because Gmail/Outlook don't render SVG.
import type { ServiceKey } from '../../config/pricing';
import { EMAIL_THEMES } from './theme';

export interface BriefEmailModel {
    lang: 'es' | 'en';
    service: ServiceKey;
    serviceLabel: string;
    name: string;
    email: string;
    company: string;
    deadline: string;
    versionFieldLabel: string; // '' when the service has no version field
    versionLabel: string; // '' when not applicable
    scaleLabel: string;
    rush: boolean;
    rushPct: number;
    addons: string[];
    hasPublishingField: boolean;
    publishing: string[];
    notes: string;
    estimateMin: number;
    estimateMax: number;
    timeline: string; // raw scale timeline; rush suffix added here
}

// Email clients don't load web fonts (no JetBrains Mono), so use robust system stacks:
// a clean sans for legible, professional body copy + system monospace for the estimate
// figure (Stripe-style numerals — keeps the developer signature without hurting reading).
const SANS = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const MONO = "ui-monospace,SFMono-Regular,'SF Mono',Menlo,Consolas,'Liberation Mono',monospace";

const esc = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const fmt = (n: number) => `€${n.toLocaleString('en-US')}`;

const COPY = {
    en: {
        subline: 'Project brief',
        estimate: 'Indicative range',
        delivery: 'Estimated delivery',
        expedited: 'Expedited',
        ivaNote: '+ VAT',
        contact: 'Contact',
        configuration: 'Configuration',
        addons: 'Add-ons',
        publishing: 'Publishing',
        notes: 'Notes',
        email: 'Email',
        company: 'Company',
        deadline: 'Deadline',
        scale: 'Scale',
        rush: 'Rush',
        noneSelected: 'No add-ons',
        clientPublishes: 'Client publishes — account fees on them.',
        noNotes: 'No additional notes.',
        rushYes: (p: number) => `Yes (+${p}%)`,
        rushNo: 'No',
        role: 'Freelance developer',
    },
    es: {
        subline: 'Brief de proyecto',
        estimate: 'Rango orientativo',
        delivery: 'Entrega estimada',
        expedited: 'Exprés',
        ivaNote: '+ IVA',
        contact: 'Contacto',
        configuration: 'Configuración',
        addons: 'Add-ons',
        publishing: 'Publicación',
        notes: 'Notas',
        email: 'Email',
        company: 'Empresa',
        deadline: 'Fecha límite',
        scale: 'Escala',
        rush: 'Exprés',
        noneSelected: 'Sin extras',
        clientPublishes: 'Lo publica el cliente — las cuotas de cuenta corren de su parte.',
        noNotes: 'Sin notas adicionales.',
        rushYes: (p: number) => `Sí (+${p}%)`,
        rushNo: 'No',
        role: 'Desarrollador freelance',
    },
} as const;

export function renderBriefEmail(model: BriefEmailModel): string {
    const t = EMAIL_THEMES[model.service];
    const c = COPY[model.lang];

    const pad = 'padding-left:28px;padding-right:28px';
    const eyebrow = (text: string) =>
        `<div class="eacc" style="font-family:${SANS};font-size:11px;letter-spacing:0.14em;text-transform:uppercase;font-weight:700;color:${t.accentLight}">${text}</div>`;

    const kvRow = (label: string, value: string) =>
        `<tr><td class="emut" width="116" valign="top" style="padding:4px 0;color:#737373;font-family:${SANS};font-size:13px">${label}</td><td class="etxt" valign="top" style="padding:4px 0;color:#171717;font-family:${SANS};font-size:13px;word-break:break-word">${value}</td></tr>`;

    // Add-ons: filled accent pills (priced scope). Publishing: neutral outline tags
    // (rounded rectangle) so the two groups read as clearly different roles.
    const pill = (label: string) =>
        `<span class="epill" style="display:inline-block;background:${t.pillLight.bg};border:1px solid ${t.pillLight.border};color:${t.pillLight.text};font-family:${SANS};font-size:12px;padding:4px 10px;border-radius:999px;margin:0 6px 6px 0;line-height:1.4">${esc(label)}</span>`;

    // Publishing tags can be bare domains (e.g. "Itch.io") that mail clients auto-link.
    // A word joiner (U+2060) after the dot keeps them plain text with no visible artifact.
    const pillNeutral = (label: string) =>
        `<span class="epilln" style="display:inline-block;background:transparent;border:1px solid #d4d4d4;color:#525252;font-family:${SANS};font-size:12px;padding:4px 10px;border-radius:6px;margin:0 6px 6px 0;line-height:1.4">${esc(label).replace(/\./g, '.&#8288;')}</span>`;

    const emptyNote = (text: string) =>
        `<span class="emut" style="color:#737373;font-style:italic;font-family:${SANS};font-size:13px">${text}</span>`;

    const section = (label: string, body: string) =>
        `<tr><td class="epx ehair" style="${pad};padding-top:18px;border-top:1px solid #ededed">
          <div style="padding-bottom:9px">${eyebrow(label)}</div>
          ${body}
        </td></tr>`;

    // --- Contact ---
    const contactRows = [
        kvRow(c.email, `<a class="eacc" href="mailto:${esc(model.email)}" style="color:${t.accentLight};text-decoration:none;word-break:break-all">${esc(model.email)}</a>`),
        model.company.trim() ? kvRow(c.company, esc(model.company)) : '',
        model.deadline.trim() ? kvRow(c.deadline, esc(model.deadline)) : '',
    ].join('');
    const contact = section(
        c.contact,
        `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">${contactRows}</table>`
    );

    // --- Configuration ---
    const configRows = [
        model.versionFieldLabel && model.versionLabel ? kvRow(esc(model.versionFieldLabel), esc(model.versionLabel)) : '',
        kvRow(c.scale, esc(model.scaleLabel)),
        kvRow(c.rush, model.rush ? c.rushYes(model.rushPct) : c.rushNo),
    ].join('');
    const configuration = section(
        c.configuration,
        `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">${configRows}</table>`
    );

    // --- Add-ons ---
    const addons = section(
        c.addons,
        model.addons.length ? `<div>${model.addons.map(pill).join('')}</div>` : emptyNote(c.noneSelected)
    );

    // --- Publishing (only if the service has the field) ---
    const publishing = model.hasPublishingField
        ? section(
              c.publishing,
              model.publishing.length ? `<div>${model.publishing.map(pillNeutral).join('')}</div>` : emptyNote(c.clientPublishes)
          )
        : '';

    // --- Notes ---
    const notes = section(
        c.notes,
        model.notes.trim()
            ? `<div class="etxt" style="color:#171717;font-family:${SANS};font-size:14px;line-height:1.65;white-space:pre-wrap">${esc(model.notes)}</div>`
            : emptyNote(c.noNotes)
    );

    const timeline = model.rush ? `${esc(model.timeline)} (${c.expedited})` : esc(model.timeline);

    const style = `
    body,table{margin:0;padding:0}
    img{border:0;line-height:100%;outline:none;text-decoration:none}
    a{text-decoration:none}
    @media (prefers-color-scheme:dark){
      .ebody{background-color:#050505!important}
      .ecard{background-color:#0d0d0d!important;border-color:#1f1f1f!important}
      .etxt{color:#f5f5f5!important}
      .emut{color:#8a8a8a!important}
      .ehair{border-color:#262626!important}
      .eacc{color:${t.accentDark}!important}
      .epill{background:${t.pillDark.bg}!important;border-color:${t.pillDark.border}!important;color:${t.pillDark.text}!important}
      .epilln{border-color:#3f3f46!important;color:#a3a3a3!important}
      .elogo{border:1px solid rgba(255,255,255,0.12)!important}
      .etopbar{background:${t.topBarDark}!important}
    }
    @media only screen and (max-width:600px){
      .ecard{width:100%!important;border-radius:0!important;border-left:none!important;border-right:none!important}
      .epx{padding-left:20px!important;padding-right:20px!important}
      .ebignum{font-size:30px!important}
    }`;

    return `<!doctype html><html lang="${model.lang}"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<style>${style}</style>
</head>
<body class="ebody" style="margin:0;padding:0;background-color:#f4f4f5">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" class="ebody" style="background-color:#f4f4f5;font-family:${SANS}">
  <tr><td align="center" style="padding:24px 12px">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" class="ecard" style="max-width:600px;background-color:#ffffff;border:1px solid #ededed;border-radius:14px;overflow:hidden">

      <tr><td class="etopbar" height="4" style="height:4px;line-height:4px;font-size:0;background:${t.topBarLight}">&nbsp;</td></tr>

      <tr><td class="epx" style="${pad};padding-top:22px">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
          <td valign="middle" align="left">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
              <td width="44" height="44" align="center" valign="middle" style="background-color:${t.chipBg};border-radius:12px"><img src="cid:service" alt="${esc(model.serviceLabel)}" width="24" height="24" style="display:block;width:24px;height:24px"></td>
              <td valign="middle" style="padding-left:13px">
                <div class="etxt" style="font-family:${SANS};font-size:15px;font-weight:700;color:#171717;letter-spacing:-0.01em">${esc(model.serviceLabel)}</div>
                <div class="emut" style="font-family:${SANS};font-size:11px;color:#737373;padding-top:1px">${c.subline}</div>
              </td>
            </tr></table>
          </td>
          <td valign="middle" align="right">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="right"><tr>
              <td valign="middle" class="etxt" style="padding-right:11px;font-family:${SANS};font-size:14px;font-weight:700;color:#171717;letter-spacing:-0.01em">Jose Veiga</td>
              <td valign="middle"><img src="cid:logo" alt="Jose Veiga" width="34" height="34" class="elogo" style="display:block;width:34px;height:34px;border-radius:8px"></td>
            </tr></table>
          </td>
        </tr></table>
      </td></tr>

      <tr><td class="epx" style="${pad};padding-top:22px">
        <div class="etxt" style="font-family:${SANS};font-size:24px;font-weight:800;color:#171717;letter-spacing:-0.02em;line-height:1.15">${esc(model.name)}</div>
        ${model.company.trim() ? `<div class="emut" style="font-family:${SANS};font-size:12px;color:#737373;padding-top:3px">${esc(model.company)}</div>` : ''}
        <div style="padding-top:18px">
          ${eyebrow(c.estimate)}
          <div class="ebignum eacc" style="font-family:${MONO};font-size:34px;font-weight:800;color:${t.accentLight};letter-spacing:-0.03em;line-height:1.05;padding-top:4px">${fmt(model.estimateMin)}<span class="emut" style="color:#a3a3a3;font-weight:400"> – </span>${fmt(model.estimateMax)}</div>
          <div class="emut" style="font-family:${SANS};font-size:12px;color:#737373;padding-top:6px">${c.ivaNote} · ${c.delivery} ${timeline}</div>
        </div>
      </td></tr>

      ${contact}
      ${configuration}
      ${addons}
      ${publishing}
      ${notes}

      <tr><td class="epx ehair" style="${pad};padding-top:20px;padding-bottom:24px;border-top:1px solid #ededed">
        <span class="emut" style="font-family:${SANS};font-size:11px;color:#737373">Jose Veiga · ${c.role} · <a class="eacc" href="https://joseveiga.dev" style="color:${t.accentLight};text-decoration:none">joseveiga.dev</a></span>
      </td></tr>

    </table>
  </td></tr>
</table>
</body></html>`;
}
