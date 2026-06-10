// Generates the site favicons, touch icons, manifest icons and the OG image
// from the JV mark (same paths as public/favicon.svg). Run from app/:
//   node scripts/gen-site-icons.mjs
// sharp ships with Astro's dependencies; resolved from the pnpm store.
import { createRequire } from 'node:module';
import { readdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.join(here, '..');
const pnpmDir = path.join(appRoot, 'node_modules', '.pnpm');
const sharpPkg = readdirSync(pnpmDir).find((d) => d.startsWith('sharp@'));
if (!sharpPkg) throw new Error('sharp not found in node_modules/.pnpm');
const require = createRequire(import.meta.url);
const sharp = require(path.join(pnpmDir, sharpPkg, 'node_modules', 'sharp'));

const pub = (...p) => path.join(appRoot, 'public', ...p);

// "JV" — JetBrains Mono Bold converted to paths (same as favicon.svg).
const GRADIENT = `<linearGradient id="g" gradientUnits="userSpaceOnUse" x1="44" y1="55" x2="156" y2="145">
    <stop offset="0%" stop-color="#818cf8"/>
    <stop offset="100%" stop-color="#22d3ee"/>
  </linearGradient>`;
const JV_PATHS = `<path fill="url(#g)" d="M69.64 134.04Q59.43 134.04 53.49 128.43Q47.56 122.82 47.56 113.25H59.06Q59.06 118.22 61.87 121.11Q64.67 124.01 69.64 124.01Q74.52 124.01 77.37 121.16Q80.22 118.31 80.22 113.34V65.96H91.72V113.34Q91.72 122.91 85.79 128.47Q79.85 134.04 69.64 134.04Z"/>
  <path fill="url(#g)" d="M120.15 133.12 103.22 65.96H115.09L125.3 109.75Q126.13 112.97 126.82 116.7Q127.51 120.42 127.88 122.63Q128.24 120.42 128.93 116.7Q129.62 112.97 130.45 109.66L140.3 65.96H151.98L135.05 133.12Z"/>`;

const markSvg = (rx) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="19.77 20 160 160">
  <defs>${GRADIENT}</defs>
  <rect x="19.77" y="20" width="160" height="160" rx="${rx}" fill="#0F172A"/>
  ${JV_PATHS}
</svg>`;

const OG_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    ${GRADIENT}
    <linearGradient id="acc" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1200" y2="0">
      <stop offset="0" stop-color="#818cf8"/>
      <stop offset="1" stop-color="#22d3ee"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.82" cy="0.18" r="0.65">
      <stop offset="0" stop-color="#0ea5e9" stop-opacity="0.14"/>
      <stop offset="1" stop-color="#0ea5e9" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="#0a0a0a"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect width="1200" height="8" fill="url(#acc)"/>
  <g transform="translate(80,96) scale(0.9) translate(-19.77,-20)">
    <rect x="19.77" y="20" width="160" height="160" rx="34" fill="#0F172A" stroke="#27272a" stroke-width="2"/>
    ${JV_PATHS}
  </g>
  <text x="80" y="352" font-family="JetBrains Mono,Consolas,monospace" font-size="30" fill="#38bdf8">&gt; solo developer · software end-to-end</text>
  <text x="76" y="452" font-family="JetBrains Mono,Consolas,monospace" font-weight="bold" font-size="92" fill="#ffffff">Jose Veiga</text>
  <text x="80" y="520" font-family="JetBrains Mono,Consolas,monospace" font-size="38" fill="#d4d4d4">Software that ships.</text>
  <text x="80" y="578" font-family="JetBrains Mono,Consolas,monospace" font-size="26" fill="#737373">Bedrock add-ons · Unity · Flutter apps · Websites</text>
  <text x="1120" y="578" text-anchor="end" font-family="JetBrains Mono,Consolas,monospace" font-size="26" fill="#38bdf8">joseveiga.dev</text>
</svg>`;

// ICO container with a single PNG entry (PNG-in-ICO, supported everywhere modern).
function pngToIco(png, size) {
  const header = Buffer.alloc(22);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(1, 4); // image count
  header.writeUInt8(size === 256 ? 0 : size, 6); // width
  header.writeUInt8(size === 256 ? 0 : size, 7); // height
  header.writeUInt8(0, 8); // palette
  header.writeUInt8(0, 9); // reserved
  header.writeUInt16LE(1, 10); // planes
  header.writeUInt16LE(32, 12); // bpp
  header.writeUInt32LE(png.length, 14); // data size
  header.writeUInt32LE(22, 18); // data offset
  return Buffer.concat([header, png]);
}

const render = (svg, size) => sharp(Buffer.from(svg), { density: 300 }).resize(size, size).png().toBuffer();

const rounded = markSvg(34); // matches favicon.svg corner radius
const fullBleed = markSvg(0); // iOS/Android apply their own masks

const png32 = await render(rounded, 32);
writeFileSync(pub('favicon-32x32.png'), png32);
writeFileSync(pub('favicon.ico'), pngToIco(png32, 32));
writeFileSync(pub('apple-touch-icon.png'), await render(fullBleed, 180));
writeFileSync(pub('icon-192.png'), await render(fullBleed, 192));
writeFileSync(pub('icon-512.png'), await render(fullBleed, 512));
writeFileSync(pub('img', 'og-default.png'), await sharp(Buffer.from(OG_SVG)).png().toBuffer());

console.log('Generated: favicon-32x32.png, favicon.ico, apple-touch-icon.png, icon-192.png, icon-512.png, img/og-default.png');
