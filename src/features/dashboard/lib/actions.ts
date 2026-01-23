'use server';

import { createClient } from '@/shared/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getUserProjects() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  return data || [];
}

export async function saveProject(id: string, name: string, canvasData: any, imageUrl: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const payload = {
    name,
    user_id: user.id,
    canvas_data: canvasData,
    original_image_url: imageUrl,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = id === 'new' 
    ? await supabase.from('projects').insert([payload]).select().single()
    : await supabase.from('projects').update(payload).eq('id', id).select().single();

  if (error) throw error;
  revalidatePath('/dashboard');
  return data;
}

export async function deleteProject(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) return { success: false, message: error.message };
  revalidatePath('/dashboard');
  return { success: true };
}
