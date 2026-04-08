'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useAIProjectTitleTask } from '@/shared/hooks/use-ai-project-title-task';
import { AITaskStatus } from '@/shared/components/ai-task-status';

type NewProjectTitleAssistProps = {
  imageDataUrl?: string | null;
  value: string;
  onChange: (value: string) => void;
};

export function NewProjectTitleAssist({
  imageDataUrl = null,
  value,
  onChange,
}: NewProjectTitleAssistProps) {
  const [wasManuallyEdited, setWasManuallyEdited] = useState(false);
  const lastAppliedSuggestionRef = useRef<string | null>(null);

  const {
    state,
    generateTitle,
    reset,
    isLoading,
  } = useAIProjectTitleTask();

  const canSuggest = useMemo(() => {
    return Boolean(imageDataUrl?.trim()) && !isLoading;
  }, [imageDataUrl, isLoading]);

  const handleSuggest = async () => {
    if (!canSuggest || !imageDataUrl) return;

    const result = await generateTitle(imageDataUrl);
    if (!result) return;

    if (!wasManuallyEdited || !value.trim() || value === lastAppliedSuggestionRef.current) {
      onChange(result);
      lastAppliedSuggestionRef.current = result;
    }
  };

  useEffect(() => {
    if (!value.trim()) {
      setWasManuallyEdited(false);
    }
  }, [value]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <label className="block text-sm font-medium text-foreground">
          Project name
        </label>

        <button
          type="button"
          onClick={handleSuggest}
          disabled={!canSuggest}
          className="inline-flex items-center justify-center rounded-xl bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? 'Suggesting...' : 'Suggest title'}
        </button>
      </div>

      <input
        value={value}
        onChange={(event) => {
          setWasManuallyEdited(true);
          onChange(event.target.value);
        }}
        type="text"
        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary"
        placeholder="Untitled Project"
      />

      <AITaskStatus
        phase={state.phase}
        error={state.error}
        loading={
          <div className="rounded-xl border border-border bg-muted/30 p-3 text-sm text-muted-foreground">
            Generating project title...
          </div>
        }
        fallback={
          <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-300">
            {state.error || 'Default title was used as a safe fallback.'}
          </div>
        }
        success={
          state.data ? (
            <div className="rounded-xl border border-border bg-muted/30 p-3 text-sm text-foreground">
              Suggested title: {state.data}
            </div>
          ) : null
        }
      />

      {state.phase !== 'idle' && (
        <button
          type="button"
          onClick={reset}
          className="text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          Reset title suggestion state
        </button>
      )}
    </div>
  );
}
