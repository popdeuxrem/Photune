'use server';

import { createClient } from '@/shared/lib/supabase/server';
import { revalidatePath } from 'next/cache';

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
