'use client';

import type { ReactNode } from 'react';

type EditorShellProps = {
  header: ReactNode;
  sidebar: ReactNode;
  panel: ReactNode;
  canvas: ReactNode;
  mobileModeNav?: ReactNode;
  mobilePanel?: ReactNode;
};

export function EditorShell({
  header,
  sidebar,
  panel,
  canvas,
  mobileModeNav,
  mobilePanel,
}: EditorShellProps) {
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
      <div className="shrink-0 border-b border-zinc-200 dark:border-zinc-800">
        {header}
      </div>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <aside className="hidden shrink-0 border-r border-zinc-200 dark:border-zinc-800 lg:flex">
          {sidebar}
        </aside>

        <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <section className="min-h-0 min-w-0 flex-1 overflow-hidden">
            {canvas}
          </section>

          {mobileModeNav ? (
            <section className="shrink-0 border-t border-zinc-200 dark:border-zinc-800 lg:hidden">
              {mobileModeNav}
            </section>
          ) : null}

          <section className="max-h-[40vh] min-h-0 shrink-0 overflow-y-auto border-t border-zinc-200 dark:border-zinc-800 lg:hidden">
            <div className="px-4 py-3">
              {mobilePanel}
            </div>
          </section>
        </main>

        <aside className="hidden shrink-0 border-l border-zinc-200 dark:border-zinc-800 xl:flex">
          {panel}
        </aside>
      </div>
    </div>
  );
}
