'use client';

type ExportModePanelProps = {
  hasContent: boolean;
};

export function ExportModePanel({ hasContent }: ExportModePanelProps) {
  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Export</h3>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Export your current work when you are ready to save or share the result.
        </p>
      </div>

      {hasContent ? (
        <>
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 p-4 text-sm text-zinc-600 dark:text-zinc-400">
            Use the top-bar Export action for quick access, or choose export format below.
          </div>
        </>
      ) : (
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 p-4 text-sm text-zinc-600 dark:text-zinc-400">
          Export becomes available after your project has image or canvas content.
        </div>
      )}
    </div>
  );
}