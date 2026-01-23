'use client';

import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Trash2, Edit3, MoreHorizontal, Calendar } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/shared/components/ui/dropdown-menu';

export function ProjectCard({ project, onDelete }: { project: any; onDelete: (id: string) => void }) {
  const date = new Date(project.updated_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });

  return (
    <Card className="group overflow-hidden rounded-3xl border-none shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 bg-white">
      <div className="aspect-[4/3] bg-zinc-100 relative overflow-hidden">
        {project.original_image_url ? (
          <Image 
            src={project.original_image_url} 
            alt={project.name} 
            fill 
            className="object-cover transition-transform duration-500 group-hover:scale-110" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-300 italic text-xs">No Preview</div>
        )}
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-zinc-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button asChild size="sm" className="bg-white text-zinc-900 hover:bg-zinc-100 rounded-full font-bold px-6 shadow-xl">
            <Link href={`/editor/${project.id}`}><Edit3 className="w-4 h-4 mr-2" /> Open Studio</Link>
          </Button>
        </div>
      </div>

      <div className="p-5 flex items-center justify-between">
        <div className="min-w-0 flex-1 mr-4">
          <h3 className="font-bold text-zinc-900 truncate mb-1">{project.name}</h3>
          <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] font-bold uppercase tracking-wider">
            <Calendar size={12} />
            {date}
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full text-zinc-400 hover:bg-zinc-50">
              <MoreHorizontal size={18} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl p-2 w-48 shadow-2xl border-zinc-100">
            <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
              <Link href={`/editor/${project.id}`} className="flex items-center"><Edit3 size={14} className="mr-2" /> Edit Design</Link>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(project.id)} 
              className="text-red-500 focus:text-red-500 rounded-lg cursor-pointer"
            >
              <Trash2 size={14} className="mr-2" /> Delete Project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
}
