'use client';

import { useCallback } from 'react';
import { useAITask } from '@/shared/hooks/use-ai-task';
import { PhotuneAI, type Tone } from '@/shared/lib/ai/photune-ai';

export function useAIRewriteTask() {
  const task = useAITask<string>();

  const rewrite = useCallback(
    async (text: string, tone: Tone) => {
      const normalized = text.trim();

      if (!normalized) {
        task.reset();
        return null;
      }

      return task.run(
        () => PhotuneAI.rewrite(normalized, tone),
        {
          isFallback: (result) => result.trim() === normalized,
          fallbackErrorMessage: 'AI returned the original text as a safe fallback.',
        }
      );
    },
    [task]
  );

  return {
    ...task,
    rewrite,
  };
}
