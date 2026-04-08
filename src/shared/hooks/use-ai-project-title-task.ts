'use client';

import { useCallback } from 'react';
import { useAITask } from '@/shared/hooks/use-ai-task';
import { PhotuneAI } from '@/shared/lib/ai/photune-ai';

const DEFAULT_TITLE = 'Untitled Asset';

export function useAIProjectTitleTask() {
  const task = useAITask<string>();

  const generateTitle = useCallback(
    async (imageDataUrl: string) => {
      const normalized = imageDataUrl.trim();

      if (!normalized) {
        task.reset();
        return null;
      }

      return task.run(
        () => PhotuneAI.generateProjectTitle(normalized),
        {
          isFallback: (result) => result.trim() === DEFAULT_TITLE,
          fallbackErrorMessage: 'AI returned the default title as a safe fallback.',
        }
      );
    },
    [task]
  );

  return {
    ...task,
    generateTitle,
  };
}
