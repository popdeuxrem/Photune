'use client';

import { useAppStore } from '@/shared/store/useAppStore';
import { Label } from '@/shared/components/ui/label';
import { Input } from '@/shared/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/shared/components/ui/toggle-group';
import { Bold, Italic, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { fabric } from 'fabric';

export function TextProperties() {
  const { fabricCanvas, activeObject, saveState } = useAppStore();
  
  if (!activeObject || activeObject.type !== 'textbox') return null;

  const update = (prop: string, value: any) => {
    activeObject.set(prop as any, value);
    fabricCanvas?.renderAll();
    saveState();
  };

  const txt = activeObject as fabric.Textbox;

  return (
    <div className="space-y-4 border-t pt-4">
      <Label className="text-xs uppercase text-zinc-400 font-bold">Text Properties</Label>
      <div className="grid gap-4">
        <div className="flex items-center justify-between">
          <span className="text-sm">Font Size</span>
          <Input 
            type="number" 
            className="w-16 h-8" 
            value={txt.fontSize} 
            onChange={(e) => update('fontSize', parseInt(e.target.value))} 
          />
        </div>
        <ToggleGroup type="multiple" className="justify-start">
          <ToggleGroupItem 
            value="bold" 
            aria-label="Bold"
            data-state={txt.fontWeight === 'bold' ? 'on' : 'off'}
            onClick={() => update('fontWeight', txt.fontWeight === 'bold' ? 'normal' : 'bold')}
          >
            <Bold size={16} />
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="italic" 
            aria-label="Italic"
            data-state={txt.fontStyle === 'italic' ? 'on' : 'off'}
            onClick={() => update('fontStyle', txt.fontStyle === 'italic' ? 'normal' : 'italic')}
          >
            <Italic size={16} />
          </ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup type="single" value={txt.textAlign} onValueChange={(v) => v && update('textAlign', v)} className="justify-start">
          <ToggleGroupItem value="left"><AlignLeft size={16} /></ToggleGroupItem>
          <ToggleGroupItem value="center"><AlignCenter size={16} /></ToggleGroupItem>
          <ToggleGroupItem value="right"><AlignRight size={16} /></ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
}
