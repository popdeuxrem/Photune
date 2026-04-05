'use client';

type TextModePanelProps = {
  hasContent: boolean;
  hasTextSelected: boolean;
};

export function TextModePanel({ hasContent, hasTextSelected }: TextModePanelProps) {
  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Text</h3>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {hasTextSelected
            ? 'Text selected. Edit text properties in the sidebar.'
            : 'Select text on the canvas to edit its properties, or use text tools to add new text.'}
        </p>
      </div>

      {hasContent ? (
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 p-4">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Use the text selection tool to select text on the canvas. Selected text will show properties in the sidebar.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 p-4">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Text mode is available after you upload an image and add text to the canvas.
          </p>
        </div>
      )}
    </div>
  );
}