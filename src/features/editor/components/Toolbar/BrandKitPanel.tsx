'use client';

import { useState } from 'react';
import { useAppStore } from '@/shared/store/useAppStore';
import { Label } from '@/shared/components/ui/label';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Plus, Palette, Type, Layout, Sparkles } from 'lucide-react';

interface BrandColor {
  id: string;
  hex: string;
  name: string;
}

interface BrandFont {
  id: string;
  family: string;
  role: 'heading' | 'body' | 'accent';
}

interface BrandKit {
  colors: BrandColor[];
  fonts: BrandFont[];
  logos: string[];
}

const DEFAULT_BRAND_KIT: BrandKit = {
  colors: [
    { id: '1', hex: '#000000', name: 'Primary' },
    { id: '2', hex: '#ffffff', name: 'Background' },
  ],
  fonts: [
    { id: '1', family: 'Inter', role: 'body' },
    { id: '2', family: 'Playfair Display', role: 'heading' },
  ],
  logos: [],
};

export function BrandKitPanel() {
  const { fabricCanvas, saveState } = useAppStore();
  const [colors, setColors] = useState<BrandColor[]>(DEFAULT_BRAND_KIT.colors);
  const [fonts, setFonts] = useState<BrandFont[]>(DEFAULT_BRAND_KIT.fonts);

  const addColor = () => {
    const newColor: BrandColor = {
      id: Date.now().toString(),
      hex: '#6366f1',
      name: `Color ${colors.length + 1}`,
    };
    setColors([...colors, newColor]);
  };

  const applyColor = (hex: string) => {
    const activeObject = fabricCanvas?.getActiveObject();
    if (activeObject && 'set' in activeObject) {
      if ('fill' in activeObject) {
        activeObject.set('fill', hex);
        fabricCanvas?.renderAll();
        saveState();
      }
    }
  };

  const applyFont = (fontFamily: string) => {
    const activeObject = fabricCanvas?.getActiveObject();
    if (activeObject && 'set' in activeObject) {
      if ('fontFamily' in activeObject) {
        activeObject.set('fontFamily', fontFamily);
        fabricCanvas?.renderAll();
        saveState();
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Palette size={16} className="text-zinc-400" />
        <Label className="text-xs font-bold uppercase text-zinc-400">Brand Colors</Label>
      </div>

      <div className="flex flex-wrap gap-2">
        {colors.map((color) => (
          <button
            key={color.id}
            onClick={() => applyColor(color.hex)}
            className="group relative w-10 h-10 rounded-lg border-2 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 transition-colors"
            style={{ backgroundColor: color.hex }}
            title={color.name}
          >
            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-zinc-500 opacity-0 group-hover:opacity-100 whitespace-nowrap">
              {color.name}
            </span>
          </button>
        ))}
        <button
          onClick={addColor}
          className="w-10 h-10 rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-600 flex items-center justify-center hover:border-zinc-400 transition-colors"
        >
          <Plus size={14} className="text-zinc-400" />
        </button>
      </div>

      <div className="flex items-center gap-2 pt-4">
        <Type size={16} className="text-zinc-400" />
        <Label className="text-xs font-bold uppercase text-zinc-400">Brand Fonts</Label>
      </div>

      <div className="space-y-2">
        {fonts.map((font) => (
          <button
            key={font.id}
            onClick={() => applyFont(font.family)}
            className="w-full text-left px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
          >
            <span className="text-sm font-medium" style={{ fontFamily: font.family }}>
              {font.family}
            </span>
            <span className="text-xs text-zinc-400 ml-2">({font.role})</span>
          </button>
        ))}
      </div>

      <div className="pt-4 border-t border-zinc-200 dark:border-zinc-700">
        <Button variant="outline" size="sm" className="w-full dark:border-zinc-600 dark:hover:bg-zinc-800">
          <Layout size={14} className="mr-2" /> Save Brand Kit
        </Button>
      </div>
    </div>
  );
}
