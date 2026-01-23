import { fabric } from 'fabric';

export async function generateMask(canvas: fabric.Canvas): Promise<string> {
  const maskCanvas = document.createElement('canvas');
  maskCanvas.width = canvas.width || 800;
  maskCanvas.height = canvas.height || 600;
  const ctx = maskCanvas.getContext('2d')!;

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);

  ctx.fillStyle = 'white';
  canvas.getObjects('textbox').forEach((obj) => {
    const pad = 5;
    ctx.fillRect(
      (obj.left || 0) - pad,
      (obj.top || 0) - pad,
      (obj.getScaledWidth() || 0) + pad * 2,
      (obj.getScaledHeight() || 0) + pad * 2
    );
  });

  return maskCanvas.toDataURL('image/png');
}
