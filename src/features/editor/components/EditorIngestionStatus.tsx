'use client';

type EditorIngestionStatusProps = {
  state: 'uploading' | 'processing' | 'error';
  message?: string;
  errorMessage?: string;
  onRetry?: () => void;
};

export function EditorIngestionStatus({
  state,
  message,
  errorMessage,
  onRetry,
}: EditorIngestionStatusProps) {
  const title =
    state === 'uploading'
      ? 'Uploading image'
      : state === 'processing'
        ? 'Preparing editor'
        : 'Upload failed';

  const body =
    state === 'error'
      ? errorMessage || 'The selected image could not be processed.'
      : message ||
        (state === 'uploading'
          ? 'Your image has been accepted and is being prepared.'
          : 'Loading the image into the editor and preparing it for editing.');

  return (
    <div className="flex h-full w-full items-center justify-center bg-zinc-50 dark:bg-zinc-900 px-6">
      <div className="w-full max-w-md rounded-3xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100">
          {state === 'error' ? (
            <span className="text-xl">!</span>
          ) : (
            <span className="text-xl">●</span>
          )}
        </div>

        <h2 className="mb-3 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          {title}
        </h2>

        <p className="mx-auto mb-6 max-w-sm text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          {body}
        </p>

        {state === 'error' && onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center justify-center rounded-xl bg-zinc-900 dark:bg-zinc-100 px-5 py-3 text-sm font-medium text-white dark:text-zinc-900 transition hover:opacity-90"
          >
            Try again
          </button>
        ) : (
          <div className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">
            <span className="inline-block h-2 w-2 rounded-full bg-current opacity-70" />
            {state === 'uploading' ? 'Processing file selection' : 'Preparing canvas state'}
          </div>
        )}
      </div>
    </div>
  );
}