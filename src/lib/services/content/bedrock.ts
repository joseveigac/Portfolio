import type { ServiceContent } from './types';

export const BEDROCK_CONTENT: Record<'en' | 'es', ServiceContent> = {
    en: {
        slug: 'bedrock',
        included: [
            {
                title: 'CODE',
                bullets: [
                    'Full source code in a Git repo you own',
                    'TypeScript on Script API v2 (@minecraft/server 2.x)',
                    'Build scripts that package the .mcaddon',
                ],
            },
            {
                title: 'CONTENT',
                bullets: [
                    'Behavior Pack + Resource Pack',
                    'Custom blocks, items, and entities',
                    'Gameplay scripts for the agreed mechanics',
                    'State persistence across players and worlds',
                ],
            },
            {
                title: 'QUALITY',
                bullets: [
                    'Locked to your chosen Bedrock version',
                    'Tested on a dedicated server (multiplayer-safe)',
                    '30-day post-launch bug-fix guarantee',
                ],
            },
            {
                title: 'HANDOVER',
                bullets: [
                    'Git repo with full push access',
                    'Install, build, and architecture docs',
                    'Full IP transfer on final payment',
                ],
            },
        ],
        outOfScope: [
            'Marketplace submission and Partner Program account (you submit under your own Partner account)',
            'Server hosting',
            'Merging with third-party addons',
            'Java Edition ports',
            'Ongoing content drops (separate retainer)',
        ],
        deliverables: [
            'Packaged .mcaddon (Behavior + Resource Pack)',
            'TypeScript source repo on your GitHub or GitLab',
            'Install, build, and architecture docs',
            '30-day support email channel',
        ],
    },
    es: {
        slug: 'bedrock',
        included: [
            {
                title: 'CÓDIGO',
                bullets: [
                    'Todo el código fuente en un repo Git tuyo',
                    'TypeScript sobre Script API v2 (@minecraft/server 2.x)',
                    'Scripts de build que empaquetan el .mcaddon',
                ],
            },
            {
                title: 'CONTENIDO',
                bullets: [
                    'Behavior Pack + Resource Pack',
                    'Bloques, objetos y entidades personalizados',
                    'Scripts de juego para las mecánicas acordadas',
                    'Persistencia de estado entre jugadores y mundos',
                ],
            },
            {
                title: 'CALIDAD',
                bullets: [
                    'Fijado a la versión de Bedrock que elijas',
                    'Probado en servidor dedicado (seguro en multijugador)',
                    'Garantía de corrección de errores 30 días tras el lanzamiento',
                ],
            },
            {
                title: 'ENTREGA',
                bullets: [
                    'Repo Git con acceso push completo',
                    'Documentación de instalación, build y arquitectura',
                    'Transferencia completa de la propiedad intelectual al pago final',
                ],
            },
        ],
        outOfScope: [
            'Envío al Marketplace y cuenta del Partner Program (envías con tu propia cuenta de Partner)',
            'Hosting del servidor',
            'Fusión con addons de terceros',
            'Ports a Java Edition',
            'Lanzamientos de contenido recurrentes (contrato aparte)',
        ],
        deliverables: [
            '.mcaddon empaquetado (Behavior + Resource Pack)',
            'Repo de código TypeScript en tu GitHub o GitLab',
            'Documentación de instalación, build y arquitectura',
            'Canal de soporte por email 30 días',
        ],
    },
};
