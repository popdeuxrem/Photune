'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/components/ui/button';
import { ProjectCard } from '@/features/dashboard/components/ProjectCard';
import { getUserProjects, deleteProject } from '@/features/dashboard/lib/actions';
import { createClient } from '@/shared/lib/supabase/client';
import { 
  Plus, 
  LayoutGrid, 
  Search, 
  Loader2,
  User,
  Settings,
  CreditCard,
  LogOut,
  Sparkles,
  Crown
} from 'lucide-react';
import { Input } from '@/shared/components/ui/input';

export default function DashboardPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Get user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Get projects
    getUserProjects().then((data) => {
      setProjects(data || []);
      setLoading(false);
    });
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Delete this project? This action cannot be undone.')) {
      await deleteProject(id);
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const filteredProjects = projects.filter(p => 
    p.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Top Navigation */}
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">P</span>
              </div>
              <span className="text-xl font-black tracking-tight">Photune</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {/* Upgrade Button */}
            <Button variant="outline" size="sm" className="hidden sm:flex rounded-full border-amber-200 text-amber-600 hover:bg-amber-50">
              <Crown className="w-4 h-4 mr-1" />
              Upgrade
            </Button>

            {/* User Menu */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-zinc-900 dark:bg-white rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white dark:text-zinc-900" />
              </div>
              <button onClick={handleSignOut} className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 sm:p-8">
        {/* Welcome & Actions */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-black mb-1">
              {user ? `Welcome, ${user.email?.split('@')[0]}` : 'Your Projects'}
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400">
              {projects.length} project{projects.length !== 1 ? 's' : ''} • {user ? 'Free tier' : ''}
            </p>
          </div>
          <Button asChild className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg">
            <Link href="/editor/new"><Plus className="mr-1.5 h-4 w-4" /> New Design</Link>
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
          <Input 
            className="pl-10 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl h-11" 
            placeholder="Search your projects..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-3">
            <Loader2 className="animate-spin text-zinc-300" size={32} />
            <p className="text-zinc-400 text-sm font-medium">Loading your designs...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl p-20 text-center">
            <div className="w-20 h-20 bg-zinc-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="text-zinc-300" size={32} />
            </div>
            <h2 className="text-xl font-bold mb-2">
              {searchQuery ? 'No matching projects' : 'No projects yet'}
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 mb-8 max-w-xs mx-auto">
              {searchQuery 
                ? 'Try a different search term'
                : 'Create your first AI-powered design to get started.'
              }
            </p>
            {!searchQuery && (
              <Button asChild size="lg" className="rounded-full">
                <Link href="/editor/new">Create Project</Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProjects.map(project => (
              <ProjectCard key={project.id} project={project} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
