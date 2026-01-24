'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { useToast } from '@/shared/components/ui/use-toast';
import { ProjectCard } from './ProjectCard';
import { EmptyState } from './EmptyState';
import { getUserProjects, deleteProject } from '@/features/dashboard/lib/actions';
import { Plus, Search, Loader2, SlidersHorizontal } from 'lucide-react';

type Project = { id: string; name: string; original_image_url: string; updated_at: string };

export function DashboardClient() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const fetchProjects = useCallback(async () => {
    try {
      const data = await getUserProjects();
      setProjects(data as Project[]);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load projects", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleDelete = async (id: string) => {
    try {
      await deleteProject(id);
      setProjects(prev => prev.filter(p => p.id !== id));
      toast({ title: "Project Deleted" });
    } catch (error) {
      toast({ title: "Error", description: "Could not delete project", variant: "destructive" });
    }
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-zinc-300" />
        <p className="text-zinc-500 font-medium animate-pulse">Opening your workspace...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-zinc-900">Your Designs</h1>
          <p className="text-zinc-500 text-sm font-medium">Manage and edit your AI-powered projects.</p>
        </div>
        <Button asChild size="lg" className="rounded-full bg-zinc-900 hover:bg-zinc-800 shadow-xl shadow-zinc-200 h-12 px-8">
          <Link href="/editor/new">
            <Plus className="mr-2 h-5 w-5" /> New Project
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-2 rounded-[20px] border border-zinc-100 shadow-sm">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by project name..." 
            className="pl-12 h-12 border-none bg-transparent focus-visible:ring-0 text-base"
          />
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 border-l border-zinc-100">
           <SlidersHorizontal size={16} className="text-zinc-400" />
           <span className="text-sm font-bold text-zinc-500 uppercase tracking-widest">{filteredProjects.length} Projects</span>
        </div>
      </div>

      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-in fade-in duration-500">
          {filteredProjects.map(p => (
            <ProjectCard key={p.id} project={p} onDelete={handleDelete} />
          ))}
        </div>
      ) : (
        <EmptyState isSearch={searchQuery.length > 0} />
      )}
    </div>
  );
}
