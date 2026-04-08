'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';
import { AlertTriangle, RefreshCw, Save } from 'lucide-react';

export interface ConflictResolutionDialogProps {
  open: boolean;
  onReload: () => void;
  onKeepLocal: () => void;
  onCancel?: () => void;
}

/**
 * Dialog for handling concurrent edit conflicts
 * Allows user to choose between:
 * - Reload: Discard local changes and reload from server
 * - Keep Local: Keep local changes (may lose server changes)
 * - Cancel: Dismiss the dialog for now
 */
export function ConflictResolutionDialog({
  open,
  onReload,
  onKeepLocal,
  onCancel,
}: ConflictResolutionDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleReload = async () => {
    setIsLoading(true);
    try {
      onReload();
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeepLocal = async () => {
    setIsLoading(true);
    try {
      onKeepLocal();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <AlertDialogTitle>Sync Conflict Detected</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="mt-4 space-y-3 text-sm">
            <p>
              Another window or tab has modified this project. How would you like to proceed?
            </p>
            <div className="space-y-2 rounded-lg bg-muted p-3 text-xs text-muted-foreground">
              <p className="font-semibold text-foreground">Your options:</p>
              <ul className="space-y-1 pl-3">
                <li className="list-disc">
                  <strong>Reload:</strong> Discard local changes and reload from server
                </li>
                <li className="list-disc">
                  <strong>Keep Local:</strong> Keep your current changes (server changes may be lost)
                </li>
              </ul>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex gap-3 pt-4">
          <AlertDialogCancel onClick={onCancel} disabled={isLoading}>
            Dismiss
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleKeepLocal}
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90"
          >
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Keep Local
              </>
            )}
          </AlertDialogAction>
          <AlertDialogAction
            onClick={handleReload}
            disabled={isLoading}
            className="bg-amber-600 hover:bg-amber-700"
          >
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Reloading...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Reload
              </>
            )}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
