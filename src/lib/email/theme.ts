// Per-service color for the brief email. Mirrors the on-page service themes in
// components/services/ServicePage.astro, but as raw hex/rgba (Tailwind classes are
// useless in email). Light values are the default (inline styles); dark values are
// applied via a prefers-color-scheme media block in the template.
import type { ServiceKey } from '../../config/pricing';

export interface EmailTheme {
    /** Self-coloured dark chip the service icon sits on (reads on light + dark). */
    chipBg: string;
    /** Accent for eyebrows/number/links on a light background (darker shade for contrast). */
    accentLight: string;
    /** Accent on a dark background (brighter shade). */
    accentDark: string;
    /** Thin top brand bar gradient, light + dark. */
    topBarLight: string;
    topBarDark: string;
    /** Add-on / publishing pills. */
    pillLight: { bg: string; border: string; text: string };
    pillDark: { bg: string; border: string; text: string };
    /** CTA button — bright accent with dark ink, same in both modes (matches the site). */
    ctaBg: string;
    ctaText: string;
}

export const EMAIL_THEMES: Record<ServiceKey, EmailTheme> = {
    bedrock: {
        chipBg: '#04382b',
        accentLight: '#047857',
        accentDark: '#34d399',
        topBarLight: 'linear-gradient(90deg,#10b981,#34d399)',
        topBarDark: 'linear-gradient(90deg,#065f46,#34d399)',
        pillLight: { bg: '#ecfdf5', border: '#a7f3d0', text: '#065f46' },
        pillDark: { bg: 'rgba(52,211,153,0.13)', border: 'rgba(52,211,153,0.3)', text: '#d1fae5' },
        ctaBg: '#34d399',
        ctaText: '#022c22',
    },
    unity: {
        chipBg: '#1e293b',
        accentLight: '#0369a1',
        accentDark: '#7dd3fc',
        topBarLight: 'linear-gradient(90deg,#64748b,#7dd3fc)',
        topBarDark: 'linear-gradient(90deg,#334155,#7dd3fc)',
        pillLight: { bg: '#f0f9ff', border: '#bae6fd', text: '#0c4a6e' },
        pillDark: { bg: 'rgba(125,211,252,0.13)', border: 'rgba(125,211,252,0.3)', text: '#e0f2fe' },
        ctaBg: '#7dd3fc',
        ctaText: '#0f172a',
    },
    flutter: {
        chipBg: '#0a2540',
        accentLight: '#0284c7',
        accentDark: '#38bdf8',
        topBarLight: 'linear-gradient(90deg,#075985,#38bdf8)',
        topBarDark: 'linear-gradient(90deg,#075985,#38bdf8)',
        pillLight: { bg: '#f0f9ff', border: '#bae6fd', text: '#0c4a6e' },
        pillDark: { bg: 'rgba(56,189,248,0.13)', border: 'rgba(56,189,248,0.3)', text: '#e0f2fe' },
        ctaBg: '#38bdf8',
        ctaText: '#082f49',
    },
    websites: {
        chipBg: '#3a1e07',
        accentLight: '#b45309',
        accentDark: '#fbbf24',
        topBarLight: 'linear-gradient(90deg,#9a3412,#fbbf24)',
        topBarDark: 'linear-gradient(90deg,#9a3412,#fbbf24)',
        pillLight: { bg: '#fffbeb', border: '#fde68a', text: '#92400e' },
        pillDark: { bg: 'rgba(251,191,36,0.13)', border: 'rgba(251,191,36,0.3)', text: '#fef3c7' },
        ctaBg: '#fbbf24',
        ctaText: '#451a03',
    },
};
