import type { User } from '@supabase/supabase-js';
import { createClient } from '@/shared/lib/supabase/server';

export type AuthenticatedServerContext = {
  supabase: ReturnType<typeof createClient>;
  user: User;
};

export async function requireAuthenticatedUser(): Promise<AuthenticatedServerContext> {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error('Unauthorized');
  }

  return { supabase, user };
}
