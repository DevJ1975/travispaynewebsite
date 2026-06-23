// Token presets exposed to the page builder. Editors pick from these — never raw
// CSS — so pages stay on-brand (doc 06 §7). Class strings are static so Tailwind's
// JIT compiler includes them.

export const BG_VARIANTS = [
  { label: 'Black', value: 'black' },
  { label: 'Surface', value: 'surface' },
  { label: 'Elevated', value: 'elevated' },
  { label: 'Gold accent', value: 'gold' },
] as const;

export type BackgroundVariant = (typeof BG_VARIANTS)[number]['value'];

export const bgClass: Record<BackgroundVariant, string> = {
  black: 'bg-tp-black text-tp-white',
  surface: 'bg-tp-surface text-tp-white',
  elevated: 'bg-tp-elevated text-tp-white',
  gold: 'bg-tp-gold text-tp-black',
};

export const SPACING_PRESETS = [
  { label: 'None', value: 'none' },
  { label: 'Small', value: 'sm' },
  { label: 'Medium', value: 'md' },
  { label: 'Large', value: 'lg' },
  { label: 'XL', value: 'xl' },
] as const;

export type SpacingPreset = (typeof SPACING_PRESETS)[number]['value'];

export const ptClass: Record<SpacingPreset, string> = {
  none: 'pt-0',
  sm: 'pt-8',
  md: 'pt-16',
  lg: 'pt-24',
  xl: 'pt-32',
};

export const pbClass: Record<SpacingPreset, string> = {
  none: 'pb-0',
  sm: 'pb-8',
  md: 'pb-16',
  lg: 'pb-24',
  xl: 'pb-32',
};

export const heightClass: Record<SpacingPreset, string> = {
  none: 'h-0',
  sm: 'h-8',
  md: 'h-16',
  lg: 'h-24',
  xl: 'h-32',
};
