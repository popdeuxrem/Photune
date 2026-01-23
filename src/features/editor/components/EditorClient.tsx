'use client';

import { Sidebar } from './Toolbar/Sidebar';
import { Header } from './Header';
import { Canvas } from './Canvas';
import { JobStatusPanel } from './JobStatusPanel';

export function EditorClient({ projectId, initialProjectData }: { projectId: string; initialProjectData: any }) {
  return (
    <div className="flex flex-col h-screen bg-zinc-100 overflow-hidden">
      <Header projectId={projectId} projectName={initialProjectData?.name || 'Untitled Design'} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 relative flex items-center justify-center p-8 overflow-auto bg-zinc-50">
          <Canvas />
        </main>
      </div>
      <JobStatusPanel />
    </div>
  );
}
