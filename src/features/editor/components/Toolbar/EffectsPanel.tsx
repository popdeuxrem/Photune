'use client';

import { Label } from '@/shared/components/ui/label';
import { Slider } from '@/shared/components/ui/slider';
import { Button } from '@/shared/components/ui/button';
import { useAppStore } from '@/shared/store/useAppStore';
import { applyFilter } from '../../lib/image-filters';
import { RefreshCw } from 'lucide-react';

export function EffectsPanel() {
  const { fabricCanvas, saveState } = useAppStore();

  const handleFilter = (type: string, val: any) => {
    if (!fabricCanvas) return;
    applyFilter(fabricCanvas, type, val);
    saveState();
  };

  const resetFilters = () => {
    const bg = fabricCanvas?.backgroundImage as fabric.Image;
    if (bg) {
      bg.filters = [];
      bg.applyFilters();
      fabricCanvas?.renderAll();
      saveState();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-bold uppercase text-zinc-400">Filters</Label>
        <Button variant="ghost" size="sm" onClick={resetFilters} className="h-6 text-[10px]">
          <RefreshCw size={12} className="mr-1" /> RESET
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium">
            <span>Brightness</span>
          </div>
          <Slider 
            defaultValue={[0]} 
            max={1} 
            min={-1} 
            step={0.01} 
            onValueChange={([v]) => handleFilter('brightness', v)} 
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium">
            <span>Contrast</span>
          </div>
          <Slider 
            defaultValue={[0]} 
            max={1} 
            min={-1} 
            step={0.01} 
            onValueChange={([v]) => handleFilter('contrast', v)} 
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium">
            <span>Blur</span>
          </div>
          <Slider 
            defaultValue={[0]} 
            max={1} 
            min={0} 
            step={0.01} 
            onValueChange={([v]) => handleFilter('blur', v)} 
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" onClick={() => handleFilter('grayscale', true)}>Grayscale</Button>
          <Button variant="outline" size="sm" onClick={() => handleFilter('pixelate', 4)}>Pixelate</Button>
        </div>
      </div>
    </div>
  );
}
