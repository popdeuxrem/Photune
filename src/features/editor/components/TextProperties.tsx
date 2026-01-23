'use client';

import { useAppStore } from '@/shared/store/useAppStore';
import { Label } from '@/shared/components/ui/label';
import { Input } from '@/shared/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/shared/components/ui/toggle-group';
import { Bold, Italic, Type, RotateCw } from 'lucide-react';
import { fabric } from 'fabric';

export function TextProperties() {
  const { fabricCanvas, activeObject, saveState } = useAppStore();
  
  if (!activeObject || activeObject.type !== 'textbox') return null;
  const txt = activeObject as fabric.Textbox;

  const update = (prop: string, val: any) => {
    activeObject.set(prop as any, val);
    activeObject.setCoords();
    fabricCanvas?.renderAll();
    saveState();
  };

  return (
    <div className="bg-zinc-900 text-white p-6 rounded-[24px] space-y-6 shadow-2xl">
      <div className="flex items-center gap-2 mb-2">
        <Type size={16} className="text-blue-400" />
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Text Settings</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-[10px] text-zinc-400">Size</Label>
          <Input type="number" value={Math.round(txt.fontSize || 24)} onChange={(e) => update('fontSize', parseInt(e.target.value))} className="bg-zinc-800 border-zinc-700 h-9" />
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] text-zinc-400">Rotate</Label>
          <div className="relative">
            <Input type="number" value={Math.round(txt.angle || 0)} onChange={(e) => update('angle', parseInt(e.target.value))} className="bg-zinc-800 border-zinc-700 h-9 pl-8" />
            <RotateCw size={12} className="absolute left-2.5 top-3 text-zinc-500" />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] text-zinc-400">Style</Label>
        <ToggleGroup type="multiple" className="justify-start gap-2">
          <ToggleGroupItem value="bold" className="bg-zinc-800 w-10 h-10 data-[state=on]:bg-blue-600" onClick={() => update('fontWeight', txt.fontWeight === 'bold' ? 'normal' : 'bold')}>
            <Bold size={16} />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" className="bg-zinc-800 w-10 h-10 data-[state=on]:bg-blue-600" onClick={() => update('fontStyle', txt.fontStyle === 'italic' ? 'normal' : 'italic')}>
            <Italic size={16} />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] text-zinc-400">Text Color</Label>
        <div className="flex gap-2">
          <input type="color" value={txt.fill as string} onChange={(e) => update('fill', e.target.value)} className="w-full h-10 bg-zinc-800 border-none rounded-lg cursor-pointer" />
        </div>
      </div>
    </div>
  );
}
