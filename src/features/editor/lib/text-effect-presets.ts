export type SelectedTextEffects = {
  fill: string;
  stroke: string;
  strokeWidth: number;
  opacity: number;
  shadowColor: string;
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
};

export type TextEffectPresetKey =
  | 'none'
  | 'subtle-shadow'
  | 'thin-outline'
  | 'lifted-text';

export type TextEffectPreset = {
  key: TextEffectPresetKey;
  label: string;
  values: Partial<SelectedTextEffects>;
};

export const TEXT_EFFECT_PRESETS: TextEffectPreset[] = [
  {
    key: 'none',
    label: 'None',
    values: {
      strokeWidth: 0,
      opacity: 1,
      shadowBlur: 0,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
    },
  },
  {
    key: 'subtle-shadow',
    label: 'Subtle Shadow',
    values: {
      strokeWidth: 0,
      opacity: 1,
      shadowColor: '#000000',
      shadowBlur: 8,
      shadowOffsetX: 0,
      shadowOffsetY: 2,
    },
  },
  {
    key: 'thin-outline',
    label: 'Thin Outline',
    values: {
      stroke: '#111111',
      strokeWidth: 1,
      opacity: 1,
      shadowBlur: 0,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
    },
  },
  {
    key: 'lifted-text',
    label: 'Lifted Text',
    values: {
      strokeWidth: 0,
      opacity: 1,
      shadowColor: '#000000',
      shadowBlur: 14,
      shadowOffsetX: 0,
      shadowOffsetY: 4,
    },
  },
];