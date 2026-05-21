import type { ServiceContent } from './types';

export const WEBSITES_CONTENT: Record<'en' | 'es', ServiceContent> = {
    en: {
        slug: 'websites',
        included: [
            {
                title: 'ENGINEERING',
                bullets: [
                    'Astro + Tailwind, statically built — no server cost',
                    'Optional Storyblok CMS — edit content yourself',
                    'Mobile-responsive layouts',
                    'Forms with email notifications',
                ],
            },
            {
                title: 'DESIGN',
                bullets: [
                    'Custom layout from your brief and references',
                    'Brand-consistent typography and colour',
                    '1 design round + 1 content round of revisions',
                ],
            },
            {
                title: 'PERFORMANCE',
                bullets: [
                    'Lighthouse ≥ 90 across all four scores',
                    'Image optimisation and Core Web Vitals tuning',
                    'Caching headers and CDN configuration',
                ],
            },
            {
                title: 'LAUNCH',
                bullets: [
                    'Deploy to your hosting (Cloudflare Pages, Netlify, Vercel)',
                    'SEO basics + cookie banner / GDPR page',
                    'Domain pointing assistance',
                    'CMS handover: Storyblok space transferred to you, auto-rebuild on publish',
                ],
            },
        ],
        outOfScope: [
            'Long-term content writing or moderation',
            'Paid-ad campaigns (Google Ads, Meta Ads)',
            'Hosting ops after setup (you own the host)',
            'Domain purchase (you buy it, Jose configures it)',
            'Full T&Cs or custom cookie policy beyond GDPR boilerplate',
            'Email-marketing campaigns (integration only)',
        ],
        deliverables: [
            'Source repo on your GitHub',
            'Hosting deploy access (Cloudflare Pages, Netlify, or Vercel)',
            'Storyblok space transferred to your account (when CMS is in scope)',
            'Editing manual + domain pointing instructions',
            '30-day support email channel',
        ],
    },
    es: {
        slug: 'websites',
        included: [
            {
                title: 'INGENIERÍA',
                bullets: [
                    'Astro + Tailwind, generado estáticamente — sin coste de servidor',
                    'CMS Storyblok opcional — edita el contenido tú mismo',
                    'Diseños responsive en móvil',
                    'Formularios con notificaciones por email',
                ],
            },
            {
                title: 'DISEÑO',
                bullets: [
                    'Diseño a medida a partir de tu brief y referencias',
                    'Tipografía y color coherentes con tu marca',
                    '1 ronda de revisión de diseño + 1 de contenido',
                ],
            },
            {
                title: 'RENDIMIENTO',
                bullets: [
                    'Lighthouse ≥ 90 en las cuatro métricas',
                    'Optimización de imágenes y ajuste de Core Web Vitals',
                    'Cabeceras de caché y configuración de CDN',
                ],
            },
            {
                title: 'LANZAMIENTO',
                bullets: [
                    'Despliegue en tu hosting (Cloudflare Pages, Netlify, Vercel)',
                    'SEO básico + banner de cookies / página RGPD',
                    'Ayuda para apuntar el dominio',
                    'Entrega del CMS: el espacio de Storyblok se transfiere a ti, con rebuild automático al publicar',
                ],
            },
        ],
        outOfScope: [
            'Redacción o moderación de contenido a largo plazo',
            'Campañas de anuncios de pago (Google Ads, Meta Ads)',
            'Operación del hosting tras la configuración (el hosting es tuyo)',
            'Compra del dominio (lo compras tú, Jose lo configura)',
            'Términos y condiciones completos o política de cookies a medida más allá de la base RGPD',
            'Campañas de email marketing (solo integración)',
        ],
        deliverables: [
            'Repo de código en tu GitHub',
            'Acceso de despliegue al hosting (Cloudflare Pages, Netlify o Vercel)',
            'Espacio de Storyblok transferido a tu cuenta (cuando el CMS entra en el alcance)',
            'Manual de edición + instrucciones para apuntar el dominio',
            'Canal de soporte por email 30 días',
        ],
    },
};
