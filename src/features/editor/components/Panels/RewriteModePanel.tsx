'use client';

import { useMemo, useState } from 'react';
import { type Tone } from '@/shared/lib/ai/photune-ai';
import { useAIRewriteTask } from '@/shared/hooks/use-ai-rewrite-task';
import { AITaskStatus } from '@/shared/components/ai-task-status';

type RewriteModePanelProps = {
  hasContent: boolean;
  canRewrite: boolean;
};

const TONE_OPTIONS: Tone[] = ['professional', 'casual', 'marketing', 'concise'];

export function RewriteModePanel({
  hasContent,
  canRewrite,
}: RewriteModePanelProps) {
  const [sourceText, setSourceText] = useState('');
  const [tone, setTone] = useState<Tone>('professional');

  const {
    state,
    rewrite,
    reset,
    isLoading,
  } = useAIRewriteTask();

  const normalizedSourceText = sourceText.trim();

  const canSubmit = useMemo(() => {
    return hasContent && canRewrite && normalizedSourceText.length > 0 && !isLoading;
  }, [hasContent, canRewrite, normalizedSourceText, isLoading]);

  const handleRewrite = async () => {
    if (!canSubmit) return;
    await rewrite(normalizedSourceText, tone);
  };

  if (!hasContent) {
    return (
      <div className="flex h-full flex-col gap-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">Rewrite</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload or open a project before using rewrite tools.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <div>
        <h3 className="text-base font-semibold text-foreground">Rewrite</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Generate an alternate text version with a selected tone.
        </p>
      </div>

      {!canRewrite && (
        <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
          Select or provide usable text content to enable rewrite actions.
        </div>
      )}

      <div className="space-y-3">
        <label className="block text-sm font-medium text-foreground">
          Source text
        </label>
        <textarea
          value={sourceText}
          onChange={(event) => {
            setSourceText(event.target.value);
            if (state.phase !== 'idle') {
              reset();
            }
          }}
          rows={6}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary"
          placeholder="Paste or type text to rewrite..."
        />
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-foreground">
          Tone
        </label>
        <select
          value={tone}
          onChange={(event) => setTone(event.target.value as Tone)}
          className="h-10 rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300"
        >
          {TONE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={handleRewrite}
        disabled={!canSubmit}
        className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? 'Rewriting...' : 'Rewrite text'}
      </button>

      <AITaskStatus
        phase={state.phase}
        error={state.error}
        loading={
          <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            Running rewrite task...
          </div>
        }
        fallback={
          <div className="space-y-3 rounded-xl border border-amber-300 bg-amber-50 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
            <div className="text-sm font-medium text-amber-700 dark:text-amber-300">
              Fallback result
            </div>
            <div className="text-sm text-amber-700 dark:text-amber-300">
              {state.error || 'The original text was returned.'}
            </div>
            {state.data && (
              <div className="rounded-lg bg-background/80 p-3 text-sm text-foreground">
                {state.data}
              </div>
            )}
          </div>
        }
        success={
          <div className="space-y-3 rounded-xl border border-border bg-muted/30 p-4">
            <div className="text-sm font-medium text-foreground">
              Rewrite result
            </div>
            {state.data && (
              <div className="rounded-lg bg-background p-3 text-sm text-foreground">
                {state.data}
              </div>
            )}
          </div>
        }
      />
    </div>
  );
}
