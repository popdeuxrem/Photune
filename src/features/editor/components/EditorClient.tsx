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
    if (fabricCanvas && initialProjectData?.canvas_data) {
      fabricCanvas.loadFromJSON(initialProjectData.canvas_data, () => {
        fabricCanvas.renderAll();
        saveState();
      });
    }
  }, [fabricCanvas, initialProjectData, saveState]);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header projectId={projectId} projectName={initialProjectData?.name || 'New Project'} />
      <div className="flex flex-1 overflow-hidden">
        <Toolbar />
        <main className="flex-1 bg-zinc-100 flex items-center justify-center p-8 overflow-auto">
          <div className="shadow-2xl bg-white"><Canvas /></div>
        </main>
      </div>
      <JobStatusPanel />
    </div>
  );
}
