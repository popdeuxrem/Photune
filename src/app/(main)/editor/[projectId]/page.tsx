import { EditorClient } from '@/features/editor/components/EditorClient';
import { createClient } from '@/shared/lib/supabase/server';

export default async function EditorPage({ params }: { params: { projectId: string } }) {
  const supabase = createClient();
  let initialData = null;

  if (params.projectId !== 'new') {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('id', params.projectId)
      .single();
    initialData = data;
  }

  return <EditorClient projectId={params.projectId} initialProjectData={initialData} />;
}
