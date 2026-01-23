'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Sparkles, Eraser, Sliders, Stamp, Info } from 'lucide-react';
import { AiToolsPanel } from './Panels/AiToolsPanel';
import { EffectsPanel } from './Panels/EffectsPanel';
import { RemovePanel } from './RemovePanel';
import { StampPanel } from './StampPanel';
import { InfoPanel } from './InfoPanel';
import { TextProperties } from '../TextProperties';
import { useAppStore } from '@/shared/store/useAppStore';

export function Sidebar() {
  const { activeObject } = useAppStore();

  return (
    <aside className="w-80 border-r bg-white flex flex-col h-full shadow-sm z-10">
      <Tabs defaultValue="ai" className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-5 h-12 bg-zinc-50 border-b rounded-none p-0">
          <TabsTrigger value="ai" title="AI Tools"><Sparkles size={18} /></TabsTrigger>
          <TabsTrigger value="remove" title="Remove Tools"><Eraser size={18} /></TabsTrigger>
          <TabsTrigger value="effects" title="Image Effects"><Sliders size={18} /></TabsTrigger>
          <TabsTrigger value="stamps" title="Stamps & Shapes"><Stamp size={18} /></TabsTrigger>
          <TabsTrigger value="info" title="Project Info"><Info size={18} /></TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <TabsContent value="ai" className="m-0 mt-2"><AiToolsPanel /></TabsContent>
          <TabsContent value="remove" className="m-0 mt-2"><RemovePanel /></TabsContent>
          <TabsContent value="effects" className="m-0 mt-2"><EffectsPanel /></TabsContent>
          <TabsContent value="stamps" className="m-0 mt-2"><StampPanel /></TabsContent>
          <TabsContent value="info" className="m-0 mt-2"><InfoPanel /></TabsContent>
          
          {activeObject && (
            <div className="pt-4 border-t mt-4 animate-in fade-in slide-in-from-bottom-2">
               <TextProperties />
            </div>
          )}
        </div>
      </Tabs>
    </aside>
  );
}
