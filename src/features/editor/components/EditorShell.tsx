'use client';

import type { ReactNode } from 'react';

type EditorShellProps = {
  header: ReactNode;
  sidebar: ReactNode;
  panel: ReactNode;
  canvas: ReactNode;
};

export function EditorShell({ header, sidebar, panel, canvas }: EditorShellProps) {
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
      <div className="shrink-0 border-b border-zinc-200 dark:border-zinc-800">
        {header}
      </div>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <aside className="hidden shrink-0 border-r border-zinc-200 dark:border-zinc-800 lg:flex">
          {sidebar}
        </aside>

        <main className="flex min-w-0 flex-1 overflow-hidden">
          <section className="min-w-0 flex-1 overflow-hidden">
            {canvas}
          </section>

          {panel && (
            <aside className="hidden shrink-0 border-l border-zinc-200 dark:border-zinc-800 xl:flex">
              {panel}
            </aside>
          )}
        </main>
      </div>
    </div>
  );
}