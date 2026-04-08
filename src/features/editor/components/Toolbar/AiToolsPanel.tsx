'use client';

import { useState } from 'react';
import { fabric } from 'fabric';
import { Sparkles, Palette } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { useAppStore } from '@/shared/store/useAppStore';
import { AiClient } from '@/shared/lib/ai-client';
import { type Tone } from '@/shared/lib/ai/photune-ai';
import { matchFontFromCrop } from '../../lib/font-matcher';

export function AiToolsPanel() {
  const { fabricCanvas, activeObject, addJob, updateJob, removeJob, saveState } = useAppStore();
  const [tone, setTone] = useState<Tone>('professional');
  const [pendingRewrite, setPendingRewrite] = useState('');

  const handleRewrite = async () => {
    if (!activeObject || !('text' in activeObject)) return;

    const textbox = activeObject as fabric.Textbox;
    const id = Date.now();
    addJob({ id, text: 'AI Rewriting...', status: 'processing' });

    try {
      const result = await AiClient.rewrite(textbox.text || '', tone);
      setPendingRewrite(result);
      updateJob(id, 'completed', 'Suggestion ready to review.');
    } catch {
      updateJob(id, 'failed', 'Rewrite failed.');
    } finally {
      setTimeout(() => removeJob(id), 2000);
    }
  };

  const applyRewrite = () => {
    if (!activeObject || !('text' in activeObject) || !pendingRewrite) return;

    const textbox = activeObject as fabric.Textbox;
    textbox.set('text', pendingRewrite);
    fabricCanvas?.renderAll();
    saveState();
    setPendingRewrite('');
  };

  const discardRewrite = () => {
    setPendingRewrite('');
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

  const handleToneChange = (value: string) => setTone(value as Tone);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-xs font-bold uppercase text-zinc-400">Content AI</Label>
        <Select onValueChange={handleToneChange} defaultValue={tone}>
          <SelectTrigger>
            <SelectValue placeholder="Select Tone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="professional">Professional</SelectItem>
            <SelectItem value="casual">Casual</SelectItem>
            <SelectItem value="marketing">Marketing Viral</SelectItem>
            <SelectItem value="concise">Short &amp; Concise</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={handleRewrite}
          disabled={!activeObject || activeObject.type !== 'textbox'}
        >
          <Sparkles size={16} className="text-amber-500" /> Generate Rewrite Suggestion
        </Button>

        {pendingRewrite ? (
          <div className="space-y-2 rounded-lg border border-zinc-200 bg-zinc-50 p-3">
            <p className="text-xs font-bold uppercase text-zinc-500">Pending Suggestion</p>
            <p className="text-sm text-zinc-700 break-words">{pendingRewrite}</p>
            <div className="flex gap-2">
              <Button size="sm" className="flex-1" onClick={applyRewrite}>
                Apply
              </Button>
              <Button size="sm" variant="outline" className="flex-1" onClick={discardRewrite}>
                Discard
              </Button>
            </div>
          </div>
        ) : null}
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
