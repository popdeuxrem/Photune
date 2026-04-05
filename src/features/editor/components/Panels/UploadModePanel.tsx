'use client';

type UploadModePanelProps = {
  hasContent: boolean;
  onUploadClick: () => void;
};

export function UploadModePanel({ hasContent, onUploadClick }: UploadModePanelProps) {
  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Upload</h3>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {hasContent
            ? 'Upload a new image to replace or restart the current editing context.'
            : 'Start by uploading an image to begin editing.'}
        </p>
      </div>

      <button
        type="button"
        onClick={onUploadClick}
        className="inline-flex items-center justify-center rounded-xl bg-zinc-900 dark:bg-zinc-100 px-4 py-3 text-sm font-medium text-white dark:text-zinc-900 transition hover:opacity-90"
      >
        Upload image
      </button>

      <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 p-4 text-sm text-zinc-600 dark:text-zinc-400">
        <div>Supported types: PNG, JPEG, WebP</div>
        <div>Maximum size: 10 MB</div>
      </div>

      {hasContent ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-300">
          Uploading a new image may replace the current working image state.
        </div>
      ) : null}
    </div>
  );
}