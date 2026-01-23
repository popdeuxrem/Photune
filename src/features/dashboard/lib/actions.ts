'use server';

import { createClient } from '@/shared/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getUserProjects() {
  const supabase = createClient();
  const { data } = await supabase.from('projects').select('*').order('updated_at', { ascending: false });
  return data || [];
}

export async function deleteProject(id: string) {
  const supabase = createClient();
  await supabase.from('projects').delete().eq('id', id);
  revalidatePath('/dashboard');
}
