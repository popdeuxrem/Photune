'use client';
import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';
import { useAppStore } from '@/shared/store/useAppStore';
import { Sparkles, Languages } from 'lucide-react';
import { AiClient } from '@/shared/lib/ai-client';

export function AiToolsPanel() {
  const { fabricCanvas, activeObject, saveState, addJob, updateJob, removeJob } = useAppStore();

  const handleRewrite = async () => {
    if (!activeObject || activeObject.type !== 'textbox') return;
    const id = Date.now();
    addJob({ id, text: 'AI is thinking...', status: 'processing' });
    try {
      const text = (activeObject as any).text;
      const res = await AiClient.rewrite(text, 'professional');
      (activeObject as any).set('text', res);
      fabricCanvas?.renderAll();
      saveState();
      updateJob(id, 'completed', 'Rewrite successful!');
    } catch {
      updateJob(id, 'failed', 'AI rewrite failed.');
    } finally {
      setTimeout(() => removeJob(id), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-[10px] font-black uppercase text-zinc-400">Content AI</Label>
        <Button variant="outline" className="w-full justify-start gap-2 h-11 rounded-xl" onClick={handleRewrite}>
          <Sparkles size={16} className="text-amber-500" /> Professional Rewrite
        </Button>
      </div>
      <div className="space-y-2">
        <Label className="text-[10px] font-black uppercase text-zinc-400">Vision AI</Label>
        <Button variant="outline" className="w-full justify-start gap-2 h-11 rounded-xl" onClick={() => {}}>
          <Languages size={16} className="text-blue-500" /> Translate Selection
        </Button>
      </div>
    </div>
  );
}
