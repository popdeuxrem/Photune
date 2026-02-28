'use client';

import { useEffect, useCallback } from 'react';
import { useAppStore } from '@/shared/store/useAppStore';
import { Sidebar } from './Toolbar/Sidebar';
import { Header } from './Header';
import { Canvas } from './Canvas';
import { JobStatusPanel } from './JobStatusPanel';
import { fabric } from 'fabric';
import { useToast } from '@/shared/components/ui/use-toast';

interface EditorClientProps {
  projectId: string;
  initialProjectData: any;
}

export function EditorClient({ projectId, initialProjectData }: EditorClientProps) {
  const { fabricCanvas, saveState, undo, redo, canUndo, canRedo } = useAppStore();
  const { toast } = useToast();

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!fabricCanvas) return;

    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const ctrlKey = isMac ? e.metaKey : e.ctrlKey;

    // Delete selected objects
    if ((e.key === 'Delete' || e.key === 'Backspace') && !e.ctrlKey && !e.metaKey) {
      const activeObjects = fabricCanvas.getActiveObjects();
      if (activeObjects.length > 0) {
        activeObjects.forEach((obj) => fabricCanvas.remove(obj));
        fabricCanvas.discardActiveObject();
        fabricCanvas.renderAll();
        saveState();
        e.preventDefault();
      }
      return;
    }

    // Ctrl/Cmd + Z = Undo
    if (ctrlKey && e.key === 'z' && !e.shiftKey) {
      if (canUndo()) {
        undo();
        e.preventDefault();
      }
      return;
    }

    // Ctrl/Cmd + Y or Ctrl/Cmd + Shift + Z = Redo
    if ((ctrlKey && e.key === 'y') || (ctrlKey && e.shiftKey && e.key === 'z')) {
      if (canRedo()) {
        redo();
        e.preventDefault();
      }
      return;
    }

    // Ctrl/Cmd + S = Save
    if (ctrlKey && e.key === 's') {
      e.preventDefault();
      // Trigger save via custom event
      window.dispatchEvent(new CustomEvent('photune-save'));
      return;
    }

    // Ctrl/Cmd + D = Duplicate
    if (ctrlKey && e.key === 'd') {
      const activeObject = fabricCanvas.getActiveObject();
      if (activeObject) {
        activeObject.clone((cloned: fabric.Object) => {
          cloned.set({
            left: (cloned.left || 0) + 20,
            top: (cloned.top || 0) + 20,
          });
          fabricCanvas.add(cloned);
          fabricCanvas.setActiveObject(cloned);
          fabricCanvas.renderAll();
          saveState();
        });
        e.preventDefault();
      }
      return;
    }

    // Ctrl/Cmd + A = Select all
    if (ctrlKey && e.key === 'a') {
      fabricCanvas.discardActiveObject();
      const objects = fabricCanvas.getObjects();
      if (objects.length > 0) {
        const selection = new fabric.ActiveSelection(objects, { canvas: fabricCanvas });
        fabricCanvas.setActiveObject(selection);
        fabricCanvas.renderAll();
      }
      e.preventDefault();
      return;
    }

    // Escape = Deselect
    if (e.key === 'Escape') {
      fabricCanvas.discardActiveObject();
      fabricCanvas.renderAll();
      return;
    }

  }, [fabricCanvas, saveState, undo, redo, canUndo, canRedo]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    // 1. Check if we have a canvas and initial data to load
    if (fabricCanvas && initialProjectData?.canvas_data) {
      
      // Set a temporary flag to prevent the 'object:added' event 
      // from flooding the history stack during the initial load
      (fabricCanvas as any).isImporting = true;

      fabricCanvas.loadFromJSON(initialProjectData.canvas_data, () => {
        // 2. Fix Background Image CORS
        // If the background image came from Cloudflare or Supabase, 
        // we must re-apply the anonymous crossOrigin to allow exporting later.
        const bg = fabricCanvas.backgroundImage as fabric.Image;
        if (bg && bg.getSrc()) {
          const src = bg.getSrc();
          fabric.Image.fromURL(src, (img) => {
            img.set({ crossOrigin: 'anonymous' });
            fabricCanvas.setBackgroundImage(
              img, 
              fabricCanvas.renderAll.bind(fabricCanvas), 
              { crossOrigin: 'anonymous' }
            );
          }, { crossOrigin: 'anonymous' });
        }

        fabricCanvas.renderAll();
        
        // 3. Reset flag and save the "Initial State" into history
        (fabricCanvas as any).isImporting = false;
        saveState();
      });
    }
  }, [fabricCanvas, initialProjectData, saveState]);

  return (
    <div className="flex flex-col h-screen bg-zinc-100 dark:bg-zinc-950 overflow-hidden select-none">
      {/* Top Navigation Bar (Home, Undo, Save, Export) */}
      <Header 
        projectId={projectId} 
        projectName={initialProjectData?.name || 'Untitled Project'} 
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Side: Modular AI & Tool Panels */}
        <Sidebar />

        {/* Central Workspace: Interactive Fabric.js Canvas */}
        <main className="flex-1 relative flex items-center justify-center p-4 sm:p-8 md:p-12 overflow-auto bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
          <div className="relative shadow-[0_30px_60px_rgba(0,0,0,0.12)] dark:shadow-[0_30px_60px_rgba(0,0,0,0.5)] bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 transition-all duration-500 ease-in-out">
            <Canvas />
          </div>
        </main>
      </div>

      {/* Overlay: AI Processing and OCR Job Status Notifications */}
      <JobStatusPanel />
    </div>
  );
}
