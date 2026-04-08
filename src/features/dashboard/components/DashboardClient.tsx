'use client';

import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import Link from 'next/link';
import { Plus, Search, Grid3X3, List } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { useToast } from '@/shared/components/ui/use-toast';

import { ProjectCard } from './ProjectCard';
import { EmptyState } from './EmptyState';
import { getUserProjects, deleteProject } from '@/features/dashboard/lib/actions';
import { useDashboardControls } from '@/features/dashboard/hooks/useDashboardControls';
import {
  normalizeProjects,
  type DashboardProject,
} from '@/features/dashboard/lib/normalize-projects';

type DashboardClientProps = {
  userEmail?: string;
};

export function DashboardClient({ userEmail = '' }: DashboardClientProps) {
  const [projects, setProjects] = useState<DashboardProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { toast } = useToast();
  const { viewMode, setViewMode, searchQuery, setSearchQuery, sortMode, setSortMode } =
    useDashboardControls();

  const fetchProjectsRef = useRef(async () => {
    setIsLoading(true);

    try {
      const data = await getUserProjects();
      setProjects(normalizeProjects(data));
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      toast({
        title: 'Failed to load projects',
        description: 'Please refresh and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  });

  useEffect(() => {
    fetchProjectsRef.current();
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      const previousProjects = projects;

      setProjects((current) => current.filter((project) => project.id !== id));

      try {
        await deleteProject(id);
        toast({
          title: 'Project deleted',
          description: 'The project was removed successfully.',
        });
      } catch (error) {
        console.error('Failed to delete project:', error);
        setProjects(previousProjects);
        toast({
          title: 'Delete failed',
          description: 'The project could not be removed. Changes were rolled back.',
          variant: 'destructive',
        });
      }
    },
    [projects, toast]
  );

  const visibleProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = !query
      ? projects
      : projects.filter((project) => project.name.toLowerCase().includes(query));

    const sorted = [...filtered].sort((a, b) => {
      if (sortMode === 'name_asc') {
        return a.name.localeCompare(b.name);
      }

      const aTime = new Date(a.updated_at).getTime();
      const bTime = new Date(b.updated_at).getTime();

      if (sortMode === 'updated_asc') {
        return aTime - bTime;
      }

      return bTime - aTime;
    });

    return sorted;
  }, [projects, searchQuery, sortMode]);

  if (isLoading) {
    return <DashboardLoadingSkeleton />;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            Your Designs
          </h1>
          <p className="text-zinc-500 text-sm font-medium dark:text-zinc-400">
            {userEmail || 'Manage and edit your AI-powered projects.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setViewMode((current) => (current === 'grid' ? 'list' : 'grid'))}
            aria-label={viewMode === 'grid' ? 'Switch to list view' : 'Switch to grid view'}
            className="hidden md:inline-flex"
          >
            {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
          </Button>
          <Button
            asChild
            size="lg"
            className="rounded-full bg-zinc-900 hover:bg-zinc-800 shadow-xl shadow-zinc-200 dark:shadow-none h-12 px-8 dark:bg-zinc-100 dark:hover:bg-zinc-200"
          >
            <Link href="/editor/new">
              <Plus className="mr-2 h-5 w-5" /> New Project
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-zinc-900 p-2 rounded-[20px] border border-zinc-100 dark:border-zinc-800 shadow-sm">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by project name..."
            className="pl-12 h-12 border-none bg-transparent focus-visible:ring-0 text-base dark:bg-zinc-900 dark:text-zinc-100"
          />
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <select
            value={sortMode}
            onChange={(event) =>
              setSortMode(event.target.value as 'updated_desc' | 'updated_asc' | 'name_asc')
            }
            className="h-10 rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300"
            aria-label="Sort projects"
          >
            <option value="updated_desc">Newest first</option>
            <option value="updated_asc">Oldest first</option>
            <option value="name_asc">Name A–Z</option>
          </select>

          <span className="text-sm font-bold text-zinc-500 uppercase tracking-widest dark:text-zinc-400">
            {visibleProjects.length} Projects
          </span>
        </div>
      </div>

      {visibleProjects.length > 0 ? (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'
              : 'grid grid-cols-1 gap-4'
          }
        >
          {visibleProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDelete={handleDelete}
              variant={viewMode}
            />
          ))}
        </div>
      ) : (
        <EmptyState isSearch={searchQuery.trim().length > 0} />
      )}
    </div>
  );
}

function DashboardLoadingSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="h-10 w-48 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
          <div className="h-4 w-64 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
        </div>
        <div className="h-12 w-36 bg-zinc-200 dark:bg-zinc-800 rounded-full animate-pulse" />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-zinc-900 p-2 rounded-[20px] border border-zinc-100 dark:border-zinc-800">
        <div className="h-12 w-full sm:max-w-md bg-zinc-200 dark:bg-zinc-800 rounded-xl animate-pulse" />
        <div className="h-6 w-32 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="space-y-3">
            <div className="aspect-[5/4] bg-zinc-200 dark:bg-zinc-800 rounded-2xl animate-pulse" />
            <div className="h-4 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
            <div className="h-3 w-1/2 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
