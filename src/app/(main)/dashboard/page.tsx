'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';
import { ProjectCard } from '@/features/dashboard/components/ProjectCard';
import { getUserProjects, deleteProject } from '@/features/dashboard/lib/actions';
import { Plus } from 'lucide-react';

export default function DashboardPage() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    getUserProjects().then(setProjects);
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Delete project?')) {
      await deleteProject(id);
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Projects</h1>
        <Button asChild><Link href="/editor/new"><Plus className="mr-2 h-4 w-4" /> New Project</Link></Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}
