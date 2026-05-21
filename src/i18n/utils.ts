import { ui, defaultLang, type Lang, type UIKey } from './ui';

/** Read the active locale from the first URL path segment (e.g. /es/..., /en/...). */
export function getLangFromUrl(url: URL): Lang {
    const [, seg] = url.pathname.split('/');
    if (seg in ui) return seg as Lang;
    return defaultLang;
}

/** Translator bound to a locale, with fallback to the default locale. */
export function useTranslations(lang: Lang) {
    return function t(key: UIKey): string {
        return ui[lang][key] ?? ui[defaultLang][key];
    };
}

/** The two locales, in display order. */
export const locales: Lang[] = ['es', 'en'];
