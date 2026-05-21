// UI string dictionary for chrome and short/loose copy.
// Structured content (service modules, pricing labels, hero/FAQ blocks) lives
// per-locale in its own data files; this is for nav, buttons, labels, and the
// inline marketing strings on pages.

export const languages = { es: 'ES', en: 'EN' } as const;
export const defaultLang: Lang = 'es';
export type Lang = keyof typeof languages;

export const ui = {
    en: {
        // Header / nav
        'nav.home': 'Home',
        'nav.projects': 'Projects',
        'nav.services': 'Services',
        'nav.resources': 'Resources',
        'nav.contact': 'Contact',
        'nav.switchLang': 'Switch to Spanish',
        // Footer
        'footer.developedBy': 'Developed by Jose Veiga',
    },
    es: {
        // Header / nav
        'nav.home': 'Inicio',
        'nav.projects': 'Proyectos',
        'nav.services': 'Servicios',
        'nav.resources': 'Recursos',
        'nav.contact': 'Contacto',
        'nav.switchLang': 'Cambiar a inglés',
        // Footer
        'footer.developedBy': 'Desarrollado por Jose Veiga',
    },
} as const;

export type UIKey = keyof (typeof ui)['en'];
