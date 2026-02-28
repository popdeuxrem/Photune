import { fabric } from 'fabric';
import { jsPDF } from 'jspdf';

export type ExportFormat = 'png' | 'jpeg' | 'webp' | 'svg' | 'pdf';

export interface ExportOptions {
  format: ExportFormat;
  quality?: number;  // 0-1 for jpeg/webp
  multiplier?: number;  // for resolution scaling
  watermark?: boolean;
  watermarkText?: string;
}

/**
 * Add watermark to canvas for free tier
 */
function addWatermark(canvas: fabric.Canvas, text: string = 'Photune'): fabric.Text {
  const watermark = new fabric.Text(text, {
    fontSize: Math.max(canvas.width!, canvas.height!) / 20,
    fill: 'rgba(128, 128, 128, 0.3)',
    fontFamily: 'Inter, sans-serif',
    selectable: false,
    evented: false,
    left: canvas.width! / 2,
    top: canvas.height! / 2,
    originX: 'center',
    originY: 'center',
    angle: -30,
    opacity: 0.3,
  });
  
  canvas.add(watermark);
  return watermark;
}

/**
 * Export canvas to various formats
 */
export const exportCanvas = async (
  canvas: fabric.Canvas, 
  options: ExportOptions
): Promise<void> => {
  const { format, quality = 0.9, multiplier = 1, watermark = false, watermarkText } = options;

  // For free tier watermarks, we add it to the canvas temporarily
  let watermarkObj: fabric.Text | null = null;
  
  if (watermark && watermarkText) {
    watermarkObj = addWatermark(canvas, watermarkText);
    canvas.renderAll();
  }

  const filename = `photune-export-${Date.now()}`;

  switch (format) {
    case 'png':
      downloadDataUrl(
        canvas.toDataURL({ format: 'png', multiplier, quality }),
        `${filename}.png`
      );
      break;

    case 'jpeg':
      downloadDataUrl(
        canvas.toDataURL({ format: 'jpeg', multiplier, quality }),
        `${filename}.jpg`
      );
      break;

    case 'webp':
      downloadDataUrl(
        canvas.toDataURL({ format: 'webp', multiplier, quality }),
        `${filename}.webp`
      );
      break;

    case 'svg':
      const svg = canvas.toSVG();
      const svgBlob = new Blob([svg], { type: 'image/svg+xml' });
      downloadBlob(svgBlob, `${filename}.svg`);
      break;

    case 'pdf':
      exportToPdf(canvas, multiplier);
      break;
  }

  // Remove watermark after export
  if (watermarkObj) {
    canvas.remove(watermarkObj);
    canvas.renderAll();
  }
};

const downloadDataUrl = (dataUrl: string, filename: string) => {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  link.click();
};

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export const exportToPdf = (canvas: fabric.Canvas, multiplier: number = 2) => {
  const dataUrl = canvas.toDataURL({ format: 'png', multiplier });
  const pdf = new jsPDF({
    orientation: (canvas.width || 800) > (canvas.height || 600) ? 'landscape' : 'portrait',
    unit: 'px',
    format: [canvas.width || 800, canvas.height || 600]
  });
  pdf.addImage(dataUrl, 'PNG', 0, 0, canvas.width || 800, canvas.height || 600);
  pdf.save(`photune-export-${Date.now()}.pdf`);
};

export const exportToSvg = (canvas: fabric.Canvas) => {
  const svg = canvas.toSVG();
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  downloadBlob(blob, `photune-export-${Date.now()}.svg`);
};
