import { fabric } from 'fabric';
import { logInfo, logError } from '@/shared/lib/logging/logger';

export type ExportFormat = 'png' | 'jpeg' | 'webp' | 'svg' | 'pdf';

export type ExportTransaction = {
  format: ExportFormat;
  state: fabric.Canvas;
  startTime: number;
  originalState: string;
  rollbackFn: () => void;
};

export type ExportResult = {
  success: boolean;
  blob?: Blob;
  message?: string;
  rollbackRequired?: boolean;
};

const activeTransactions = new Map<string, ExportTransaction>();

/**
 * Start an export transaction with automatic rollback on failure
 * Preserves canvas state for recovery if export fails
 */
export function startExportTransaction(
  canvas: fabric.Canvas,
  format: ExportFormat,
  transactionId: string,
): ExportTransaction {
  const originalState = JSON.stringify(canvas.toJSON());
  
  const transaction: ExportTransaction = {
    format,
    state: canvas,
    startTime: Date.now(),
    originalState,
    rollbackFn: () => {
      try {
        canvas.loadFromJSON(originalState, () => {
          canvas.renderAll();
          logInfo({
            event: 'export_transaction_rollback_success',
            surface: 'export',
            operation: 'export',
            metadata: { format, transactionId, duration: Date.now() - transaction.startTime },
          });
        });
      } catch (error) {
        logError({
          event: 'export_transaction_rollback_failed',
          surface: 'export',
          operation: 'export',
          message: 'Failed to rollback canvas state',
          errorMessage: String(error),
          metadata: { format, transactionId },
        });
      }
    },
  };

  activeTransactions.set(transactionId, transaction);
  
  logInfo({
    event: 'export_transaction_started',
    surface: 'export',
    operation: 'export',
    metadata: { format, transactionId },
  });

  return transaction;
}

/**
 * Commit a successful export transaction
 * Cleans up transaction record and logs success
 */
export function commitExportTransaction(
  transactionId: string,
  blob: Blob,
  filename: string,
): ExportResult {
  const transaction = activeTransactions.get(transactionId);
  if (!transaction) {
    logError({
      event: 'export_transaction_commit_missing',
      surface: 'export',
      operation: 'export',
      message: 'Transaction not found for commit',
      metadata: { transactionId, filename },
    });
    return {
      success: false,
      message: 'Transaction lost',
    };
  }

  const duration = Date.now() - transaction.startTime;
  activeTransactions.delete(transactionId);

  logInfo({
    event: 'export_transaction_committed',
    surface: 'export',
    operation: 'export',
    metadata: {
      format: transaction.format,
      transactionId,
      duration,
      blobSize: blob.size,
      filename,
    },
  });

  return {
    success: true,
    blob,
  };
}

/**
 * Rollback a failed export transaction
 * Restores canvas to pre-export state and logs failure
 */
export function rollbackExportTransaction(
  transactionId: string,
  error: Error,
): ExportResult {
  const transaction = activeTransactions.get(transactionId);
  if (!transaction) {
    logError({
      event: 'export_transaction_rollback_missing',
      surface: 'export',
      operation: 'export',
      message: 'Transaction not found for rollback',
      metadata: { transactionId },
    });
    return {
      success: false,
      message: 'Rollback failed: transaction not found',
      rollbackRequired: true,
    };
  }

  const duration = Date.now() - transaction.startTime;
  activeTransactions.delete(transactionId);

  logError({
    event: 'export_transaction_failed',
    surface: 'export',
    operation: 'export',
    message: 'Export operation failed, rolling back',
    errorMessage: error.message,
    metadata: {
      format: transaction.format,
      transactionId,
      duration,
    },
  });

  // Attempt rollback
  transaction.rollbackFn();

  return {
    success: false,
    message: `Export failed: ${error.message}`,
    rollbackRequired: false, // Rollback was attempted
  };
}

/**
 * Get all active transactions (useful for debugging)
 */
export function getActiveTransactions(): string[] {
  return Array.from(activeTransactions.keys());
}

/**
 * Clean up stale transactions (useful for periodic maintenance)
 */
export function cleanupStaleTransactions(maxAgeMs: number = 5 * 60 * 1000): void {
  const now = Date.now();
  let cleaned = 0;

  for (const [id, transaction] of activeTransactions.entries()) {
    if (now - transaction.startTime > maxAgeMs) {
      // Attempt rollback for stale transaction
      transaction.rollbackFn();
      activeTransactions.delete(id);
      cleaned++;

      logInfo({
        event: 'export_transaction_stale_cleanup',
        surface: 'export',
        operation: 'export',
        metadata: { transactionId: id, age: now - transaction.startTime },
      });
    }
  }

  if (cleaned > 0) {
    logInfo({
      event: 'export_transaction_cleanup_complete',
      surface: 'export',
      operation: 'export',
      metadata: { cleanedCount: cleaned },
    });
  }
}
