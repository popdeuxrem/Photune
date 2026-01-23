'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/shared/store/useAppStore';
import { Canvas } from './Canvas';
import { Toolbar } from './Toolbar';
import { Header } from './Header';
import { JobStatusPanel } from './JobStatusPanel';

export function EditorClient({ projectId, initialProjectData }: { projectId: string; initialProjectData: any }) {
  const { fabricCanvas, saveState } = useAppStore();

  useEffect(() => {
    // Load existing project data if available
    if (fabricCanvas && initialProjectData?.canvas_data) {
      // Set importing flag to true to avoid polluting history stack on load
      (fabricCanvas as any).isImporting = true;
      
      fabricCanvas.loadFromJSON(initialProjectData.canvas_data, () => {
        fabricCanvas.renderAll();
        // Handle background image crossOrigin if it was lost during serialization
        const bg = fabricCanvas.backgroundImage as fabric.Image;
        if (bg && bg.src) {
           fabric.Image.fromURL(bg.src, (img) => {
              fabricCanvas.setBackgroundImage(img, fabricCanvas.renderAll.bind(fabricCanvas));
           }, { crossOrigin: 'anonymous' });
        }
        (fabricCanvas as any).isImporting = false;
        saveState();
      });
    }
  }, [fabricCanvas, initialProjectData, saveState]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-zinc-100">
      <Header projectId={projectId} projectName={initialProjectData?.name || 'New Project'} />
      <div className="flex flex-1 overflow-hidden">
        <Toolbar />
        <main className="flex-1 relative flex items-center justify-center p-12 overflow-auto">
          <div className="shadow-[0_20px_50px_rgba(0,0,0,0.2)] bg-white border border-zinc-200">
            <Canvas />
          </div>
        </main>
      </div>
      <JobStatusPanel />
    </div>
  );
}
