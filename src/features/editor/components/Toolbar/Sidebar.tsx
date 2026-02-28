'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Sparkles, Eraser, Sliders, Stamp, Info, Palette, Layers } from 'lucide-react';
import { AiToolsPanel } from './Panels/AiToolsPanel';
import { EffectsPanel } from './Panels/EffectsPanel';
import { RemovePanel } from './RemovePanel';
import { StampPanel } from './StampPanel';
import { InfoPanel } from './InfoPanel';
import { BrandKitPanel } from './BrandKitPanel';
import { BatchProcessorPanel } from './BatchProcessorPanel';
import { TextProperties } from '../TextProperties';
import { useAppStore } from '@/shared/store/useAppStore';

export function Sidebar() {
  const { activeObject } = useAppStore();

  return (
    <aside className="w-80 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col h-full shadow-sm dark:shadow-none z-10">
      <Tabs defaultValue="ai" className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-7 h-12 bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 rounded-none p-0">
          <TabsTrigger value="ai" title="AI Tools" className="dark:data-[state=active]:bg-zinc-700 dark:data-[state=active]:text-zinc-100"><Sparkles size={16} /></TabsTrigger>
          <TabsTrigger value="remove" title="Remove Tools" className="dark:data-[state=active]:bg-zinc-700 dark:data-[state=active]:text-zinc-100"><Eraser size={16} /></TabsTrigger>
          <TabsTrigger value="effects" title="Image Effects" className="dark:data-[state=active]:bg-zinc-700 dark:data-[state=active]:text-zinc-100"><Sliders size={16} /></TabsTrigger>
          <TabsTrigger value="stamps" title="Stamps & Shapes" className="dark:data-[state=active]:bg-zinc-700 dark:data-[state=active]:text-zinc-100"><Stamp size={16} /></TabsTrigger>
          <TabsTrigger value="brand" title="Brand Kit" className="dark:data-[state=active]:bg-zinc-700 dark:data-[state=active]:text-zinc-100"><Palette size={16} /></TabsTrigger>
          <TabsTrigger value="batch" title="Batch Process" className="dark:data-[state=active]:bg-zinc-700 dark:data-[state=active]:text-zinc-100"><Layers size={16} /></TabsTrigger>
          <TabsTrigger value="info" title="Project Info" className="dark:data-[state=active]:bg-zinc-700 dark:data-[state=active]:text-zinc-100"><Info size={16} /></TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <TabsContent value="ai" className="m-0 mt-2"><AiToolsPanel /></TabsContent>
          <TabsContent value="remove" className="m-0 mt-2"><RemovePanel /></TabsContent>
          <TabsContent value="effects" className="m-0 mt-2"><EffectsPanel /></TabsContent>
          <TabsContent value="stamps" className="m-0 mt-2"><StampPanel /></TabsContent>
          <TabsContent value="brand" className="m-0 mt-2"><BrandKitPanel /></TabsContent>
          <TabsContent value="batch" className="m-0 mt-2"><BatchProcessorPanel /></TabsContent>
          <TabsContent value="info" className="m-0 mt-2"><InfoPanel /></TabsContent>
          
          {activeObject && (
            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-700 mt-4 animate-in fade-in slide-in-from-bottom-2">
               <TextProperties />
            </div>
          )}
        </div>
      </Tabs>
    </aside>
  );
}
