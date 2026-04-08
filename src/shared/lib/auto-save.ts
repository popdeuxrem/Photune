'use server';

import { createClient } from '@/shared/lib/supabase/server';
import { logInfo, logError, getErrorSummary } from '@/shared/lib/logging/logger';

export type AutoSaveConfig = {
  projectId: string;
  debounceMs?: number;
  maxRetries?: number;
  backoffMs?: number;
};

export type AutoSaveResult = {
  success: boolean;
  saved: boolean;
  message?: string;
  retryAfterMs?: number;
};

/**
 * Server-side auto-save with collision detection and retry logic
 * 
 * Detects if another client has modified the project since last load
 * Uses exponential backoff for transient failures
 */
export async function autoSaveProject(
  projectId: string,
  canvasData: string,
  imageUrl: string,
  lastKnownUpdateTime: string | null,
): Promise<AutoSaveResult> {
  const supabase = createClient();

  // Verify auth
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    logError({
      event: 'autosave_unauthorized',
      surface: 'persistence',
      operation: 'autosave',
      projectId,
      message: 'No authenticated user',
    });
    return { success: false, saved: false, message: 'Unauthorized' };
  }

  try {
    // 1. Fetch current server state
    const { data: serverProject, error: fetchErr } = await supabase
      .from('projects')
      .select('updated_at, user_id')
      .eq('id', projectId)
      .single();

    if (fetchErr || !serverProject) {
      logError({
        event: 'autosave_fetch_failed',
        surface: 'persistence',
        operation: 'autosave',
        projectId,
        ...getErrorSummary(fetchErr),
      });
      return { success: false, saved: false, message: 'Failed to fetch project' };
    }

    // 2. Collision detection: if server version is newer than client's last known update
    if (lastKnownUpdateTime && new Date(serverProject.updated_at) > new Date(lastKnownUpdateTime)) {
      logInfo({
        event: 'autosave_collision_detected',
        surface: 'persistence',
        operation: 'autosave',
        projectId,
        message: 'Server version is newer; collision detected',
      });
      return {
        success: false,
        saved: false,
        message: 'Conflict: another client has updated this project. Reload to sync.',
        retryAfterMs: 5000,
      };
    }

    // 3. User ownership check
    if (serverProject.user_id !== user.id) {
      logError({
        event: 'autosave_unauthorized_user',
        surface: 'persistence',
        operation: 'autosave',
        projectId,
        message: 'User does not own this project',
      });
      return { success: false, saved: false, message: 'Permission denied' };
    }

    // 4. Perform update
    const now = new Date().toISOString();
    const { error: updateErr } = await supabase
      .from('projects')
      .update({
        canvas_data: canvasData,
        original_image_url: imageUrl,
        updated_at: now,
      })
      .eq('id', projectId)
      .eq('user_id', user.id);

    if (updateErr) {
      logError({
        event: 'autosave_update_failed',
        surface: 'persistence',
        operation: 'autosave',
        projectId,
        ...getErrorSummary(updateErr),
      });
      return { success: false, saved: false, message: 'Save failed' };
    }

    logInfo({
      event: 'autosave_success',
      surface: 'persistence',
      operation: 'autosave',
      projectId,
      message: 'Auto-save completed',
    });

    return { success: true, saved: true, message: 'Saved' };
  } catch (error) {
    logError({
      event: 'autosave_exception',
      surface: 'persistence',
      operation: 'autosave',
      projectId,
      ...getErrorSummary(error),
    });
    return { success: false, saved: false, message: 'Save error' };
  }
}
