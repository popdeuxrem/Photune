'use client';

import { useCallback } from 'react';
import { useAITask } from '@/shared/hooks/use-ai-task';
import { PhotuneAI, type FontSuggestion } from '@/shared/lib/ai/photune-ai';

const DEFAULT_FONT: FontSuggestion = {
  category: 'sans-serif',
  family: 'Inter',
  weight: '400',
};

export function useAIFontDetectionTask() {
  const task = useAITask<FontSuggestion>();

  const detectFont = useCallback(
    async (imageDataUrl: string) => {
      const normalized = imageDataUrl.trim();

      if (!normalized) {
        task.reset();
        return null;
      }

      return task.run(
        () => PhotuneAI.detectFont(normalized),
        {
          isFallback: (result) =>
            result.category === DEFAULT_FONT.category &&
            result.family === DEFAULT_FONT.family &&
            result.weight === DEFAULT_FONT.weight,
          fallbackErrorMessage: 'AI returned the default font suggestion as a safe fallback.',
        }
      );
    },
    [task]
  );

  return {
    ...task,
    detectFont,
  };
}
