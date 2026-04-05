'use client';

type EraseModePanelProps = {
  hasContent: boolean;
};

export function EraseModePanel({ hasContent }: EraseModePanelProps) {
  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Erase</h3>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Remove unwanted elements from your image using the erase tool.
        </p>
      </div>

      {hasContent ? (
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 p-4">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Select objects on the canvas to erase them, or use the Magic Erase tool from the sidebar.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 p-4">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Erase mode is available after you upload an image.
          </p>
        </div>
      )}
    </div>
  );
}