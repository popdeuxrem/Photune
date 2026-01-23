'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';
import { ProjectCard } from '@/features/dashboard/components/ProjectCard';
import { getUserProjects, deleteProject } from '@/features/dashboard/lib/actions';
import { Plus, LayoutGrid, Search, Loader2 } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';

export default function DashboardPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserProjects().then((data) => {
      setProjects(data);
      setLoading(false);
    });
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Delete this project? This action cannot be undone.')) {
      await deleteProject(id);
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Dashboard Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <LayoutGrid size={20} className="text-zinc-400" />
            <h1 className="font-bold text-lg">Your Workspace</h1>
          </div>
          <Button asChild className="rounded-full bg-zinc-900 shadow-xl hover:shadow-2xl transition-all">
            <Link href="/editor/new"><Plus className="mr-1.5 h-4 w-4" /> New Design</Link>
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 md:p-10">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between mb-10">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
            <Input className="pl-10 bg-white border-zinc-200 rounded-xl h-11" placeholder="Search your projects..." />
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-500">
            {projects.length} Projects Total
          </div>
        </div>

        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-3">
            <Loader2 className="animate-spin text-zinc-300" size={32} />
            <p className="text-zinc-400 text-sm font-medium">Fetching your designs...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white border-2 border-dashed rounded-3xl p-20 text-center">
            <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plus className="text-zinc-300" size={32} />
            </div>
            <h2 className="text-xl font-bold mb-2">No projects yet</h2>
            <p className="text-zinc-500 mb-8 max-w-xs mx-auto">Create your first AI-powered design to get started.</p>
            <Button asChild size="lg" className="rounded-full"><Link href="/editor/new">Create Project</Link></Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {projects.map(project => (
              <ProjectCard key={project.id} project={project} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
