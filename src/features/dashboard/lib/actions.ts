'use server';

import { revalidatePath } from 'next/cache';

import { requireAuthenticatedUser } from '@/shared/lib/auth/require-authenticated-user';
import { isPersistedProjectId } from '@/shared/lib/persistence/project-guards';
import { getErrorSummary, logError, logInfo } from '@/shared/lib/logging/logger';

type DashboardProjectRow = {
  id: string;
  name: string;
  original_image_url: string | null;
  updated_at: string;
};

export async function getUserProjects(): Promise<DashboardProjectRow[]> {
  const { supabase, user } = await requireAuthenticatedUser();

  logInfo({
    event: 'project_list_start',
    surface: 'persistence',
    route: '/dashboard',
    operation: 'project_list',
    userId: user.id,
  });

  const { data, error } = await supabase
    .from('projects')
    .select('id, name, original_image_url, updated_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  if (error) {
    logError({
      event: 'project_list_failure',
      surface: 'persistence',
      route: '/dashboard',
      operation: 'project_list',
      userId: user.id,
      ...getErrorSummary(error),
    });
    throw new Error('Failed to load projects.');
  }

  logInfo({
    event: 'project_list_success',
    surface: 'persistence',
    route: '/dashboard',
    operation: 'project_list',
    userId: user.id,
    message: `Loaded ${Array.isArray(data) ? data.length : 0} projects`,
  });

  return Array.isArray(data) ? data : [];
}

export async function deleteProject(id: string) {
  if (!isPersistedProjectId(id)) {
    throw new Error('Invalid project id.');
  }

  const { supabase, user } = await requireAuthenticatedUser();

  logInfo({
    event: 'project_delete_start',
    surface: 'persistence',
    route: '/dashboard',
    operation: 'project_delete',
    projectId: id,
    userId: user.id,
  });

  const { data, error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)
    .select('id')
    .maybeSingle();

  if (error) {
    logError({
      event: 'project_delete_failure',
      surface: 'persistence',
      route: '/dashboard',
      operation: 'project_delete',
      projectId: id,
      userId: user.id,
      ...getErrorSummary(error),
    });
    throw new Error('Failed to delete project.');
  }

  if (!data) {
    throw new Error('Project not found.');
  }

  logInfo({
    event: 'project_delete_success',
    surface: 'persistence',
    route: '/dashboard',
    operation: 'project_delete',
    projectId: id,
    userId: user.id,
  });

  revalidatePath('/dashboard');

  return { success: true, id };
}
