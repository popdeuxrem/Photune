'use client';

type EditorEmptyStateProps = {
  onUploadClick: () => void;
};

export function EditorEmptyState({ onUploadClick }: EditorEmptyStateProps) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-zinc-50 dark:bg-zinc-900 px-6">
      <div className="w-full max-w-xl rounded-3xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100">
          <span className="text-2xl">＋</span>
        </div>

        <h2 className="mb-3 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Start with an image
        </h2>

        <p className="mx-auto mb-6 max-w-md text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          Upload a PNG, JPEG, or WebP image to begin editing. Text, erase, rewrite,
          background, and export tools become useful after your project has content.
        </p>

        <button
          type="button"
          onClick={onUploadClick}
          className="inline-flex items-center justify-center rounded-xl bg-zinc-900 dark:bg-zinc-100 px-5 py-3 text-sm font-medium text-white dark:text-zinc-900 transition hover:opacity-90"
        >
          Upload image
        </button>

        <div className="mt-4 text-xs text-zinc-500 dark:text-zinc-500">
          Supported types: PNG, JPEG, WebP · Max size: 10 MB
        </div>
      </div>
    </div>
  );
}