import type { ServiceContent } from './types';

export const UNITY_CONTENT: Record<'en' | 'es', ServiceContent> = {
    en: {
        slug: 'unity',
        included: [
            {
                title: 'ENGINEERING',
                bullets: [
                    'Gameplay systems and tooling in C#',
                    'Backend integration (Firebase, REST, custom)',
                    'Build pipelines configured per platform',
                ],
            },
            {
                title: 'PRODUCTION',
                bullets: [
                    '2D and 3D pipelines',
                    'Agile sprints with weekly playable builds',
                    'Works alongside your art, design, and sound team',
                ],
            },
            {
                title: 'QUALITY',
                bullets: [
                    'Device testing on target hardware',
                    'Performance profiling (frame time, memory, draws)',
                    'Android API upgrades and compatibility fixes',
                ],
            },
            {
                title: 'LAUNCH',
                bullets: [
                    'Store builds per platform (Steam, mobile, PC)',
                    'Monetisation hooks (IAP, ads, analytics)',
                    '30-day post-launch bug-fix support',
                ],
            },
        ],
        outOfScope: [
            'Art assets (3D, animation, music) — client-provided or commissioned',
            'Publishing under non-client Apple, Google, or Steam accounts',
            'Marketing, user acquisition, ASO',
            'LiveOps content drops after launch (separate retainer)',
            'Backend ops after handover (build, not run)',
        ],
        deliverables: [
            'Source repo on your GitHub or GitLab',
            'Signed builds per platform (.aab / .ipa / Steam / WebGL)',
            'README with build steps and secrets layout',
            '30-day support email channel',
        ],
    },
    es: {
        slug: 'unity',
        included: [
            {
                title: 'INGENIERÍA',
                bullets: [
                    'Sistemas de juego y herramientas en C#',
                    'Integración de backend (Firebase, REST, a medida)',
                    'Pipelines de build configurados por plataforma',
                ],
            },
            {
                title: 'PRODUCCIÓN',
                bullets: [
                    'Pipelines 2D y 3D',
                    'Sprints ágiles con builds jugables semanales',
                    'Trabajo junto a tu equipo de arte, diseño y sonido',
                ],
            },
            {
                title: 'CALIDAD',
                bullets: [
                    'Pruebas en el hardware objetivo',
                    'Profiling de rendimiento (frame time, memoria, draws)',
                    'Actualizaciones de API de Android y arreglos de compatibilidad',
                ],
            },
            {
                title: 'LANZAMIENTO',
                bullets: [
                    'Builds de tienda por plataforma (Steam, móvil, PC)',
                    'Hooks de monetización (IAP, anuncios, analítica)',
                    'Soporte de corrección de errores 30 días tras el lanzamiento',
                ],
            },
        ],
        outOfScope: [
            'Assets de arte (3D, animación, música) — los aporta el cliente o se encargan',
            'Publicación en cuentas de Apple, Google o Steam que no sean del cliente',
            'Marketing, captación de usuarios, ASO',
            'Lanzamientos de contenido LiveOps tras el lanzamiento (contrato aparte)',
            'Operación del backend tras la entrega (lo construyo, no lo opero)',
        ],
        deliverables: [
            'Repo de código en tu GitHub o GitLab',
            'Builds firmadas por plataforma (.aab / .ipa / Steam / WebGL)',
            'README con los pasos de build y la estructura de secrets',
            'Canal de soporte por email 30 días',
        ],
    },
};
