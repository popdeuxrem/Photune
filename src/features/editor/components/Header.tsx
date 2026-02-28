'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/shared/components/ui/button';
import { useAppStore } from '@/shared/store/useAppStore';
import { Home, Save, Undo2, Redo2, Loader2 } from 'lucide-react';
import { saveProject } from '../lib/actions';
import { ExportModal } from './ExportModal';
import { useToast } from '@/shared/components/ui/use-toast';
import { useState } from 'react';
import { ThemeToggle } from '@/shared/components/theme-toggle';

export function Header({ projectId, projectName }: { projectId: string; projectName: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const { fabricCanvas, undo, redo, canUndo, canRedo } = useAppStore();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!fabricCanvas) return;
    setIsSaving(true);
    try {
      const data = fabricCanvas.toJSON(['isImporting', 'selectable', 'hasControls']);
      // Generate a small thumbnail for the dashboard
      const thumbnail = fabricCanvas.toDataURL({ 
        format: 'jpeg', 
        quality: 0.4,
        multiplier: 0.2
      });
      
      await saveProject(projectId, projectName, data, thumbnail);
      toast({ title: "Project Saved Successfully" });
    } catch (err) {
      console.error(err);
      toast({ title: "Save Failed", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <header className="h-14 border-b bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-4 shrink-0 shadow-sm dark:shadow-none z-20">
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard')} title="Back to Dashboard">
          <Home size={18} />
        </Button>
        <div className="w-[1px] h-6 bg-zinc-200 dark:bg-zinc-700 mx-2" />
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={undo} 
          disabled={!canUndo()}
          className={!canUndo() ? "opacity-30" : "dark:hover:bg-zinc-800"}
        >
          <Undo2 size={18} />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={redo} 
          disabled={!canRedo()}
          className={!canRedo() ? "opacity-30" : "dark:hover:bg-zinc-800"}
        >
          <Redo2 size={18} />
        </Button>
      </div>

      <div className="text-sm font-bold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-700">
        {projectName}
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <ExportModal />
        <Button size="sm" onClick={handleSave} disabled={isSaving} className="min-w-[80px]">
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : <><Save size={16} className="mr-2" /> Save</>}
        </Button>
      </div>
    </header>
  );
}
