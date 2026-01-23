'use client';

import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Textarea } from '@/shared/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/shared/components/ui/select';
import { useAppStore } from '@/shared/store/useAppStore';
import { useToast } from '@/shared/components/ui/use-toast';
import { AiClient } from '@/shared/lib/ai-client';
import { fabric } from 'fabric';

export function AiToolsModal({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (o: boolean) => void }) {
  const { fabricCanvas, activeObject, saveState } = useAppStore();
  const { toast } = useToast();
  const [tone, setTone] = useState('professional');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRewrite = async () => {
    if (!activeObject || !('text' in activeObject)) {
      toast({ title: "No text selected", variant: "destructive" });
      return;
    }

    const textbox = activeObject as fabric.Textbox;
    setLoading(true);
    
    try {
      // Use the unified AiClient (which handles Puter + CF fallbacks)
      const suggestion = await AiClient.rewrite(textbox.text || '', tone);
      setResult(suggestion);
    } catch (e) {
      toast({ 
        title: "AI Service Unavailable", 
        description: "Please check your internet connection or API limits.",
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const applyText = () => {
    if (activeObject && 'text' in activeObject) {
      const textbox = activeObject as fabric.Textbox;
      
      // Update text
      textbox.set('text', result);
      
      // Force canvas to re-calculate text layout
      textbox.setCoords();
      fabricCanvas?.renderAll();
      
      // Crucial: Push this change to the Undo/Redo history
      saveState();
      
      setIsOpen(false);
      setResult(''); // Clear result for next use
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>AI Writing Assistant</DialogTitle>
          <DialogDescription>
            Transform your text to match any style or mood instantly.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-zinc-500">Tone Profile</label>
            <Select onValueChange={setTone} defaultValue={tone}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a tone..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional & Polished</SelectItem>
                <SelectItem value="casual">Casual & Friendly</SelectItem>
                <SelectItem value="marketing">Bold Marketing Copy</SelectItem>
                <SelectItem value="concise">Short & Punchy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleRewrite} 
            disabled={loading || !activeObject} 
            className="w-full h-10 bg-zinc-900 hover:bg-zinc-800"
          >
            {loading ? 'AI is thinking...' : 'Generate New Version'}
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
              <Button onClick={applyText} className="w-full" variant="secondary">
                Replace Current Text
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
