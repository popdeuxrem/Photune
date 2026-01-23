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
    
    try {
      const url = URL.createObjectURL(file);
      fabric.Image.fromURL(url, (img) => {
        fabricCanvas.clear();
        fabricCanvas.setDimensions({ 
          width: img.width || 800, 
          height: img.height || 600 
        });
        fabricCanvas.setBackgroundImage(img, fabricCanvas.renderAll.bind(fabricCanvas), {
          crossOrigin: 'anonymous'
        });
        
        updateJob(id, 'processing', 'Extracting Text (OCR)...');
        
        // Run OCR in background
        runOCR(file).then((results) => {
          results.forEach(res => {
            const t = new fabric.Textbox(res.text, { 
              ...res, 
              fontFamily: 'sans-serif', 
              fill: '#000000',
              backgroundColor: 'rgba(255,255,255,0.5)' 
            });
            (t as any).isImporting = true;
            fabricCanvas.add(t);
            (t as any).isImporting = false;
          });

          fabricCanvas.renderAll();
          saveState();
          updateJob(id, 'completed', 'Analysis Complete!');
          setTimeout(() => removeJob(id), 2000);
        });
      }, { crossOrigin: 'anonymous' });
    } catch (err) {
      updateJob(id, 'failed', 'Upload failed.');
    }
  };

  const handleClean = async () => {
    if (!fabricCanvas) return;
    const bg = fabricCanvas.backgroundImage as fabric.Image;
    if (!bg) return;

    const id = Date.now();
    addJob({ id, text: 'Cleaning original pixels...', status: 'processing' });
    
    try {
      const mask = await generateMask(fabricCanvas);
      const originalImage = bg.toDataURL({ format: 'png' });
      
      const res = await fetch('/api/ai/inpaint', { 
        method: 'POST', 
        body: JSON.stringify({ image: originalImage, mask }) 
      });

      if (!res.ok) throw new Error();

      const blob = await res.blob();
      const cleanedUrl = URL.createObjectURL(blob);

      fabric.Image.fromURL(cleanedUrl, (img) => {
        fabricCanvas.setBackgroundImage(img, fabricCanvas.renderAll.bind(fabricCanvas), {
          crossOrigin: 'anonymous'
        });
        saveState();
        updateJob(id, 'completed', 'Ghost text removed!');
      }, { crossOrigin: 'anonymous' });
    } catch { 
      updateJob(id, 'failed', 'Magic Erase failed.'); 
    } finally {
      setTimeout(() => removeJob(id), 3000);
    }
  };

  const handleFontMatch = async () => {
    if (!activeObject || !fabricCanvas || activeObject.type !== 'textbox') return;
    
    const id = Date.now();
    addJob({ id, text: 'Matching Typography...', status: 'processing' });
    
    try {
      const crop = activeObject.toDataURL({ format: 'png' });
      const font = await matchFontFromCrop(crop);
      (activeObject as fabric.Textbox).set('fontFamily', font);
      fabricCanvas.renderAll();
      saveState();
      updateJob(id, 'completed', `Matched: ${font}`);
    } catch {
      updateJob(id, 'failed', 'Could not match font.');
    } finally {
      setTimeout(() => removeJob(id), 2000);
    }
  };

  const handleGenerateBG = async () => {
    const prompt = window.prompt("Describe a new background (e.g., 'Modern minimal office desk'):");
    if (!prompt || !fabricCanvas) return;

    const id = Date.now();
    addJob({ id, text: 'AI Generation...', status: 'processing' });

    try {
      const res = await fetch('/api/ai/workers', {
        method: 'POST', 
        body: JSON.stringify({ task: 'image-gen', prompt: { text: prompt } }) 
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      
      fabric.Image.fromURL(url, (img) => {
        fabricCanvas.setBackgroundImage(img, fabricCanvas.renderAll.bind(fabricCanvas), {
          crossOrigin: 'anonymous'
        });
        saveState();
        updateJob(id, 'completed', 'Background Updated!');
      }, { crossOrigin: 'anonymous' });
    } catch (err) {
      updateJob(id, 'failed', 'Generation failed.');
    } finally {
      setTimeout(() => removeJob(id), 3000);
    }
  };

  const addNewText = () => {
    if (!fabricCanvas) return;
    const txt = new fabric.Textbox('New Text', { 
      left: 100, 
      top: 100, 
      width: 200, 
      fontSize: 24, 
      fontFamily: 'sans-serif' 
    });
    fabricCanvas.add(txt);
    fabricCanvas.setActiveObject(txt);
    fabricCanvas.requestRenderAll();
  };

  return (
    <aside className="w-72 border-r bg-white p-4 flex flex-col gap-6 overflow-y-auto">
      <input type="file" ref={fileRef} hidden onChange={handleUpload} accept="image/*" />
      
      <div className="space-y-2">
        <Label className="text-[10px] uppercase font-black text-zinc-400 tracking-tighter">1. Import & Analyze</Label>
        <Button className="w-full justify-start gap-2" variant="outline" onClick={() => fileRef.current?.click()}>
          <Upload size={16} /> Upload & Extract
        </Button>
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] uppercase font-black text-zinc-400 tracking-tighter">2. Magic Tools</Label>
        <Button className="w-full justify-start gap-2" variant="secondary" onClick={handleClean}>
          <Eraser size={16} className="text-indigo-600" /> Magic Erase Original
        </Button>
        <Button className="w-full justify-start gap-2" variant="secondary" onClick={handleFontMatch} disabled={!activeObject}>
          <Palette size={16} className="text-blue-600" /> Match Font Style
        </Button>
        <Button className="w-full justify-start gap-2" variant="secondary" onClick={handleGenerateBG}>
          <ImagePlus size={16} className="text-emerald-600" /> AI Background
        </Button>
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] uppercase font-black text-zinc-400 tracking-tighter">3. Content</Label>
        <Button className="w-full justify-start gap-2" variant="outline" onClick={addNewText}>
          <Type size={16} /> New Text Box
        </Button>
        <Button className="w-full justify-start gap-2" variant="outline" onClick={() => setAiOpen(true)} disabled={!activeObject}>
          <Sparkles size={16} className="text-amber-500" /> AI Rewrite Selection
        </Button>
      </div>

      <TextProperties />
      
      <AiToolsModal isOpen={aiOpen} setIsOpen={setAiOpen} />
    </aside>
  );
}
