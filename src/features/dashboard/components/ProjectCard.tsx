'use client';

import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Trash2, Edit3, MoreHorizontal, Calendar, ExternalLink, LayoutGrid } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/shared/components/ui/dropdown-menu';

export function ProjectCard({ project, onDelete }: { project: any; onDelete: (id: string) => void }) {
  const date = new Date(project.updated_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <Card className="group relative overflow-hidden rounded-[32px] border-none bg-white shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500">
      <div className="aspect-[5/4] bg-zinc-100 relative overflow-hidden">
        {project.original_image_url ? (
          <Image 
            src={project.original_image_url} 
            alt={project.name} 
            fill 
            className="object-cover transition-transform duration-700 group-hover:scale-110" 
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-zinc-300 gap-2">
            <LayoutGrid size={32} strokeWidth={1} />
            <span className="text-[10px] font-black uppercase tracking-widest">No Preview</span>
          </div>
        )}
        
        <div className="absolute inset-0 bg-zinc-900/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-3 backdrop-blur-[2px]">
          <Button asChild className="bg-white text-zinc-900 hover:bg-zinc-100 rounded-full font-bold px-6 shadow-2xl scale-90 group-hover:scale-100 transition-transform duration-300">
            <Link href={`/editor/${project.id}`}>
              <Edit3 className="w-4 h-4 mr-2" /> Open in Studio
            </Link>
          </Button>
        </div>
      </div>

      <div className="p-5 flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-zinc-900 truncate leading-tight mb-1 group-hover:text-blue-600 transition-colors">
            {project.name}
          </h3>
          <div className="flex items-center gap-1.5 text-zinc-400 text-[10px] font-black uppercase tracking-tighter">
            <Calendar size={12} className="text-zinc-300" />
            {date}
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full text-zinc-400 hover:bg-zinc-50 hover:text-zinc-900 transition-colors">
              <MoreHorizontal size={20} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-2xl p-2 w-56 shadow-2xl border-zinc-100 animate-in zoom-in-95">
            <DropdownMenuItem asChild className="rounded-xl cursor-pointer py-3">
              <Link href={`/editor/${project.id}`} className="flex items-center font-semibold">
                <Edit3 size={16} className="mr-3 text-zinc-400" /> Resume Editing
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-xl cursor-pointer py-3 font-semibold" onClick={() => window.open(project.original_image_url, '_blank')}>
              <ExternalLink size={16} className="mr-3 text-zinc-400" /> View Original
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-zinc-50" />
            <DropdownMenuItem 
              onClick={() => onDelete(project.id)} 
              className="text-red-500 focus:text-red-600 focus:bg-red-50 rounded-xl cursor-pointer py-3 font-bold"
            >
              <Trash2 size={16} className="mr-3" /> Delete Permanently
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
}
