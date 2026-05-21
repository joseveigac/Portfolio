import type { ServiceContent } from './types';

export const FLUTTER_CONTENT: Record<'en' | 'es', ServiceContent> = {
    en: {
        slug: 'flutter',
        included: [
            {
                title: 'ENGINEERING',
                bullets: [
                    'Single Dart codebase — iOS, Android, optional Web',
                    'Native build pipelines (Gradle, Xcode signing)',
                    'Dev, staging, and production environments',
                ],
            },
            {
                title: 'PLATFORMS',
                bullets: [
                    'Google Play (Android) builds',
                    'App Store (iOS) builds — uses your Apple Developer account',
                    'Native plugins for platform-specific features',
                ],
            },
            {
                title: 'BACKEND',
                bullets: [
                    'Firebase (Auth, Firestore, Storage, Functions)',
                    'Integration with your existing REST or GraphQL API',
                    'Push, offline sync, and real-time features when scoped',
                ],
            },
            {
                title: 'LAUNCH',
                bullets: [
                    'Store listings, signing, and submission',
                    'Rejection-iteration support during review',
                    '30-day post-launch bug-fix support',
                ],
            },
        ],
        outOfScope: [
            'Apple and Google store accounts (stay with you)',
            'Backend ops after handover (build, not run)',
            'Custom PCI card vaulting — Stripe and PayPal SDKs only',
            'ASO, paid marketing, user acquisition',
            'Native Swift or Kotlin apps from scratch (Flutter only)',
        ],
        deliverables: [
            'Source repo on your GitHub or GitLab',
            'Signed .aab (Play) and .ipa (App Store)',
            'Store listing copy, screenshots, feature graphics',
            'Build and deploy guide + secrets documentation',
            '30-day support email channel',
        ],
    },
    es: {
        slug: 'flutter',
        included: [
            {
                title: 'INGENIERÍA',
                bullets: [
                    'Un único código Dart — iOS, Android, Web opcional',
                    'Pipelines de build nativas (Gradle, firma Xcode)',
                    'Entornos de desarrollo, staging y producción',
                ],
            },
            {
                title: 'PLATAFORMAS',
                bullets: [
                    'Builds de Google Play (Android)',
                    'Builds de App Store (iOS) — usa tu cuenta de Apple Developer',
                    'Plugins nativos para funciones específicas de plataforma',
                ],
            },
            {
                title: 'BACKEND',
                bullets: [
                    'Firebase (Auth, Firestore, Storage, Functions)',
                    'Integración con tu API REST o GraphQL existente',
                    'Push, sincronización offline y funciones en tiempo real cuando entren en el alcance',
                ],
            },
            {
                title: 'LANZAMIENTO',
                bullets: [
                    'Fichas de tienda, firma y envío',
                    'Soporte de iteración ante rechazos durante la revisión',
                    'Soporte de corrección de errores 30 días tras el lanzamiento',
                ],
            },
        ],
        outOfScope: [
            'Cuentas de las tiendas de Apple y Google (son tuyas)',
            'Operación del backend tras la entrega (lo construyo, no lo opero)',
            'Almacenamiento PCI de tarjetas a medida — solo SDKs de Stripe y PayPal',
            'ASO, marketing de pago, captación de usuarios',
            'Apps nativas en Swift o Kotlin desde cero (solo Flutter)',
        ],
        deliverables: [
            'Repo de código en tu GitHub o GitLab',
            '.aab firmado (Play) y .ipa (App Store)',
            'Textos de ficha, capturas y gráficos destacados',
            'Guía de build y despliegue + documentación de secrets',
            'Canal de soporte por email 30 días',
        ],
    },
};
