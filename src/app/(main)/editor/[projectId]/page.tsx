import { redirect } from 'next/navigation';

import { EditorClient } from '@/features/editor/components/EditorClient';
import {
  EDITOR_PROJECT_SELECT,
  coerceEditorProjectRecord,
  isAllowedEditorProjectId,
} from '@/features/editor/lib/project-types';
import { createClient } from '@/shared/lib/supabase/server';
import { getErrorSummary, logError, logInfo } from '@/shared/lib/logging/logger';

type EditorPageProps = {
  params: {
    projectId: string;
  };
};

export default async function EditorPage({ params }: EditorPageProps) {
  const projectId = params.projectId;

  if (!isAllowedEditorProjectId(projectId)) {
    redirect('/dashboard');
  }

  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect('/login');
  }

  let initialData = null;

  if (projectId !== 'new') {
    logInfo({
      event: 'project_load_start',
      surface: 'persistence',
      route: '/editor/[projectId]',
      operation: 'project_load',
      projectId,
      userId: user.id,
    });

    const { data, error } = await supabase
      .from('projects')
      .select(EDITOR_PROJECT_SELECT)
      .eq('id', projectId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (error || !data) {
      logError({
        event: 'project_load_failure',
        surface: 'persistence',
        route: '/editor/[projectId]',
        operation: 'project_load',
        projectId,
        userId: user.id,
        message: 'Project not found or not accessible',
        ...getErrorSummary(error ?? new Error('Project not found')),
      });
      redirect('/dashboard');
    }

    try {
      initialData = coerceEditorProjectRecord(data);
    } catch (coercionError) {
      logError({
        event: 'project_load_failure',
        surface: 'persistence',
        route: '/editor/[projectId]',
        operation: 'project_load',
        projectId,
        userId: user.id,
        message: 'Project payload failed contract validation',
        ...getErrorSummary(coercionError),
      });
      redirect('/dashboard');
    }

    logInfo({
      event: 'project_load_success',
      surface: 'persistence',
      route: '/editor/[projectId]',
      operation: 'project_load',
      projectId,
      userId: user.id,
    });
  }

  return <EditorClient projectId={projectId} initialProjectData={initialData} />;
}
