'use server';

import { createClient } from '@/shared/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { getErrorSummary, logError, logInfo } from '@/shared/lib/logging/logger';

export async function saveProject(id: string, name: string, canvasData: any, imageUrl: string) {
  logInfo({
    event: 'project_save_start',
    surface: 'persistence',
    route: '/editor/[projectId]',
    operation: 'project_save',
    projectId: id,
  });

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    logError({
      event: 'project_save_failure',
      surface: 'persistence',
      route: '/editor/[projectId]',
      operation: 'project_save',
      projectId: id,
      message: 'Unauthorized',
    });
    throw new Error("Unauthorized");
  }

  const payload = {
    name,
    user_id: user.id,
    canvas_data: canvasData,
    original_image_url: imageUrl,
    updated_at: new Date().toISOString(),
  };

  try {
    const { data, error } = id === 'new' 
      ? await supabase.from('projects').insert([payload]).select().single()
      : await supabase.from('projects').update(payload).eq('id', id).select().single();

    if (error) throw error;

    logInfo({
      event: 'project_save_success',
      surface: 'persistence',
      route: '/editor/[projectId]',
      operation: 'project_save',
      projectId: data?.id || id,
    });

    revalidatePath('/dashboard');
    return data;
  } catch (error) {
    logError({
      event: 'project_save_failure',
      surface: 'persistence',
      route: '/editor/[projectId]',
      operation: 'project_save',
      projectId: id,
      ...getErrorSummary(error),
    });
    throw error;
  }
}
