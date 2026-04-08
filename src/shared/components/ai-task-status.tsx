'use client';

import type { ReactNode } from 'react';
import type { AITaskPhase } from '@/shared/hooks/use-ai-task';

type AITaskStatusProps = {
  phase: AITaskPhase;
  error?: string | null;
  idle?: ReactNode;
  loading?: ReactNode;
  success?: ReactNode;
  fallback?: ReactNode;
  errorState?: ReactNode;
};

export function AITaskStatus({
  phase,
  error,
  idle = null,
  loading = null,
  success = null,
  fallback = null,
  errorState = null,
}: AITaskStatusProps) {
  switch (phase) {
    case 'idle':
      return <>{idle}</>;
    case 'loading':
      return <>{loading}</>;
    case 'success':
      return <>{success}</>;
    case 'fallback':
      return <>{fallback}</>;
    case 'error':
      return (
        <>
          {errorState ?? (
            <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-300">
              {error || 'AI task failed.'}
            </div>
          )}
        </>
      );
    default:
      return null;
  }
}
