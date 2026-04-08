'use server';

import { revalidatePath } from 'next/cache';

import { requireAuthenticatedUser } from '@/shared/lib/auth/require-authenticated-user';
import {
  assertCanvasDataSerializable,
  isPersistedProjectId,
  normalizeImageReference,
  normalizeProjectName,
} from '@/shared/lib/persistence/project-guards';
import { getErrorSummary, logError, logInfo } from '@/shared/lib/logging/logger';

type SavedProjectResult = {
  id: string;
  name: string;
  original_image_url: string | null;
  updated_at: string;
};

export async function saveProject(
  id: string,
  name: unknown,
  canvasData: unknown,
  imageUrl: unknown
): Promise<SavedProjectResult> {
  const normalizedName = normalizeProjectName(name);
  const normalizedImageUrl = normalizeImageReference(imageUrl);

  assertCanvasDataSerializable(canvasData);

  if (id !== 'new' && !isPersistedProjectId(id)) {
    throw new Error('Invalid project id.');
  }

  logInfo({
    event: 'project_save_start',
    surface: 'persistence',
    route: '/editor/[projectId]',
    operation: 'project_save',
    projectId: id,
  });

  const { supabase, user } = await requireAuthenticatedUser();

  try {
    let result:
      | {
          id: string;
          name: string;
          original_image_url: string | null;
          updated_at: string;
        }
      | null = null;

    if (id === 'new') {
      const insertPayload = {
        user_id: user.id,
        name: normalizedName,
        canvas_data: canvasData,
        original_image_url: normalizedImageUrl,
      };

      const { data, error } = await supabase
        .from('projects')
        .insert([insertPayload])
        .select('id, name, original_image_url, updated_at')
        .single();

      if (error) {
        throw error;
      }

      result = data;
    } else {
      const updatePayload = {
        name: normalizedName,
        canvas_data: canvasData,
        original_image_url: normalizedImageUrl,
      };

      const { data, error } = await supabase
        .from('projects')
        .update(updatePayload)
        .eq('id', id)
        .eq('user_id', user.id)
        .select('id, name, original_image_url, updated_at')
        .single();

      if (error) {
        throw error;
      }

      result = data;
    }

    logInfo({
      event: 'project_save_success',
      surface: 'persistence',
      route: '/editor/[projectId]',
      operation: 'project_save',
      projectId: result.id,
      userId: user.id,
    });

    revalidatePath('/dashboard');
    revalidatePath(`/editor/${result.id}`);

    return result;
  } catch (error) {
    logError({
      event: 'project_save_failure',
      surface: 'persistence',
      route: '/editor/[projectId]',
      operation: 'project_save',
      projectId: id,
      userId: user.id,
      ...getErrorSummary(error),
    });
    throw error;
  }
}
