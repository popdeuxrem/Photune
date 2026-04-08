import { fabric } from 'fabric';
import { jsPDF } from 'jspdf';

import { normalizeCanvasPayload } from './canvas-serialization';

export type ExportFormat = 'png' | 'jpeg' | 'webp' | 'svg' | 'pdf';

export interface ExportOptions {
  format: ExportFormat;
  quality?: number;
  multiplier?: number;
  watermark?: boolean;
  watermarkText?: string;
  fileName?: string;
}

export interface ExportResult {
  filename: string;
  format: ExportFormat;
  mimeType: string;
  multiplier: number;
  watermarkApplied: boolean;
}

const DEFAULT_FILENAME_BASE = 'photune-export';
const ALLOWED_MULTIPLIERS = [1, 2, 4] as const;

function assertBrowser(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    throw new Error('Export is only available in the browser.');
  }
}

function normalizeMultiplier(format: ExportFormat, input: number | undefined): number {
  const parsed = typeof input === 'number' && Number.isFinite(input) ? input : 1;

  if (format === 'svg') {
    return 1;
  }

  if (parsed <= 1) return 1;
  if (parsed <= 2) return 2;
  return 4;
}

function normalizeQuality(format: ExportFormat, input: number | undefined): number | undefined {
  if (format !== 'jpeg' && format !== 'webp') {
    return undefined;
  }

  const parsed = typeof input === 'number' && Number.isFinite(input) ? input : 0.92;
  return Math.min(1, Math.max(0.1, parsed));
}

function sanitizeFilenameBase(input: string | undefined): string {
  const base = (input || DEFAULT_FILENAME_BASE)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return base || DEFAULT_FILENAME_BASE;
}

function mimeTypeForFormat(format: ExportFormat): string {
  switch (format) {
    case 'png':
      return 'image/png';
    case 'jpeg':
      return 'image/jpeg';
    case 'webp':
      return 'image/webp';
    case 'svg':
      return 'image/svg+xml';
    case 'pdf':
      return 'application/pdf';
  }
}

function extensionForFormat(format: ExportFormat): string {
  return format === 'jpeg' ? 'jpg' : format;
}

function buildFilename(base: string, format: ExportFormat): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  return `${sanitizeFilenameBase(base)}-${timestamp}.${extensionForFormat(format)}`;
}

function hasRenderableContent(canvas: fabric.Canvas): boolean {
  return canvas.getObjects().length > 0 || Boolean(canvas.backgroundImage);
}

function addWatermark(canvas: fabric.StaticCanvas, text = 'Photune'): fabric.Text {
  const width = canvas.getWidth() || 1;
  const height = canvas.getHeight() || 1;

  const watermark = new fabric.Text(text, {
    fontSize: Math.max(width, height) / 18,
    fill: 'rgba(128, 128, 128, 0.28)',
    fontFamily: 'Inter, sans-serif',
    selectable: false,
    evented: false,
    left: width / 2,
    top: height / 2,
    originX: 'center',
    originY: 'center',
    angle: -30,
    opacity: 0.28,
  });

  canvas.add(watermark);
  return watermark;
}

function triggerDownloadFromDataUrl(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function triggerDownloadFromBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

async function cloneCanvasForExport(sourceCanvas: fabric.Canvas): Promise<fabric.StaticCanvas> {
  assertBrowser();

  const width = sourceCanvas.getWidth();
  const height = sourceCanvas.getHeight();

  if (!width || !height) {
    throw new Error('Canvas dimensions are invalid for export.');
  }

  const exportElement = document.createElement('canvas');
  exportElement.width = width;
  exportElement.height = height;

  const exportCanvas = new fabric.StaticCanvas(exportElement, {
    width,
    height,
    renderOnAddRemove: false,
    enableRetinaScaling: false,
  });

  const normalizedPayload = normalizeCanvasPayload(sourceCanvas.toJSON());

  await new Promise<void>((resolve, reject) => {
    exportCanvas.loadFromJSON(normalizedPayload, () => {
      try {
        exportCanvas.renderAll();
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });

  if (sourceCanvas.backgroundColor) {
    exportCanvas.setBackgroundColor(
      sourceCanvas.backgroundColor,
      exportCanvas.renderAll.bind(exportCanvas)
    );
  }

  exportCanvas.renderAll();

  return exportCanvas;
}

function exportRaster(
  canvas: fabric.StaticCanvas,
  format: 'png' | 'jpeg' | 'webp',
  filename: string,
  multiplier: number,
  quality?: number
): void {
  const dataUrl = canvas.toDataURL({
    format,
    multiplier,
    quality,
    enableRetinaScaling: false,
  });

  triggerDownloadFromDataUrl(dataUrl, filename);
}

function exportSvg(canvas: fabric.StaticCanvas, filename: string): void {
  const svg = canvas.toSVG();
  triggerDownloadFromBlob(new Blob([svg], { type: 'image/svg+xml' }), filename);
}

function exportPdf(canvas: fabric.StaticCanvas, filename: string, multiplier: number): void {
  const width = canvas.getWidth() || 1;
  const height = canvas.getHeight() || 1;
  const dataUrl = canvas.toDataURL({
    format: 'png',
    multiplier,
    enableRetinaScaling: false,
  });

  const pdf = new jsPDF({
    orientation: width >= height ? 'landscape' : 'portrait',
    unit: 'px',
    format: [width, height],
    compress: true,
  });

  pdf.addImage(dataUrl, 'PNG', 0, 0, width, height);
  pdf.save(filename);
}

export async function exportCanvas(
  sourceCanvas: fabric.Canvas,
  options: ExportOptions
): Promise<ExportResult> {
  assertBrowser();

  if (!hasRenderableContent(sourceCanvas)) {
    throw new Error('Nothing to export. Add an image or canvas content first.');
  }

  const format = options.format;
  const multiplier = normalizeMultiplier(format, options.multiplier);
  const quality = normalizeQuality(format, options.quality);
  const filename = buildFilename(options.fileName ?? DEFAULT_FILENAME_BASE, format);
  const mimeType = mimeTypeForFormat(format);

  const exportCanvas = await cloneCanvasForExport(sourceCanvas);

  try {
    if (options.watermark) {
      addWatermark(exportCanvas, options.watermarkText || 'Photune');
      exportCanvas.renderAll();
    }

    switch (format) {
      case 'png':
      case 'jpeg':
      case 'webp':
        exportRaster(exportCanvas, format, filename, multiplier, quality);
        break;
      case 'svg':
        exportSvg(exportCanvas, filename);
        break;
      case 'pdf':
        exportPdf(exportCanvas, filename, multiplier);
        break;
      default: {
        const exhaustive: never = format;
        throw new Error(`Unsupported export format: ${exhaustive}`);
      }
    }

    return {
      filename,
      format,
      mimeType,
      multiplier,
      watermarkApplied: Boolean(options.watermark),
    };
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error('Export failed due to an unknown error.');
  } finally {
    exportCanvas.dispose();
  }
}

export const EXPORT_MULTIPLIERS = ALLOWED_MULTIPLIERS;
