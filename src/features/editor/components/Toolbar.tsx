'use client';

import { useRef, useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { useAppStore } from '@/shared/store/useAppStore';
import { fabric } from 'fabric';
import { Upload, Type, Languages, Sparkles } from 'lucide-react';
import { runOCR } from '../lib/ocr-worker';
import { AiToolsModal } from './AiToolsModal';
import { TextProperties } from './TextProperties';

export function Toolbar() {
  const { fabricCanvas, addJob, updateJob, removeJob, saveState } = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [aiModalOpen, setAiModalOpen] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !fabricCanvas) return;

    const jobId = Date.now();
    addJob({ id: jobId, text: 'Processing Image...', status: 'processing' });

    try {
      const url = URL.createObjectURL(file);
      fabric.Image.fromURL(url, async (img) => {
        // 1. Setup Canvas size
        fabricCanvas.clear();
        fabricCanvas.setDimensions({ width: img.width || 800, height: img.height || 600 });
        fabricCanvas.setBackgroundImage(img, fabricCanvas.renderAll.bind(fabricCanvas));

        // 2. Run OCR
        updateJob(jobId, 'processing', 'Extracting Text (OCR)...');
        const ocrResults = await runOCR(file);

        // 3. Add Textboxes
        ocrResults.forEach(res => {
          const txt = new fabric.Textbox(res.text, {
            left: res.left,
            top: res.top,
            width: res.width,
            fontSize: res.fontSize,
            fontFamily: 'sans-serif',
            fill: '#000000',
            backgroundColor: 'rgba(255,255,255,0.7)', // Visual aid for OCR match
          });
          txt.set('isImporting', true);
          fabricCanvas.add(txt);
          txt.set('isImporting', false);
        });

        fabricCanvas.renderAll();
        saveState();
        updateJob(jobId, 'completed', 'Finished!');
        setTimeout(() => removeJob(jobId), 2000);
      });
    } catch (err) {
      updateJob(jobId, 'failed', 'Error occurred.');
    }
  };

  return (
    <aside className="w-72 border-r border-zinc-800 bg-zinc-950 p-4 flex flex-col gap-6">
      <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={handleFileUpload} />
      
      <div className="space-y-2">
        <Label className="text-zinc-400 text-xs uppercase tracking-wider font-bold">Import</Label>
        <Button className="w-full justify-start gap-2" variant="outline" onClick={() => fileInputRef.current?.click()}>
          <Upload size={16} /> Upload & OCR
        </Button>
      </div>

      <div className="space-y-2">
        <Label className="text-zinc-400 text-xs uppercase tracking-wider font-bold">Tools</Label>
        <Button className="w-full justify-start gap-2" variant="outline" onClick={() => {
          const txt = new fabric.Textbox('New Text', { left: 100, top: 100, width: 200, fontSize: 24 });
          fabricCanvas?.add(txt).setActiveObject(txt);
        }}>
          <Type size={16} /> Add Text
        </Button>
        <Button className="w-full justify-start gap-2" variant="outline" onClick={() => setAiModalOpen(true)}>
          <Sparkles size={16} /> AI Assistant
        </Button>
      </div>

      <TextProperties />

      <AiToolsModal isOpen={aiModalOpen} setIsOpen={setAiModalOpen} />
    </aside>
  );
}
