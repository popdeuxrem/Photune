'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/shared/components/ui/button';
import { useAppStore } from '@/shared/store/useAppStore';
import { Home, Save, Undo2, Redo2, Download } from 'lucide-react';
import { saveProject } from '../lib/actions';
import { ExportModal } from './ExportModal';
import { useToast } from '@/shared/components/ui/use-toast';

export function Header({ projectId, projectName }: { projectId: string; projectName: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const { fabricCanvas, undo, redo, canUndo, canRedo } = useAppStore();

  const handleSave = async () => {
    if (!fabricCanvas) return;
    try {
      const data = fabricCanvas.toJSON();
      const img = fabricCanvas.toDataURL({ format: 'jpeg', quality: 0.5 });
      await saveProject(projectId, projectName, data, img);
      toast({ title: "Saved successfully" });
    } catch (err) {
      toast({ title: "Save failed", variant: "destructive" });
    }
  };

  return (
    <header className="h-14 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard')}>
          <Home size={18} />
        </Button>
        <div className="h-6 w-[1px] bg-zinc-800" />
        <Button variant="ghost" size="icon" onClick={undo} disabled={!canUndo()}>
          <Undo2 size={18} />
        </Button>
        <Button variant="ghost" size="icon" onClick={redo} disabled={!canRedo()}>
          <Redo2 size={18} />
        </Button>
      </div>

      <div className="text-sm font-medium text-zinc-400">{projectName}</div>

      <div className="flex items-center gap-2">
        <ExportModal />
        <Button size="sm" onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
          <Save size={16} className="mr-2" /> Save
        </Button>
      </div>
    </header>
  );
}
