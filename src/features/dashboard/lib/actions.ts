'use server';

import { createClient } from '@/shared/lib/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * Fetches all projects belonging to the currently authenticated user.
 * Ordered by most recently updated.
 */
export async function getUserProjects() {
  const supabase = createClient();
  
  // 1. Verify Authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    console.error("Auth error in getUserProjects:", authError);
    return [];
  }

  // 2. Fetch User-Specific Projects
  const { data, error } = await supabase
    .from('projects')
    .select('id, name, original_image_url, updated_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error("Database error in getUserProjects:", error.message);
    return [];
  }

  return data || [];
}

/**
 * Deletes a specific project.
 * Security: Supabase RLS ensures users can only delete their own rows,
 * but we verify the user ID here for an extra layer of protection.
 */
export async function deleteProject(id: string) {
  const supabase = createClient();
  
  // 1. Verify Authentication
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized: Please sign in to delete projects.");

  // 2. Perform Deletion (RLS handles the ownership check)
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id); // Double-verify ownership

  if (error) {
    console.error("Delete error:", error.message);
    throw new Error("Failed to delete project.");
  }

  // 3. Purge Next.js Cache for the Dashboard
  revalidatePath('/dashboard');
  
  return { success: true };
}
