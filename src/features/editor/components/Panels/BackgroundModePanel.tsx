'use client';

type BackgroundModePanelProps = {
  hasContent: boolean;
};

export function BackgroundModePanel({ hasContent }: BackgroundModePanelProps) {
  if (!hasContent) {
    return (
      <div className="flex h-full flex-col gap-4 p-4">
        <div>
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Background</h3>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Upload or open a project before using background tools.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Background</h3>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Adjust or regenerate the background using the current background controls.
        </p>
      </div>

      <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 p-4 text-sm text-zinc-600 dark:text-zinc-400">
        Background controls are available in the sidebar.
      </div>
    </div>
  );
}