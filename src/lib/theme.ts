// Shared presentational class maps.
// Full literal Tailwind class strings so the v4 scanner picks them up at build time.

export const serviceColors: Record<string, string> = {
    bedrock: 'bg-linear-to-br from-emerald-900 via-emerald-950 to-neutral-950',
    unity:   'bg-linear-to-b from-slate-500 via-slate-800 to-neutral-950',
    flutter: 'bg-linear-to-br from-sky-800 via-blue-950 to-neutral-950',
    web:     'bg-linear-to-br from-orange-950 via-neutral-900 to-neutral-950',
};

export const difficultyColors: Record<string, string> = {
    Beginner:     'bg-emerald-500/90',
    Intermediate: 'bg-amber-500/90',
    Advanced:     'bg-rose-500/90',
};

// Display labels for the resource `category` / `difficulty` enums (English in
// content.config.ts). Keyed by locale so the badges read in the active language;
// the enum value still keys difficultyColors above.
export const categoryLabels: Record<'en' | 'es', Record<string, string>> = {
    en: { Tutorial: 'Tutorial', Guide: 'Guide', Article: 'Article', Notes: 'Notes' },
    es: { Tutorial: 'Tutorial', Guide: 'Guía', Article: 'Artículo', Notes: 'Notas' },
};

export const difficultyLabels: Record<'en' | 'es', Record<string, string>> = {
    en: { Beginner: 'Beginner', Intermediate: 'Intermediate', Advanced: 'Advanced' },
    es: { Beginner: 'Principiante', Intermediate: 'Intermedio', Advanced: 'Avanzado' },
};
