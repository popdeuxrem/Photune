import { fabric } from 'fabric';

/**
 * Generates a clean 1-bit Black and White mask.
 * Black = Keep background
 * White = Area to be filled by AI
 */
export async function generateMask(canvas: fabric.Canvas): Promise<string> {
  const maskCanvas = document.createElement('canvas');
  maskCanvas.width = canvas.width || 800;
  maskCanvas.height = canvas.height || 600;
  const ctx = maskCanvas.getContext('2d')!;

  // Fill entire area with black (don't change)
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);

  // Draw white areas for selected objects or textboxes
  ctx.fillStyle = 'white';
  
  // Logic: Use every textbox currently on canvas as a deletion target
  // Plus any object with a custom 'isEraser' property
  canvas.getObjects().forEach((obj) => {
    if (obj.type === 'textbox' || (obj as any).isEraser) {
      const pad = 10; // Extra padding to ensure anti-aliasing doesn't leave ghosts
      ctx.save();
      ctx.translate(obj.left || 0, obj.top || 0);
      ctx.rotate((obj.angle || 0) * (Math.PI / 180));
      
      const width = (obj.getScaledWidth() || 0) + pad * 2;
      const height = (obj.getScaledHeight() || 0) + pad * 2;
      
      ctx.fillRect(-pad, -pad, width, height);
      ctx.restore();
    }
  });

  return maskCanvas.toDataURL('image/png');
}
