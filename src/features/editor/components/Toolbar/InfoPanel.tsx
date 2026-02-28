'use client';

import { useAppStore } from '@/shared/store/useAppStore';
import { Label } from '@/shared/components/ui/label';
import { FileImage, Layers, Maximize, Keyboard } from 'lucide-react';

export function InfoPanel() {
  const { fabricCanvas } = useAppStore();
  
  if (!fabricCanvas) return null;

  const objectCount = fabricCanvas.getObjects().length;
  const width = fabricCanvas.width;
  const height = fabricCanvas.height;

  const shortcuts = [
    { key: '⌘Z', action: 'Undo' },
    { key: '⌘⇧Z', action: 'Redo' },
    { key: '⌘S', action: 'Save' },
    { key: '⌘D', action: 'Duplicate' },
    { key: '⌘A', action: 'Select All' },
    { key: 'Del', action: 'Delete' },
    { key: 'Esc', action: 'Deselect' },
  ];

  return (
    <div className="space-y-6">
      <Label className="text-xs font-bold uppercase text-zinc-400">Document Specs</Label>
      
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500">
            <Maximize size={16} />
          </div>
          <div>
            <p className="text-xs font-bold">Dimensions</p>
            <p className="text-[11px] text-zinc-500">{width}px x {height}px</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500">
            <Layers size={16} />
          </div>
          <div>
            <p className="text-xs font-bold">Layers</p>
            <p className="text-[11px] text-zinc-500">{objectCount} active objects</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500">
            <FileImage size={16} />
          </div>
          <div>
            <p className="text-xs font-bold">Engine</p>
            <p className="text-[11px] text-zinc-500">Fabric.js v5.3 (WebGL)</p>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-zinc-200 dark:border-zinc-700">
        <div className="flex items-center gap-2 mb-3">
          <Keyboard size={14} className="text-zinc-400" />
          <Label className="text-xs font-bold uppercase text-zinc-400">Shortcuts</Label>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {shortcuts.map((s) => (
            <div key={s.key} className="flex items-center justify-between text-xs">
              <span className="text-zinc-500 dark:text-zinc-400">{s.action}</span>
              <kbd className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-[10px] font-mono">{s.key}</kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
