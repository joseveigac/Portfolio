// Ambient declaration for the side-effect-only font import in Layout.astro.
// @fontsource-variable/jetbrains-mono ships no type declarations, which made
// `astro check` report ts(2882) on the bare `import '...'`. This silences it.
declare module '@fontsource-variable/jetbrains-mono';
