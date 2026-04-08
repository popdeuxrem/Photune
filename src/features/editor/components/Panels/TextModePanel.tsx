'use client';

import { useMemo, useState } from 'react';
import { useAIFontDetectionTask } from '@/shared/hooks/use-ai-font-detection-task';
import { AITaskStatus } from '@/shared/components/ai-task-status';

type TextAlign = 'left' | 'center' | 'right' | 'justify';

type SelectedTextStyle = {
  fontSize: number;
  textAlign: TextAlign;
  charSpacing: number;
  lineHeight: number;
};

type TextModePanelProps = {
  hasContent: boolean;
  hasTextSelected: boolean;
  imageDataUrl?: string | null;
  onApplyFontSuggestion?: (input: { family: string; weight: string }) => void;
  onAddText?: () => void;
  selectedTextStyle?: SelectedTextStyle;
  onUpdateTextStyle?: (input: Partial<SelectedTextStyle>) => void;
};

export function TextModePanel({
  hasContent,
  hasTextSelected,
  imageDataUrl = null,
  onApplyFontSuggestion,
  onAddText,
  selectedTextStyle,
  onUpdateTextStyle,
}: TextModePanelProps) {
  const {
    state,
    detectFont,
    reset,
    isLoading,
  } = useAIFontDetectionTask();

  const [draftFontSize, setDraftFontSize] = useState<number | ''>('');
  const [draftCharSpacing, setDraftCharSpacing] = useState<number | ''>('');
  const [draftLineHeight, setDraftLineHeight] = useState<number | ''>('');

  const canDetectFont = useMemo(() => {
    return hasContent && Boolean(imageDataUrl?.trim()) && !isLoading;
  }, [hasContent, imageDataUrl, isLoading]);

  const canEditText = Boolean(hasTextSelected && selectedTextStyle && onUpdateTextStyle);

  const handleDetectFont = async () => {
    if (!canDetectFont || !imageDataUrl) return;

    const result = await detectFont(imageDataUrl);
    if (result && onApplyFontSuggestion) {
      onApplyFontSuggestion({
        family: result.family,
        weight: result.weight,
      });
    }
  };

  const commitFontSize = () => {
    if (!canEditText || draftFontSize === '') return;
    onUpdateTextStyle?.({ fontSize: Number(draftFontSize) });
    setDraftFontSize('');
  };

  const commitCharSpacing = () => {
    if (!canEditText || draftCharSpacing === '') return;
    onUpdateTextStyle?.({ charSpacing: Number(draftCharSpacing) });
    setDraftCharSpacing('');
  };

  const commitLineHeight = () => {
    if (!canEditText || draftLineHeight === '') return;
    onUpdateTextStyle?.({ lineHeight: Number(draftLineHeight) });
    setDraftLineHeight('');
  };

  if (!hasContent) {
    return (
      <div className="flex h-full flex-col gap-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">Text</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload or open a project before using text tools.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <div>
        <h3 className="text-base font-semibold text-foreground">Text</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {hasTextSelected
            ? 'Edit the currently selected text.'
            : 'Select a text object to activate typographic controls.'}
        </p>
      </div>

      <div className="rounded-xl border border-border bg-muted/30 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-medium text-foreground">
              Add text
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              Insert a new editable text object onto the canvas.
            </div>
          </div>

          <button
            type="button"
            onClick={onAddText}
            disabled={!hasContent || !onAddText}
            className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Add text
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-muted/30 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-medium text-foreground">
              Font suggestion
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              Ask AI to suggest a matching font category from the current image.
            </div>
          </div>

          <button
            type="button"
            onClick={handleDetectFont}
            disabled={!canDetectFont}
            className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? 'Detecting...' : 'Suggest font'}
          </button>
        </div>
      </div>

      <AITaskStatus
        phase={state.phase}
        error={state.error}
        loading={
          <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            Running font detection...
          </div>
        }
        fallback={
          <div className="space-y-3 rounded-xl border border-amber-300 bg-amber-50 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
            <div className="text-sm font-medium text-amber-700 dark:text-amber-300">
              Fallback font suggestion
            </div>
            <div className="text-sm text-amber-700 dark:text-amber-300">
              {state.error || 'Default font suggestion was used.'}
            </div>
            {state.data && (
              <div className="rounded-lg bg-background/80 p-3 text-sm text-foreground">
                {state.data.family} · {state.data.weight} · {state.data.category}
              </div>
            )}
          </div>
        }
        success={
          <div className="space-y-3 rounded-xl border border-border bg-muted/30 p-4">
            <div className="text-sm font-medium text-foreground">
              Suggested font
            </div>
            {state.data && (
              <div className="rounded-lg bg-background p-3 text-sm text-foreground">
                {state.data.family} · {state.data.weight} · {state.data.category}
              </div>
            )}
          </div>
        }
      />

      <div className="rounded-xl border border-border bg-background p-4">
        <div className="mb-4 text-sm font-medium text-foreground">
          Text controls
        </div>

        {!canEditText ? (
          <div className="text-sm text-muted-foreground">
            Select a text object on the canvas to edit its typography.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="block text-sm text-foreground">Font size</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={draftFontSize === '' ? selectedTextStyle?.fontSize ?? 40 : draftFontSize}
                    onChange={(event) => setDraftFontSize(Number(event.target.value))}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={commitFontSize}
                    className="rounded-xl border border-border px-3 py-2 text-sm text-foreground"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm text-foreground">Alignment</label>
                <select
                  value={selectedTextStyle?.textAlign ?? 'left'}
                  onChange={(event) =>
                    onUpdateTextStyle?.({ textAlign: event.target.value as TextAlign })
                  }
                  className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300"
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                  <option value="justify">Justify</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="block text-sm text-foreground">Tracking</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="1"
                    value={draftCharSpacing === '' ? selectedTextStyle?.charSpacing ?? 0 : draftCharSpacing}
                    onChange={(event) => setDraftCharSpacing(Number(event.target.value))}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={commitCharSpacing}
                    className="rounded-xl border border-border px-3 py-2 text-sm text-foreground"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm text-foreground">Line height</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0.1"
                    step="0.01"
                    value={draftLineHeight === '' ? selectedTextStyle?.lineHeight ?? 1.16 : draftLineHeight}
                    onChange={(event) => setDraftLineHeight(Number(event.target.value))}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={commitLineHeight}
                    className="rounded-xl border border-border px-3 py-2 text-sm text-foreground"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {state.phase !== 'idle' && (
        <button
          type="button"
          onClick={reset}
          className="self-start text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          Reset AI font suggestion state
        </button>
      )}
    </div>
  );
}
