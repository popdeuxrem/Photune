'use client';

import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';
import { useAppStore } from '@/shared/store/useAppStore';
import { Square, Circle, Triangle, Star, BadgeCheck } from 'lucide-react';
import { fabric } from 'fabric';

export function StampPanel() {
  const { fabricCanvas, saveState } = useAppStore();

  const addShape = (type: string) => {
    if (!fabricCanvas) return;
    let shape;
    const defaults = {
      left: 100,
      top: 100,
      fill: '#3b82f6',
      width: 100,
      height: 100,
      strokeWidth: 0,
    };

    switch (type) {
      case 'rect': shape = new fabric.Rect(defaults); break;
      case 'circle': shape = new fabric.Circle({ ...defaults, radius: 50 }); break;
      case 'triangle': shape = new fabric.Triangle(defaults); break;
    }

    if (shape) {
      fabricCanvas.add(shape);
      fabricCanvas.setActiveObject(shape);
      saveState();
    }
  };

  return (
    <div className="space-y-4">
      <Label className="text-xs font-bold uppercase text-zinc-400">Basic Shapes</Label>
      <div className="grid grid-cols-3 gap-2">
        <Button variant="outline" size="icon" onClick={() => addShape('rect')}><Square size={20} /></Button>
        <Button variant="outline" size="icon" onClick={() => addShape('circle')}><Circle size={20} /></Button>
        <Button variant="outline" size="icon" onClick={() => addShape('triangle')}><Triangle size={20} /></Button>
      </div>

      <div className="pt-4 border-t space-y-2">
        <Label className="text-xs font-bold uppercase text-zinc-400">Stamps & Badges</Label>
        <Button variant="outline" className="w-full justify-start gap-2" onClick={() => {/* Pre-built logo logic */}}>
          <BadgeCheck size={16} className="text-emerald-500" /> Verified Stamp
        </Button>
      </div>
    </div>
  );
}
