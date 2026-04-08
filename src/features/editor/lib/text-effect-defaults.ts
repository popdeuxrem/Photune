import { fabric } from 'fabric';

type RGB = {
  r: number;
  g: number;
  b: number;
};

export type TextEffectDefaults = {
  stroke: string;
  strokeWidth: number;
  shadow: fabric.Shadow | null;
};

const DEFAULT_STROKE = '#000000';
const LIGHT_SHADOW = 'rgba(15, 23, 42, 0.24)';
const DARK_SHADOW = 'rgba(248, 250, 252, 0.18)';

function hexToRgb(hex: string): RGB | null {
  const normalized = hex.replace('#', '').trim();

  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) {
    return null;
  }

  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
}

function getRelativeLuminance({ r, g, b }: RGB): number {
  const transform = (channel: number) => {
    const normalized = channel / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  };

  const sr = transform(r);
  const sg = transform(g);
  const sb = transform(b);

  return 0.2126 * sr + 0.7152 * sg + 0.0722 * sb;
}

export function getTextEffectDefaults(fill: string): TextEffectDefaults {
  const rgb = hexToRgb(fill);

  if (!rgb) {
    return {
      stroke: DEFAULT_STROKE,
      strokeWidth: 0,
      shadow: null,
    };
  }

  const luminance = getRelativeLuminance(rgb);
  const isLightText = luminance > 0.72;
  const isVeryLightText = luminance > 0.9;
  const isVeryDarkText = luminance < 0.12;

  if (isVeryLightText) {
    return {
      stroke: '#111111',
      strokeWidth: 1,
      shadow: new fabric.Shadow({
        color: LIGHT_SHADOW,
        blur: 10,
        offsetX: 0,
        offsetY: 2,
      }),
    };
  }

  if (isVeryDarkText) {
    return {
      stroke: '#ffffff',
      strokeWidth: 0,
      shadow: new fabric.Shadow({
        color: DARK_SHADOW,
        blur: 8,
        offsetX: 0,
        offsetY: 1,
      }),
    };
  }

  if (isLightText) {
    return {
      stroke: '#111111',
      strokeWidth: 0,
      shadow: new fabric.Shadow({
        color: LIGHT_SHADOW,
        blur: 8,
        offsetX: 0,
        offsetY: 2,
      }),
    };
  }

  return {
    stroke: '#000000',
    strokeWidth: 0,
    shadow: null,
  };
}