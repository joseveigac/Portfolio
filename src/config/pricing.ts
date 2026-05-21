// Per-service pricing for the Scope Estimator on /services/* pages.
// Range shown to the visitor is the sum of the selected scale's range plus
// each enabled toggle's range. When "Rush" is checked the final range is
// multiplied by RUSH_MULTIPLIER. Timeline is derived from the selected Scale
// (display only — the visitor does not pick it).

export type Range = readonly [number, number];

export interface ScaleOption {
    readonly value: string;
    readonly label: string;
    readonly range: Range;
    readonly timeline: string;
}

export interface ToggleOption {
    readonly value: string;
    readonly label: string;
    readonly range?: Range;
    readonly percent?: Range;
    readonly months?: number;
    readonly minAmount?: number;
}

export interface VersionOption {
    readonly value: string;
    readonly label: string;
}

export interface VersionField {
    readonly name: string;
    readonly label: string;
    readonly options: readonly VersionOption[];
}

export interface PublishingOption {
    readonly value: string;
    readonly label: string;
    readonly range: Range;
}

export interface PublishingField {
    readonly label: string;
    readonly note: string;
    readonly options: readonly PublishingOption[];
}

export interface ServiceConfig {
    readonly service: string;
    readonly serviceLabel: string;
    readonly cardTimeline: string;
    readonly scale: readonly ScaleOption[];
    readonly toggles: readonly ToggleOption[];
    readonly version?: VersionField;
    readonly publishing?: PublishingField;
}

export type ServiceKey = 'bedrock' | 'unity' | 'flutter' | 'websites';

export const RUSH_MULTIPLIER = 1.3;

export const PRICING: Record<ServiceKey, ServiceConfig> = {
    bedrock: {
        service: 'bedrock',
        serviceLabel: 'Bedrock add-ons',
        cardTimeline: 'from 2 weeks',
        scale: [
            { value: 'mini', label: 'Minimal add-on (1 system)', range: [150, 240], timeline: '2 weeks' },
            { value: 'single', label: 'Basic add-on (2–4 systems)', range: [395, 665], timeline: '2 weeks' },
            { value: 'multi', label: 'Full add-on (5–8 systems)', range: [880, 1590], timeline: '3–4 weeks' },
            { value: 'marketplace', label: 'Marketplace add-on', range: [2200, 5500], timeline: '2–3 months' },
        ],
        toggles: [
            { value: 'custom-ui', label: 'Custom UI — 1-2 screens (JSON UI)', range: [180, 400] },
            { value: 'custom-art', label: 'Custom art — ~3-5 assets (3D, textures, VFX, SFX)', range: [80, 200] },
            { value: 'i18n', label: 'Localization (EN + 2 more)', range: [150, 300] },
            { value: 'support60', label: 'Extended 60-day support', percent: [15, 20], months: 1, minAmount: 40 },
        ],
        version: {
            name: 'bedrockVersion',
            label: 'Bedrock version',
            options: [
                { value: 'latest', label: 'Latest Version' },
                { value: '26.21', label: '26.21' },
                { value: '26.20', label: '26.20' },
                { value: '26.13', label: '26.13' },
                { value: '26.12', label: '26.12' },
                { value: '26.11', label: '26.11' },
            ],
        },
        publishing: {
            label: 'Publishing',
            note: "Account fees on you. Marketplace requires Microsoft Partner approval. I'll help with the development to pass the reviews in the estimated time.",
            options: [
                { value: 'mcpedl', label: 'MCPEDL', range: [40, 80] },
                { value: 'curseforge', label: 'CurseForge', range: [40, 80] },
            ],
        },
    },
    unity: {
        service: 'unity',
        serviceLabel: 'Unity development',
        cardTimeline: 'from 2 weeks',
        scale: [
            { value: 'prototype', label: 'Prototype', range: [380, 760], timeline: '2 weeks' },
            { value: 'mini-game', label: 'Small project', range: [800, 1400], timeline: '3–4 weeks' },
            { value: 'small', label: 'Full project', range: [1500, 2850], timeline: '5–8 weeks' },
            { value: 'full', label: 'Extended project', range: [4275, 7125], timeline: '3–4 months' },
        ],
        toggles: [
            { value: 'multiplayer', label: 'Multiplayer / netcode', percent: [60, 100], minAmount: 250 },
            { value: 'backend', label: 'Backend / API integration', percent: [30, 50], minAmount: 150 },
            { value: 'mobile-builds', label: 'Mobile build pipeline (Xcode signing, certs, IAP wiring)', range: [250, 500] },
            { value: 'monetization', label: 'Monetisation (IAP / ads / analytics)', range: [300, 600] },
            { value: 'perf-qa', label: 'Performance & QA pass', percent: [50, 80], minAmount: 200 },
            { value: 'i18n', label: 'Localization (framework + 1 language)', range: [150, 300] },
            { value: 'support60', label: 'Extended 60-day support', percent: [15, 20], months: 1, minAmount: 40 },
        ],
        publishing: {
            label: 'Publishing',
            note: "Account fees on you (Steam Direct $100/title, Apple Developer $99/yr, Google Play $25 one-time). I'll help with account setup where I can be added as developer/editor.",
            options: [
                { value: 'steam', label: 'Steam', range: [40, 100] },
                { value: 'itchio', label: 'itch.io', range: [30, 60] },
                { value: 'google-play', label: 'Google Play', range: [30, 70] },
                { value: 'app-store', label: 'Apple App Store', range: [40, 90] },
            ],
        },
    },
    flutter: {
        service: 'flutter',
        serviceLabel: 'Flutter apps',
        cardTimeline: 'from 2 weeks',
        scale: [
            { value: 'singleScreen', label: 'Single-screen app', range: [850, 1450], timeline: '2 weeks' },
            { value: 'mvp', label: 'MVP app (3–5 screens)', range: [1850, 3090], timeline: '4–6 weeks' },
            { value: 'standard', label: 'Standard app (~8 screens)', range: [4750, 7125], timeline: '2–3 months' },
            { value: 'full', label: 'Full-featured app', range: [9025, 11875], timeline: '4–5 months' },
        ],
        toggles: [
            { value: 'backend', label: 'Backend + auth', percent: [20, 30], minAmount: 300 },
            { value: 'payments', label: 'Payments (IAP / Stripe / PayPal)', range: [760, 1380] },
            { value: 'device', label: 'Device features (camera, maps, push, files)', range: [620, 1235] },
            { value: 'adminPanel', label: 'Admin panel + ERP/CSV sync (Sage, Excel)', percent: [25, 50], minAmount: 800 },
            { value: 'i18n', label: 'Localization', range: [200, 400] },
            { value: 'support60', label: 'Extended 60-day support', percent: [15, 20], months: 1, minAmount: 40 },
        ],
        publishing: {
            label: 'Publishing',
            note: "Account fees on you (Apple Developer $99/yr, Google Play $25 one-time). I'll help with account setup where I can be added as developer/editor.",
            options: [
                { value: 'google-play', label: 'Google Play', range: [30, 70] },
                { value: 'app-store', label: 'Apple App Store', range: [40, 90] },
            ],
        },
    },
    websites: {
        service: 'websites',
        serviceLabel: 'Websites',
        cardTimeline: 'from 2 weeks',
        scale: [
            { value: 'one-pager', label: 'Single-page site', range: [200, 350], timeline: '2 weeks' },
            { value: 'small', label: 'Small site (≤5 pages)', range: [380, 665], timeline: '2 weeks' },
            { value: 'full', label: 'Full site (~10 pages)', range: [855, 1330], timeline: '3–4 weeks' },
        ],
        toggles: [
            { value: 'cms', label: 'Headless CMS (Astro + Storyblok)', range: [300, 500] },
            { value: 'multilingual', label: 'Multilingual', percent: [30, 50], minAmount: 80 },
            { value: 'seo', label: 'SEO + analytics (basic + schema/audit)', percent: [40, 60], minAmount: 120 },
            { value: 'content', label: 'Content production (copy, branding, photos)', percent: [60, 100], minAmount: 200 },
            { value: 'ecommerce', label: 'E-commerce / bookings (Stripe, catalog, reservations)', range: [950, 1900] },
            { value: 'rgpd', label: 'Cookie + privacy compliance (GDPR/RGPD)', range: [120, 250] },
            { value: 'support60', label: 'Extended 60-day support', percent: [15, 20], months: 1, minAmount: 40 },
        ],
        publishing: {
            label: 'Publishing',
            note: "Hosting/domain fees on you (Vercel Pro ~$20/mo for commercial use, domain ~€12/yr). I'll help with account setup where I can be added as developer/editor.",
            options: [
                { value: 'vercel', label: 'Vercel + custom domain (recommended for CMS workflow)', range: [30, 60] },
                { value: 'client-host', label: 'Client hosting (cPanel / FTP / SFTP)', range: [50, 100] },
            ],
        },
    },
};
