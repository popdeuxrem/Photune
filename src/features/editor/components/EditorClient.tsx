'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/shared/store/useAppStore';
import { Canvas } from './Canvas';
import { Toolbar } from './Toolbar';
import { Header } from './Header';
import { JobStatusPanel } from './JobStatusPanel';

interface EditorClientProps {
  projectId: string;
  initialProjectData: any;
}

export function EditorClient({ projectId, initialProjectData }: EditorClientProps) {
  const { fabricCanvas, saveState } = useAppStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (fabricCanvas && initialProjectData?.canvas_data) {
      fabricCanvas.loadFromJSON(initialProjectData.canvas_data, () => {
        fabricCanvas.renderAll();
        // Ensure background image is handled correctly if it exists as a URL
        const bg = fabricCanvas.backgroundImage as fabric.Image;
        if (bg && bg.src) {
           fabric.Image.fromURL(bg.src, (img) => {
              fabricCanvas.setBackgroundImage(img, fabricCanvas.renderAll.bind(fabricCanvas));
           }, { crossOrigin: 'anonymous' });
        }
        setIsReady(true);
      });
    } else if (fabricCanvas) {
      setIsReady(true);
    }
  }, [fabricCanvas, initialProjectData]);

  return (
    <div className="flex flex-col h-screen bg-[#1a1a1a] text-white">
      <Header projectId={projectId} projectName={initialProjectData?.name || 'Untitled'} />
      <div className="flex flex-1 overflow-hidden">
        <Toolbar />
        <main className="flex-1 relative flex items-center justify-center p-8 bg-zinc-900 overflow-auto">
          <div className="shadow-2xl bg-white border border-zinc-700">
            <Canvas />
          </div>
        </main>
      </div>
      <JobStatusPanel />
    </div>
  );
}
