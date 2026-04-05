'use client';

type RewriteModePanelProps = {
  hasContent: boolean;
  canRewrite: boolean;
};

export function RewriteModePanel({ hasContent, canRewrite }: RewriteModePanelProps) {
  if (!hasContent) {
    return (
      <div className="flex h-full flex-col gap-4 p-4">
        <div>
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Rewrite</h3>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Upload or open a project before using rewrite tools.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Rewrite</h3>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {canRewrite
            ? 'Use AI-assisted rewrite tools for the current text context.'
            : 'Select usable text content to enable rewrite actions.'}
        </p>
      </div>

      {canRewrite ? (
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 p-4 text-sm text-zinc-600 dark:text-zinc-400">
          Rewrite controls are available in the sidebar when text is selected.
        </div>
      ) : (
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 p-4 text-sm text-zinc-600 dark:text-zinc-400">
          Rewrite becomes available when the editor has valid text content or a usable selection.
        </div>
      )}
    </div>
  );
}