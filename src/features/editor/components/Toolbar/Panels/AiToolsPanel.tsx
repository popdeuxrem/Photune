'use client';

import { useState } from 'react';
import { Sparkles, Languages } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';
import { useAppStore } from '@/shared/store/useAppStore';
import { AiClient } from '@/shared/lib/ai-client';

export function AiToolsPanel() {
  const { fabricCanvas, activeObject, saveState, addJob, updateJob, removeJob } = useAppStore();
  const [pendingRewrite, setPendingRewrite] = useState('');

  const handleRewrite = async () => {
    if (!activeObject || activeObject.type !== 'textbox') return;

    const id = Date.now();
    addJob({ id, text: 'AI is thinking...', status: 'processing' });

    try {
      const text = (activeObject as { text?: string }).text || '';
      const suggestion = await AiClient.rewrite(text, 'professional');
      setPendingRewrite(suggestion);
      updateJob(id, 'completed', 'Rewrite suggestion ready.');
    } catch {
      updateJob(id, 'failed', 'AI rewrite failed.');
    } finally {
      setTimeout(() => removeJob(id), 2000);
    }
  };

  const applyRewrite = () => {
    if (!activeObject || activeObject.type !== 'textbox' || !pendingRewrite) return;

    (activeObject as { set: (key: string, value: string) => void }).set('text', pendingRewrite);
    fabricCanvas?.renderAll();
    saveState();
    setPendingRewrite('');
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-[10px] font-black uppercase text-zinc-400">Content AI</Label>
        <Button
          variant="outline"
          className="w-full justify-start gap-2 h-11 rounded-xl"
          onClick={handleRewrite}
        >
          <Sparkles size={16} className="text-amber-500" /> Professional Rewrite Suggestion
        </Button>

        {pendingRewrite ? (
          <div className="space-y-2 rounded-xl border border-zinc-200 bg-zinc-50 p-3">
            <p className="text-xs font-bold uppercase text-zinc-500">Pending Suggestion</p>
            <p className="text-sm text-zinc-700 break-words">{pendingRewrite}</p>
            <div className="flex gap-2">
              <Button size="sm" className="flex-1" onClick={applyRewrite}>
                Apply
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => setPendingRewrite('')}
              >
                Discard
              </Button>
            </div>
          </div>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] font-black uppercase text-zinc-400">Vision AI</Label>
        <Button
          variant="outline"
          className="w-full justify-start gap-2 h-11 rounded-xl"
          onClick={() => {}}
        >
          <Languages size={16} className="text-blue-500" /> Translate Selection
        </Button>
      </div>
    </div>
  );
}
