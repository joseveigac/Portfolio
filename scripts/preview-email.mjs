// Dev-only preview: renders the brief email for all 4 services (light + forced-dark)
// and writes a grid page into the visual-brainstorm screen dir so it can be viewed in
// the browser. Run: node --experimental-strip-types scripts/preview-email.mjs
import { writeFileSync } from 'node:fs';
import { renderBriefEmail } from '../src/lib/email/brief-template.ts';
import { PERSONAL_LOGO_BASE64, SERVICE_ICON_BASE64 } from '../src/lib/email/logos.ts';

// cid: only resolves in an email client; for the browser preview, inline the logos as data URIs.
const inlineLogos = (html, service) =>
    html
        .replace('cid:logo', `data:image/png;base64,${PERSONAL_LOGO_BASE64}`)
        .replace('cid:service', `data:image/png;base64,${SERVICE_ICON_BASE64[service]}`);

const SAMPLES = {
    bedrock: {
        service: 'bedrock', serviceLabel: 'Bedrock add-ons', name: 'Marcus Webb',
        email: 'marcus@webbrealms.gg', company: 'Webb Realms', deadline: '2026-07-01',
        versionFieldLabel: 'Versión de Bedrock', versionLabel: 'Latest Version',
        scaleLabel: 'Full add-on (5–8 systems)', rush: true, rushPct: 30,
        addons: ['Custom UI — 1-2 screens (JSON UI)', 'Localization (EN + 2 more)'],
        hasPublishingField: true, publishing: ['MCPEDL', 'CurseForge'],
        notes: 'Quiero un add-on de economía con tienda, monedas y rankings.\nServidor survival, ~200 jugadores. Tengo arte propio.',
        estimateMin: 1430, estimateMax: 2587, timeline: '3–4 weeks',
    },
    unity: {
        service: 'unity', serviceLabel: 'Unity development', name: 'Aiko Tanaka',
        email: 'aiko@studionorth.io', company: 'Studio North', deadline: '',
        versionFieldLabel: '', versionLabel: '',
        scaleLabel: 'Full project', rush: false, rushPct: 30,
        addons: ['Multiplayer / netcode', 'Backend / API integration'],
        hasPublishingField: true, publishing: ['Steam'],
        notes: 'Co-op roguelike, 2–4 players. Existing prototype in Unity 6.',
        estimateMin: 2350, estimateMax: 4100, timeline: '5–8 weeks',
    },
    flutter: {
        service: 'flutter', serviceLabel: 'Flutter apps', name: 'Lucía Romero',
        email: 'lucia@finsa.es', company: 'Finsa', deadline: '2026-09-15',
        versionFieldLabel: '', versionLabel: '',
        scaleLabel: 'MVP app (3–5 screens)', rush: false, rushPct: 30,
        addons: ['Backend + auth', 'Payments (IAP / Stripe / PayPal)'],
        hasPublishingField: true, publishing: ['Apple App Store', 'Google Play'],
        notes: 'App de reservas para clínica. iOS + Android, login y pagos.',
        estimateMin: 2610, estimateMax: 4470, timeline: '4–6 weeks',
    },
    websites: {
        service: 'websites', serviceLabel: 'Websites', name: 'Tom Becker',
        email: 'tom@kaffeebar.de', company: '', deadline: '',
        versionFieldLabel: '', versionLabel: '',
        scaleLabel: 'Small site (≤5 pages)', rush: false, rushPct: 30,
        addons: [],
        hasPublishingField: true, publishing: [],
        notes: '',
        estimateMin: 380, estimateMax: 665, timeline: '2 weeks',
    },
};

const enc = (html) => html.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const cells = [];
for (const [key, m] of Object.entries(SAMPLES)) {
    const rendered = inlineLogos(renderBriefEmail({ lang: 'es', ...m }), key);
    // Force each column regardless of the viewer's OS theme: 'not all' never matches
    // (always light), 'all' always matches (always dark).
    const light = rendered.replace('(prefers-color-scheme:dark)', 'not all');
    const dark = rendered.replace('(prefers-color-scheme:dark)', 'all');
    cells.push(`
      <div class="svc"><div class="lbl">${key} · claro</div><iframe srcdoc="${enc(light)}"></iframe></div>
      <div class="svc"><div class="lbl">${key} · oscuro</div><iframe srcdoc="${enc(dark)}"></iframe></div>`);
}

const page = `<!doctype html><html lang="es"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Preview — brief email</title>
<style>
  body{margin:0;background:#18181b;color:#e4e4e7;font-family:'JetBrains Mono',ui-monospace,monospace;padding:28px}
  h2{margin:0 0 4px;font-size:18px}
  .subtitle{margin:0 0 22px;color:#a1a1aa;font-size:13px}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:18px 22px;max-width:1100px;margin:0 auto}
  .svc{display:flex;flex-direction:column;gap:6px}
  .lbl{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#9aa;font-weight:700}
  .svc iframe{width:100%;height:780px;border:1px solid #3f3f46;border-radius:10px;background:#fff}
</style></head><body>
<h2>Email final renderizado — 4 servicios, claro vs oscuro</h2>
<p class="subtitle">HTML real del email (no maqueta). Izquierda claro, derecha oscuro forzado. ¿Lo dejamos así o ajustamos algo?</p>
<div class="grid">${cells.join('')}</div>
</body></html>`;

const out = process.argv[2];
if (!out) { console.error('usage: node preview-email.mjs <output-html-path>'); process.exit(1); }
writeFileSync(out, page);
console.log('wrote', out);
