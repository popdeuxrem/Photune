'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Textarea } from '@/shared/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { useAppStore } from '@/shared/store/useAppStore';
import { useToast } from '@/shared/components/ui/use-toast';
import { getAiSuggestion } from '@/shared/lib/api';
import { fabric } from 'fabric';

export function AiToolsModal({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (o: boolean) => void }) {
  const { fabricCanvas, activeObject } = useAppStore();
  const { toast } = useToast();
  const [tone, setTone] = useState('professional');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRewrite = async () => {
    if (!activeObject || !('text' in activeObject)) return;
    setLoading(true);
    try {
      const text = (activeObject as fabric.Textbox).text || '';
      const suggestion = await getAiSuggestion(text, tone);
      setResult(suggestion);
    } catch (e) {
      toast({ title: "AI Error", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const applyText = () => {
    if (activeObject && 'text' in activeObject) {
      (activeObject as fabric.Textbox).set('text', result);
      fabricCanvas?.renderAll();
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>AI Writing Assistant</DialogTitle>
          <DialogDescription>Enhance or rewrite your selected text.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <Select onValueChange={setTone} defaultValue={tone}>
            <SelectTrigger><SelectValue placeholder="Select Tone" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="casual">Casual</SelectItem>
              <SelectItem value="friendly">Friendly</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleRewrite} disabled={loading || !activeObject} className="w-full">
            {loading ? 'Generating...' : 'Rewrite Selection'}
          </Button>
          {result && (
            <>
              <Textarea value={result} onChange={(e) => setResult(e.target.value)} rows={4} />
              <Button onClick={applyText} className="w-full" variant="secondary">Apply Changes</Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
