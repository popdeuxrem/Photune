'use client';
import { Label } from '@/shared/components/ui/label';
import { Slider } from '@/shared/components/ui/slider';
import { useAppStore } from '@/shared/store/useAppStore';
import { applyFilter } from '../../../lib/image-filters';

export function EffectsPanel() {
  const { fabricCanvas } = useAppStore();

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Label className="text-[10px] font-black uppercase text-zinc-400">Image Filters</Label>
        <div className="space-y-6">
          <div className="space-y-3">
            <span className="text-xs font-bold text-zinc-600">Brightness</span>
            <Slider 
              defaultValue={[0]} 
              min={-1} 
              max={1} 
              step={0.01} 
              onValueChange={([v]) => fabricCanvas && applyFilter(fabricCanvas, 'brightness', v)} 
            />
          </div>
          <div className="space-y-3">
            <span className="text-xs font-bold text-zinc-600">Contrast</span>
            <Slider 
              defaultValue={[0]} 
              min={-1} 
              max={1} 
              step={0.01} 
              onValueChange={([v]) => fabricCanvas && applyFilter(fabricCanvas, 'contrast', v)} 
            />
          </div>
          <div className="space-y-3">
            <span className="text-xs font-bold text-zinc-600">Blur</span>
            <Slider 
              defaultValue={[0]} 
              min={0} 
              max={1} 
              step={0.01} 
              onValueChange={([v]) => fabricCanvas && applyFilter(fabricCanvas, 'blur', v)} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
