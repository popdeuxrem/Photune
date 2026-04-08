import { fabric } from 'fabric';

const DEFAULT_TEXT_FILL = '#111111';
const HIGH_CONTRAST_DARK = '#111111';
const HIGH_CONTRAST_LIGHT = '#f8fafc';

type SampleImageColorInput = {
  canvas: fabric.Canvas;
  x: number;
  y: number;
  radius?: number;
};

type RGB = {
  r: number;
  g: number;
  b: number;
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (value: number) => Math.round(value).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

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

function getContrastRatio(a: RGB, b: RGB): number {
  const la = getRelativeLuminance(a);
  const lb = getRelativeLuminance(b);

  const lighter = Math.max(la, lb);
  const darker = Math.min(la, lb);

  return (lighter + 0.05) / (darker + 0.05);
}

function getAverageRegionColor(
  element: CanvasImageSource,
  startX: number,
  startY: number,
  width: number,
  height: number
): RGB | null {
  const offscreen = document.createElement('canvas');
  offscreen.width = width;
  offscreen.height = height;

  const ctx = offscreen.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;

  try {
    ctx.drawImage(
      element,
      startX,
      startY,
      width,
      height,
      0,
      0,
      width,
      height
    );

    const { data } = ctx.getImageData(0, 0, width, height);

    let r = 0;
    let g = 0;
    let b = 0;
    let count = 0;

    for (let i = 0; i < data.length; i += 4) {
      const alpha = data[i + 3];
      if (alpha === 0) continue;

      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      count += 1;
    }

    if (count === 0) return null;

    return {
      r: r / count,
      g: g / count,
      b: b / count,
    };
  } catch {
    return null;
  }
}

function resolveReadableTextColor(sampled: RGB): string {
  const darkRgb = hexToRgb(HIGH_CONTRAST_DARK);
  const lightRgb = hexToRgb(HIGH_CONTRAST_LIGHT);

  if (!darkRgb || !lightRgb) {
    return DEFAULT_TEXT_FILL;
  }

  const sampledHex = rgbToHex(sampled.r, sampled.g, sampled.b);
  const sampledRgb = hexToRgb(sampledHex);

  if (!sampledRgb) {
    return DEFAULT_TEXT_FILL;
  }

  const darkContrast = getContrastRatio(sampledRgb, darkRgb);
  const lightContrast = getContrastRatio(sampledRgb, lightRgb);

  const contrastThreshold = 2.2;
  const alreadyReadable = Math.max(darkContrast, lightContrast) >= contrastThreshold;

  if (alreadyReadable) {
    return sampledHex;
  }

  return darkContrast >= lightContrast ? HIGH_CONTRAST_DARK : HIGH_CONTRAST_LIGHT;
}

export function sampleImageColorAtPoint({
  canvas,
  x,
  y,
  radius = 12,
}: SampleImageColorInput): string {
  const backgroundImage = canvas.backgroundImage as fabric.Image | undefined;

  if (!backgroundImage || typeof backgroundImage.getElement !== 'function') {
    return DEFAULT_TEXT_FILL;
  }

  const element = backgroundImage.getElement() as CanvasImageSource | undefined;
  if (!element) {
    return DEFAULT_TEXT_FILL;
  }

  const sourceWidth =
    (element as HTMLImageElement).naturalWidth ||
    (element as HTMLCanvasElement).width ||
    (element as ImageBitmap).width ||
    0;

  const sourceHeight =
    (element as HTMLImageElement).naturalHeight ||
    (element as HTMLCanvasElement).height ||
    (element as ImageBitmap).height ||
    0;

  if (!sourceWidth || !sourceHeight) {
    return DEFAULT_TEXT_FILL;
  }

  const bgLeft = backgroundImage.left ?? 0;
  const bgTop = backgroundImage.top ?? 0;
  const scaleX = backgroundImage.scaleX ?? 1;
  const scaleY = backgroundImage.scaleY ?? 1;

  if (!scaleX || !scaleY) {
    return DEFAULT_TEXT_FILL;
  }

  const sourceX = Math.round((x - bgLeft) / scaleX);
  const sourceY = Math.round((y - bgTop) / scaleY);

  const startX = clamp(sourceX - radius, 0, sourceWidth - 1);
  const startY = clamp(sourceY - radius, 0, sourceHeight - 1);
  const endX = clamp(sourceX + radius, 0, sourceWidth - 1);
  const endY = clamp(sourceY + radius, 0, sourceHeight - 1);

  const width = Math.max(1, endX - startX + 1);
  const height = Math.max(1, endY - startY + 1);

  const average = getAverageRegionColor(element, startX, startY, width, height);
  if (!average) {
    return DEFAULT_TEXT_FILL;
  }

  return resolveReadableTextColor(average);
}

export function getDefaultTextFill(): string {
  return DEFAULT_TEXT_FILL;
}