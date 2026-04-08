'use client';

import { useState } from 'react';
import { fabric } from 'fabric';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Textarea } from '@/shared/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { useAppStore } from '@/shared/store/useAppStore';
import { useToast } from '@/shared/components/ui/use-toast';
import { PhotuneAI, type Tone } from '@/shared/lib/photune-ai';

export function AiToolsModal({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  const { fabricCanvas, activeObject, saveState } = useAppStore();
  const { toast } = useToast();
  const [tone, setTone] = useState<Tone>('professional');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRewrite = async () => {
    if (!activeObject || !('text' in activeObject)) {
      toast({ title: 'No text selected', variant: 'destructive' });
      return;
    }

    const textbox = activeObject as fabric.Textbox;
    setLoading(true);

    try {
      const { suggestion, changed } = await PhotuneAI.rewriteWithMetadata(
        textbox.text || '',
        tone
      );

      setResult(suggestion);

      if (!changed) {
        toast({
          title: 'No AI change proposed',
          description: 'Photune kept the original text as the safest fallback.',
        });
      }
    } catch {
      toast({
        title: 'AI Service Unavailable',
        description: 'The editor remains usable without AI. Try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const applyText = () => {
    if (!activeObject || !('text' in activeObject)) {
      return;
    }

    const textbox = activeObject as fabric.Textbox;
    textbox.set('text', result);
    textbox.setCoords();
    fabricCanvas?.renderAll();
    saveState();

    setIsOpen(false);
    setResult('');

    toast({
      title: 'Suggestion applied',
      description: 'AI text was applied only after explicit confirmation.',
    });
  };

  const clearSuggestion = () => {
    setResult('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>AI Writing Assistant</DialogTitle>
          <DialogDescription>
            Generate a suggestion first. Nothing changes on canvas until you apply it.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-zinc-500">Tone Profile</label>
            <Select onValueChange={(value) => setTone(value as Tone)} defaultValue={tone}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a tone..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional &amp; Polished</SelectItem>
                <SelectItem value="casual">Casual &amp; Friendly</SelectItem>
                <SelectItem value="marketing">Bold Marketing Copy</SelectItem>
                <SelectItem value="concise">Short &amp; Punchy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleRewrite}
            disabled={loading || !activeObject}
            className="w-full h-10 bg-zinc-900 hover:bg-zinc-800"
          >
            {loading ? 'AI is thinking...' : 'Generate Suggestion'}
          </Button>

          {result && (
            <div className="space-y-3 pt-2 animate-in fade-in slide-in-from-top-1">
              <label className="text-xs font-bold uppercase text-zinc-500">Suggested Result</label>
              <Textarea
                value={result}
                onChange={(e) => setResult(e.target.value)}
                rows={4}
                className="resize-none bg-zinc-50 border-zinc-200"
              />
              <div className="flex gap-2">
                <Button onClick={applyText} className="flex-1" variant="secondary">
                  Apply Suggestion
                </Button>
                <Button onClick={clearSuggestion} className="flex-1" variant="outline">
                  Discard
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
