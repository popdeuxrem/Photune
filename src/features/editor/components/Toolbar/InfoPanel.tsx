'use client';

import { useAppStore } from '@/shared/store/useAppStore';
import { Label } from '@/shared/components/ui/label';
import { FileImage, Layers, Maximize } from 'lucide-react';

export function InfoPanel() {
  const { fabricCanvas } = useAppStore();
  
  if (!fabricCanvas) return null;

  const objectCount = fabricCanvas.getObjects().length;
  const width = fabricCanvas.width;
  const height = fabricCanvas.height;

  return (
    <div className="space-y-6">
      <Label className="text-xs font-bold uppercase text-zinc-400">Document Specs</Label>
      
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-zinc-100 flex items-center justify-center text-zinc-500">
            <Maximize size={16} />
          </div>
          <div>
            <p className="text-xs font-bold">Dimensions</p>
            <p className="text-[11px] text-zinc-500">{width}px x {height}px</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-zinc-100 flex items-center justify-center text-zinc-500">
            <Layers size={16} />
          </div>
          <div>
            <p className="text-xs font-bold">Layers</p>
            <p className="text-[11px] text-zinc-500">{objectCount} active objects</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-zinc-100 flex items-center justify-center text-zinc-500">
            <FileImage size={16} />
          </div>
          <div>
            <p className="text-xs font-bold">Engine</p>
            <p className="text-[11px] text-zinc-500">Fabric.js v5.3 (WebGL)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
