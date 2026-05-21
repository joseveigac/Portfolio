// Spanish label overrides for the Scope Estimator.
// Numbers/ranges live ONLY in pricing.ts (single source of truth). This file
// overrides the user-facing *labels* for the `es` locale; localizeConfig() merges
// them onto the English config so prices can never drift between locales.

import type { ServiceConfig, ServiceKey } from './pricing';

interface ServiceEs {
    serviceLabel: string;
    cardTimeline: string;
    scale: Record<string, { label: string; timeline: string }>;
    toggles: Record<string, string>;
    version?: { label: string; options: Record<string, string> };
    publishing?: { label: string; note: string; options: Record<string, string> };
}

export const PRICING_ES: Record<ServiceKey, ServiceEs> = {
    bedrock: {
        serviceLabel: 'Add-ons de Bedrock',
        cardTimeline: 'desde 2 semanas',
        scale: {
            mini:        { label: 'Add-on mínimo (1 sistema)', timeline: '2 semanas' },
            single:      { label: 'Add-on básico (2–4 sistemas)', timeline: '2 semanas' },
            multi:       { label: 'Add-on completo (5–8 sistemas)', timeline: '3–4 semanas' },
            marketplace: { label: 'Add-on para Marketplace', timeline: '2–3 meses' },
        },
        toggles: {
            'custom-ui':  'UI personalizada — 1-2 pantallas (JSON UI)',
            'custom-art': 'Arte personalizado — ~3-5 assets (3D, texturas, VFX, SFX)',
            i18n:         'Localización (EN + 2 idiomas más)',
            support60:    'Soporte ampliado 60 días',
        },
        version: {
            label: 'Versión de Bedrock',
            options: { latest: 'Última versión' },
        },
        publishing: {
            label: 'Publicación',
            note: 'Las cuotas de cuenta corren de tu parte. El Marketplace requiere aprobación como Microsoft Partner. Te ayudo con el desarrollo para pasar las revisiones en el tiempo estimado.',
            options: {},
        },
    },
    unity: {
        serviceLabel: 'Desarrollo en Unity',
        cardTimeline: 'desde 2 semanas',
        scale: {
            prototype:   { label: 'Prototipo', timeline: '2 semanas' },
            'mini-game': { label: 'Proyecto pequeño', timeline: '3–4 semanas' },
            small:       { label: 'Proyecto completo', timeline: '5–8 semanas' },
            full:        { label: 'Proyecto ampliado', timeline: '3–4 meses' },
        },
        toggles: {
            multiplayer:     'Multijugador / netcode',
            backend:         'Backend / integración de API',
            'mobile-builds': 'Pipeline de builds móviles (firma Xcode, certificados, IAP)',
            monetization:    'Monetización (IAP / anuncios / analítica)',
            'perf-qa':       'Pase de rendimiento y QA',
            i18n:            'Localización (framework + 1 idioma)',
            support60:       'Soporte ampliado 60 días',
        },
        publishing: {
            label: 'Publicación',
            note: 'Las cuotas de cuenta corren de tu parte (Steam Direct 100$/título, Apple Developer 99$/año, Google Play 25$ pago único). Te ayudo con la configuración de cuentas donde se me pueda añadir como desarrollador/editor.',
            options: {},
        },
    },
    flutter: {
        serviceLabel: 'Apps Flutter',
        cardTimeline: 'desde 2 semanas',
        scale: {
            singleScreen: { label: 'App de una pantalla', timeline: '2 semanas' },
            mvp:          { label: 'App MVP (3–5 pantallas)', timeline: '4–6 semanas' },
            standard:     { label: 'App estándar (~8 pantallas)', timeline: '2–3 meses' },
            full:         { label: 'App completa', timeline: '4–5 meses' },
        },
        toggles: {
            backend:    'Backend + autenticación',
            payments:   'Pagos (IAP / Stripe / PayPal)',
            device:     'Funciones del dispositivo (cámara, mapas, push, archivos)',
            adminPanel: 'Panel de administración + sync ERP/CSV (Sage, Excel)',
            i18n:       'Localización',
            support60:  'Soporte ampliado 60 días',
        },
        publishing: {
            label: 'Publicación',
            note: 'Las cuotas de cuenta corren de tu parte (Apple Developer 99$/año, Google Play 25$ pago único). Te ayudo con la configuración de cuentas donde se me pueda añadir como desarrollador/editor.',
            options: {},
        },
    },
    websites: {
        serviceLabel: 'Webs',
        cardTimeline: 'desde 2 semanas',
        scale: {
            'one-pager': { label: 'Web de una página', timeline: '2 semanas' },
            small:       { label: 'Web pequeña (≤5 páginas)', timeline: '2 semanas' },
            full:        { label: 'Web completa (~10 páginas)', timeline: '3–4 semanas' },
        },
        toggles: {
            cms:          'CMS headless (Astro + Storyblok)',
            multilingual: 'Multilingüe',
            seo:          'SEO + analítica (básico + schema/auditoría)',
            content:      'Producción de contenido (textos, branding, fotos)',
            ecommerce:    'E-commerce / reservas (Stripe, catálogo, reservas)',
            rgpd:         'Cumplimiento de cookies y privacidad (RGPD)',
            support60:    'Soporte ampliado 60 días',
        },
        publishing: {
            label: 'Publicación',
            note: 'El hosting/dominio corre de tu parte (Vercel Pro ~20$/mes para uso comercial, dominio ~12€/año). Te ayudo con la configuración de cuentas donde se me pueda añadir como desarrollador/editor.',
            options: {
                vercel:        'Vercel + dominio propio (recomendado para flujo con CMS)',
                'client-host': 'Hosting del cliente (cPanel / FTP / SFTP)',
            },
        },
    },
};

/** Merge Spanish labels onto the English config; numbers come from `c` untouched. */
export function localizeConfig(c: ServiceConfig, es: ServiceEs): ServiceConfig {
    return {
        ...c,
        serviceLabel: es.serviceLabel,
        cardTimeline: es.cardTimeline,
        scale: c.scale.map(s => ({
            ...s,
            label: es.scale[s.value]?.label ?? s.label,
            timeline: es.scale[s.value]?.timeline ?? s.timeline,
        })),
        toggles: c.toggles.map(t => ({ ...t, label: es.toggles[t.value] ?? t.label })),
        version: c.version && {
            ...c.version,
            label: es.version?.label ?? c.version.label,
            options: c.version.options.map(o => ({ ...o, label: es.version?.options[o.value] ?? o.label })),
        },
        publishing: c.publishing && {
            ...c.publishing,
            label: es.publishing?.label ?? c.publishing.label,
            note: es.publishing?.note ?? c.publishing.note,
            options: c.publishing.options.map(o => ({ ...o, label: es.publishing?.options[o.value] ?? o.label })),
        },
    };
}
