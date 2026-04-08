import { redirect } from 'next/navigation';

import { DashboardClient } from '@/features/dashboard/components/DashboardClient';
import { createClient } from '@/shared/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return <DashboardClient userEmail={user.email ?? ''} />;
}
