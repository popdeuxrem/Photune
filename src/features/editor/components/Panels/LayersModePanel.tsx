'use client';

type LayersModePanelProps = {
  hasContent: boolean;
  hasObjectSelection: boolean;
};

export function LayersModePanel({ hasContent, hasObjectSelection }: LayersModePanelProps) {
  if (!hasContent) {
    return (
      <div className="flex h-full flex-col gap-4 p-4">
        <div>
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Layers</h3>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Upload or open a project before using layer controls.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Layers</h3>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {hasObjectSelection
            ? 'Manage layer order and object properties.'
            : 'Select an object on the canvas to manage its layer position and properties.'}
        </p>
      </div>

      <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 p-4 text-sm text-zinc-600 dark:text-zinc-400">
        {hasObjectSelection
          ? 'Layer controls for selected object appear here when connected to canvas state.'
          : 'Select an object to access layer controls (bring forward, send back, duplicate, delete).'}
      </div>
    </div>
  );
}