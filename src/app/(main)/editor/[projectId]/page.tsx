import { redirect } from 'next/navigation';
import { getErrorSummary, logError, logInfo } from '@/shared/lib/logging/logger';
import { EditorClient } from '@/features/editor/components/EditorClient';
import { createClient } from '@/shared/lib/supabase/server';

export default async function EditorPage({ params }: { params: { projectId: string } }) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  let initialData = null;

  if (params.projectId !== 'new') {
    logInfo({
      event: 'project_load_start',
      surface: 'persistence',
      route: '/editor/[projectId]',
      operation: 'project_load',
      projectId: params.projectId,
      userId: user.id,
    });

    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('id', params.projectId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (!data) {
      logError({
        event: 'project_load_failure',
        surface: 'persistence',
        route: '/editor/[projectId]',
        operation: 'project_load',
        projectId: params.projectId,
        userId: user.id,
        message: 'Project not found or not accessible',
      });
      redirect('/dashboard');
    }

    logInfo({
      event: 'project_load_success',
      surface: 'persistence',
      route: '/editor/[projectId]',
      operation: 'project_load',
      projectId: params.projectId,
      userId: user.id,
    });
    initialData = data;
  }

  return <EditorClient projectId={params.projectId} initialProjectData={initialData} />;
}
