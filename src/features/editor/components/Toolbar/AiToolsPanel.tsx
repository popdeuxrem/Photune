'use client';

import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { useAppStore } from '@/shared/store/useAppStore';
import { AiClient } from '@/shared/lib/ai-client';
import { matchFontFromCrop } from '../../lib/font-matcher';
import { Sparkles, Palette, Languages } from 'lucide-react';
import { fabric } from 'fabric';

export function AiToolsPanel() {
  const { fabricCanvas, activeObject, addJob, updateJob, removeJob, saveState } = useAppStore();
  const [tone, setTone] = useState('professional');

  const handleRewrite = async () => {
    if (!activeObject || !('text' in activeObject)) return;
    const textbox = activeObject as fabric.Textbox;
    const id = Date.now();
    addJob({ id, text: 'AI Rewriting...', status: 'processing' });

    try {
      const result = await AiClient.rewrite(textbox.text || '', tone);
      textbox.set('text', result);
      fabricCanvas?.renderAll();
      saveState();
      updateJob(id, 'completed', 'Text optimized!');
    } catch {
      updateJob(id, 'failed', 'Rewrite failed.');
    } finally {
      setTimeout(() => removeJob(id), 2000);
    }
  };

  const handleMatchFont = async () => {
    if (!activeObject || activeObject.type !== 'textbox') return;
    const id = Date.now();
    addJob({ id, text: 'Analyzing Typography...', status: 'processing' });
    
    try {
      const dataUrl = activeObject.toDataURL({ format: 'png' });
      const font = await matchFontFromCrop(dataUrl);
      (activeObject as fabric.Textbox).set('fontFamily', font);
      fabricCanvas?.renderAll();
      saveState();
      updateJob(id, 'completed', `Matched to ${font}`);
    } catch {
      updateJob(id, 'failed', 'Font analysis failed.');
    } finally {
      setTimeout(() => removeJob(id), 2000);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-xs font-bold uppercase text-zinc-400">Content AI</Label>
        <Select onValueChange={setTone} defaultValue={tone}>
          <SelectTrigger><SelectValue placeholder="Select Tone" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="professional">Professional</SelectItem>
            <SelectItem value="casual">Casual</SelectItem>
            <SelectItem value="marketing">Marketing Viral</SelectItem>
            <SelectItem value="concise">Short & Concise</SelectItem>
          </SelectContent>
        </Select>
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2" 
          onClick={handleRewrite} 
          disabled={!activeObject || activeObject.type !== 'textbox'}
        >
          <Sparkles size={16} className="text-amber-500" /> Magic Rewrite
        </Button>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-bold uppercase text-zinc-400">Design AI</Label>
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2" 
          onClick={handleMatchFont}
          disabled={!activeObject || activeObject.type !== 'textbox'}
        >
          <Palette size={16} className="text-blue-500" /> Match Image Font
        </Button>
      </div>
    </div>
  );
}
