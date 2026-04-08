'use client';

import { useCallback, useState } from 'react';

export type AITaskPhase = 'idle' | 'loading' | 'success' | 'fallback' | 'error';

export type AITaskState<T> = {
  phase: AITaskPhase;
  data: T | null;
  error: string | null;
};

export type RunAITaskOptions<T> = {
  isFallback?: (result: T) => boolean;
  fallbackErrorMessage?: string;
};

const DEFAULT_ERROR_MESSAGE = 'AI task failed. Please try again.';

export function useAITask<T>() {
  const [state, setState] = useState<AITaskState<T>>({
    phase: 'idle',
    data: null,
    error: null,
  });

  const reset = useCallback(() => {
    setState({
      phase: 'idle',
      data: null,
      error: null,
    });
  }, []);

  const run = useCallback(
    async (
      task: () => Promise<T>,
      options?: RunAITaskOptions<T>
    ): Promise<T | null> => {
      setState((current) => ({
        phase: 'loading',
        data: current.data,
        error: null,
      }));

      try {
        const result = await task();
        const isFallback = options?.isFallback?.(result) ?? false;

        setState({
          phase: isFallback ? 'fallback' : 'success',
          data: result,
          error: isFallback ? options?.fallbackErrorMessage ?? null : null,
        });

        return result;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : DEFAULT_ERROR_MESSAGE;

        setState({
          phase: 'error',
          data: null,
          error: message,
        });

        return null;
      }
    },
    []
  );

  return {
    state,
    run,
    reset,
    isIdle: state.phase === 'idle',
    isLoading: state.phase === 'loading',
    isSuccess: state.phase === 'success',
    isFallback: state.phase === 'fallback',
    isError: state.phase === 'error',
  };
}
