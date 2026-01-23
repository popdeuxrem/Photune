'use client';

import { useRef, useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';
import { useAppStore } from '@/shared/store/useAppStore';
import { fabric } from 'fabric';
import { Upload, Type, Sparkles, Eraser, Palette, ImagePlus } from 'lucide-react';
import { runOCR } from '../lib/ocr-worker';
import { generateMask } from '../lib/inpainting';
import { matchFontFromCrop } from '../lib/font-matcher';
import { AiToolsModal } from './AiToolsModal';
import { TextProperties } from './TextProperties';

export function Toolbar() {
  const { fabricCanvas, activeObject, addJob, updateJob, removeJob, saveState } = useAppStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [aiOpen, setAiOpen] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !fabricCanvas) return;
    const id = Date.now();
    addJob({ id, text: 'Processing Image...', status: 'processing' });
    
    const url = URL.createObjectURL(file);
    fabric.Image.fromURL(url, async (img) => {
      fabricCanvas.clear();
      fabricCanvas.setDimensions({ width: img.width || 800, height: img.height || 600 });
      fabricCanvas.setBackgroundImage(img, fabricCanvas.renderAll.bind(fabricCanvas));
      
      updateJob(id, 'processing', 'Extracting Text (OCR)...');
      const results = await runOCR(file);
      results.forEach(res => {
        const t = new fabric.Textbox(res.text, { ...res, fontFamily: 'sans-serif', fill: '#000' });
        (t as any).isImporting = true;
        fabricCanvas.add(t);
        (t as any).isImporting = false;
      });
      fabricCanvas.renderAll();
      saveState();
      updateJob(id, 'completed', 'Done!');
      setTimeout(() => removeJob(id), 2000);
    });
  };

  const handleClean = async () => {
    if (!fabricCanvas) return;
    const id = Date.now();
    addJob({ id, text: 'Inpainting...', status: 'processing' });
    try {
      const mask = await generateMask(fabricCanvas);
      const bg = (fabricCanvas.backgroundImage as fabric.Image).toDataURL({ format: 'png' });
      const res = await fetch('/api/ai/inpaint', { method: 'POST', body: JSON.stringify({ image: bg, mask }) });
      const blob = await res.blob();
      fabric.Image.fromURL(URL.createObjectURL(blob), (img) => {
        fabricCanvas.setBackgroundImage(img, fabricCanvas.renderAll.bind(fabricCanvas));
        saveState();
        updateJob(id, 'completed', 'Cleaned!');
      });
    } catch { updateJob(id, 'failed', 'Inpaint failed'); }
  };

  const handleFontMatch = async () => {
    if (!activeObject || !fabricCanvas) return;
    const id = Date.now();
    addJob({ id, text: 'Matching Font...', status: 'processing' });
    const crop = activeObject.toDataURL({ format: 'png' });
    const font = await matchFontFromCrop(crop);
    (activeObject as fabric.Textbox).set('fontFamily', font);
    fabricCanvas.renderAll();
    updateJob(id, 'completed', `Matched: ${font}`);
  };

  return (
    <aside className="w-72 border-r bg-zinc-50 p-4 flex flex-col gap-6 overflow-y-auto">
      <input type="file" ref={fileRef} hidden onChange={handleUpload} />
      <div className="space-y-2">
        <Label className="text-[10px] uppercase font-bold text-zinc-400">Import</Label>
        <Button className="w-full justify-start" variant="outline" onClick={() => fileRef.current?.click()}><Upload size={16} className="mr-2" /> Upload & OCR</Button>
      </div>
      <div className="space-y-2">
        <Label className="text-[10px] uppercase font-bold text-zinc-400">Magic Tools</Label>
        <Button className="w-full justify-start" variant="secondary" onClick={handleClean}><Eraser size={16} className="mr-2 text-indigo-500" /> Magic Erase</Button>
        <Button className="w-full justify-start" variant="secondary" onClick={handleFontMatch} disabled={!activeObject}><Palette size={16} className="mr-2 text-blue-500" /> Match Font</Button>
        <Button className="w-full justify-start" variant="secondary" onClick={() => setAiOpen(true)} disabled={!activeObject}><Sparkles size={16} className="mr-2 text-amber-500" /> AI Rewrite</Button>
      </div>
      <TextProperties />
      <AiToolsModal isOpen={aiOpen} setIsOpen={setAiOpen} />
    </aside>
  );
}
