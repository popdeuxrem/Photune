import { fabric } from 'fabric';
import { jsPDF } from 'jspdf';

export const exportToPdf = (canvas: fabric.Canvas) => {
  const dataUrl = canvas.toDataURL({ format: 'png', multiplier: 2 });
  const pdf = new jsPDF({
    orientation: canvas.width! > canvas.height! ? 'landscape' : 'portrait',
    unit: 'px',
    format: [canvas.width!, canvas.height!]
  });
  pdf.addImage(dataUrl, 'PNG', 0, 0, canvas.width!, canvas.height!);
  pdf.save(`photext-export-${Date.now()}.pdf`);
};

export const exportToSvg = (canvas: fabric.Canvas) => {
  const svg = canvas.toSVG();
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `photext-export-${Date.now()}.svg`;
  link.click();
  URL.revokeObjectURL(url);
};
