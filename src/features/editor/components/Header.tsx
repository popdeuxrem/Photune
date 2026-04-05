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
import { Download } from 'lucide-react';

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
    <header className="h-12 md:h-14 border-b bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-2 md:px-4 shrink-0 shadow-sm dark:shadow-none z-20">
      <div className="flex items-center gap-1 md:gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard')} title="Back to Dashboard">
          <Home size={18} />
        </Button>
        <div className="hidden md:block w-[1px] h-6 bg-zinc-200 dark:bg-zinc-700" />
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={undo} 
          disabled={!canUndo()}
          className={!canUndo() ? "opacity-30" : "dark:hover:bg-zinc-800"}
          title="Undo"
        >
          <Undo2 size={18} />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={redo} 
          disabled={!canRedo()}
          className={!canRedo() ? "opacity-30" : "dark:hover:bg-zinc-800"}
          title="Redo"
        >
          <Redo2 size={18} />
        </Button>
      </div>

      <div className="flex-1 text-center px-2 min-w-0">
        <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300 truncate block">
          {projectName}
        </span>
      </div>

      <div className="flex items-center gap-1 md:gap-2">
        <ExportModal />
        <Button size="sm" onClick={handleSave} disabled={isSaving} className="min-w-[70px] md:min-w-[80px]">
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
        </Button>
        <div className="hidden md:flex items-center">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
