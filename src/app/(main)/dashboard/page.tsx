'use client';
import { getErrorSummary, logError, logInfo } from '@/shared/lib/logging/logger';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/components/ui/button';
import { ProjectCard } from '@/features/dashboard/components/ProjectCard';
import { getUserProjects, deleteProject } from '@/features/dashboard/lib/actions';
import { Plus, Sparkles } from 'lucide-react';
import { createClient } from '@/shared/lib/supabase/client';

interface Project {
  id: string;
  name: string;
  original_image_url: string | null;
  updated_at: string;
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const router = useRouter();
  const [supabase, setSupabase] = useState<any>(null);

  useEffect(() => {
    setSupabase(createClient());
  }, []);

  useEffect(() => {
    if (!supabase) return;
    const loadData = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          router.push('/login');
          return;
        }

        setUserEmail(session.user.email || '');

        logInfo({
          event: 'project_load_start',
          surface: 'persistence',
          route: '/dashboard',
          operation: 'project_list',
          userId: session.user.id,
        });

        const userProjects = await getUserProjects();

        setProjects(userProjects || []);

        logInfo({
          event: 'project_load_success',
          surface: 'persistence',
          route: '/dashboard',
          operation: 'project_list',
          userId: session.user.id,
          message: 'Dashboard projects loaded',
        });
      } catch (error) {
        logError({
          event: 'project_load_failure',
          surface: 'persistence',
          route: '/dashboard',
          operation: 'project_list',
          ...getErrorSummary(error),
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [router, supabase]);

  const handleDelete = async (id: string) => {
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((project) => project.id !== id));
    } catch (error) {
      logError({
        event: 'project_delete_failure',
        surface: 'persistence',
        route: '/dashboard',
        operation: 'project_delete',
        projectId: id,
        ...getErrorSummary(error),
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-violet-50 dark:from-zinc-950 dark:to-zinc-900">
      <header className="sticky top-0 z-30 border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{userEmail}</p>
          </div>
          <Button asChild className="rounded-xl">
            <Link href="/editor/new">
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="text-zinc-500 dark:text-zinc-400">Loading projects...</div>
          </div>
        ) : projects.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-white/50 dark:bg-zinc-900/50 p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 dark:bg-violet-900/20">
              <Sparkles className="h-8 w-8 text-violet-600 dark:text-violet-400" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-zinc-900 dark:text-white">No projects yet</h2>
            <p className="mb-6 text-zinc-500 dark:text-zinc-400">
              Create your first Photune project to start editing.
            </p>
            <Button asChild size="lg" className="rounded-xl">
              <Link href="/editor/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Project
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
