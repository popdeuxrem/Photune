'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/shared/store/useAppStore';
import { Sidebar } from './Toolbar/Sidebar';
import { Header } from './Header';
import { Canvas } from './Canvas';
import { JobStatusPanel } from './JobStatusPanel';
import { fabric } from 'fabric';

interface EditorClientProps {
  projectId: string;
  initialProjectData: any;
}

export function EditorClient({ projectId, initialProjectData }: EditorClientProps) {
  const { fabricCanvas, saveState } = useAppStore();

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
    <div className="flex flex-col h-screen bg-zinc-100 overflow-hidden select-none">
      {/* Top Navigation Bar (Home, Undo, Save, Export) */}
      <Header 
        projectId={projectId} 
        projectName={initialProjectData?.name || 'Untitled Project'} 
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Side: Modular AI & Tool Panels */}
        <Sidebar />

        {/* Central Workspace: Interactive Fabric.js Canvas */}
        <main className="flex-1 relative flex items-center justify-center p-4 sm:p-8 md:p-12 overflow-auto bg-zinc-50 border-t border-zinc-200">
          <div className="relative shadow-[0_30px_60px_rgba(0,0,0,0.12)] bg-white border border-zinc-200 transition-all duration-500 ease-in-out">
            <Canvas />
          </div>
        </main>
      </div>

      {/* Overlay: AI Processing and OCR Job Status Notifications */}
      <JobStatusPanel />
    </div>
  );
}
