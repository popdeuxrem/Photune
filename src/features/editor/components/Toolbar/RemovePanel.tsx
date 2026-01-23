'use client';

import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';
import { useAppStore } from '@/shared/store/useAppStore';
import { generateMask } from '../../lib/inpainting';
import { Eraser, ShieldAlert } from 'lucide-react';
import { fabric } from 'fabric';

export function RemovePanel() {
  const { fabricCanvas, addJob, updateJob, removeJob, saveState } = useAppStore();

  const handleMagicErase = async () => {
    if (!fabricCanvas) return;
    const bg = fabricCanvas.backgroundImage as fabric.Image;
    if (!bg) return;

    const id = Date.now();
    addJob({ id, text: 'Magic Eraser: Removing original text...', status: 'processing' });
    
    try {
      const mask = await generateMask(fabricCanvas);
      const originalImage = bg.toDataURL({ format: 'png' });
      
      const res = await fetch('/api/ai/inpaint', { 
        method: 'POST', 
        body: JSON.stringify({ image: originalImage, mask }) 
      });

      const blob = await res.blob();
      const cleanedUrl = URL.createObjectURL(blob);

      fabric.Image.fromURL(cleanedUrl, (img) => {
        fabricCanvas.setBackgroundImage(img, fabricCanvas.renderAll.bind(fabricCanvas), {
          crossOrigin: 'anonymous'
        });
        saveState();
        updateJob(id, 'completed', 'Original text erased!');
      }, { crossOrigin: 'anonymous' });
    } catch { 
      updateJob(id, 'failed', 'Magic Erase failed.'); 
    } finally {
      setTimeout(() => removeJob(id), 3000);
    }
  };

  return (
    <div className="space-y-4">
      <Label className="text-xs font-bold uppercase text-zinc-400">Object Removal</Label>
      <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-100 text-[11px] text-zinc-500 mb-2">
        Place text boxes exactly over the area you want to erase from the original image.
      </div>
      <Button className="w-full justify-start gap-2" variant="destructive" onClick={handleMagicErase}>
        <Eraser size={16} /> Erase Selected Areas
      </Button>
      
      <div className="pt-4 border-t space-y-2">
        <Label className="text-xs font-bold uppercase text-zinc-400">Watermark Removal</Label>
        <Button className="w-full justify-start gap-2" variant="outline" onClick={handleMagicErase}>
          <ShieldAlert size={16} className="text-red-500" /> AI Clear Watermarks
        </Button>
      </div>
    </div>
  );
}
