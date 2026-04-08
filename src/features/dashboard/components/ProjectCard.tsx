'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Trash2, Edit3, MoreHorizontal, Calendar, ExternalLink, LayoutGrid, Image as ImageIcon } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/shared/components/ui/dropdown-menu';

type Project = {
  id: string;
  name: string;
  original_image_url: string | null;
  updated_at: string;
};

type ProjectCardProps = {
  project: Project;
  onDelete: (id: string) => void | Promise<void>;
  variant?: 'grid' | 'list';
};

function formatUpdatedAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Unknown update time';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function ProjectCard({ project, onDelete, variant = 'grid' }: ProjectCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (isDeleting) return;
    const confirmed = window.confirm(`Delete "${project.name}"?`);
    if (!confirmed) return;

    try {
      setIsDeleting(true);
      await onDelete(project.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const preview = project.original_image_url;

  if (variant === 'list') {
    return (
      <div className="group flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
        <Link
          href={`/editor/${project.id}`}
          className="flex min-w-0 flex-1 items-center gap-4"
        >
          <div className="relative flex h-20 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950">
            {preview ? (
              <img
                src={preview}
                alt={project.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <ImageIcon className="h-6 w-6 text-zinc-400" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="truncate text-base font-semibold text-zinc-950 dark:text-zinc-50">
              {project.name}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400">
              <Calendar size={14} className="text-zinc-300" />
              Updated {formatUpdatedAt(project.updated_at)}
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-zinc-600 dark:text-zinc-400"
          >
            <Link href={`/editor/${project.id}`}>
              <Edit3 className="mr-2 h-4 w-4" />
              Open
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                <MoreHorizontal size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-2xl p-2 w-48 shadow-xl border-zinc-100 dark:border-zinc-800">
              <DropdownMenuItem asChild className="rounded-xl cursor-pointer py-2.5">
                <Link href={`/editor/${project.id}`} className="flex items-center font-medium">
                  <Edit3 size={16} className="mr-3 text-zinc-500" /> Resume Editing
                </Link>
              </DropdownMenuItem>
              {preview && (
                <DropdownMenuItem
                  className="rounded-xl cursor-pointer py-2.5"
                  onClick={() => window.open(preview, '_blank')}
                >
                  <ExternalLink size={16} className="mr-3 text-zinc-500" /> View Original
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800" />
              <DropdownMenuItem
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-red-500 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950 rounded-xl cursor-pointer py-2.5 font-medium"
              >
                <Trash2 size={16} className="mr-3" />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative overflow-hidden rounded-[32px] border-none bg-white shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500">
      <div className="aspect-[5/4] bg-zinc-100 relative overflow-hidden">
        {preview ? (
          <img
            src={preview}
            alt={project.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
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
            {formatUpdatedAt(project.updated_at)}
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
            {preview && (
              <DropdownMenuItem className="rounded-xl cursor-pointer py-3 font-semibold" onClick={() => window.open(preview, '_blank')}>
                <ExternalLink size={16} className="mr-3 text-zinc-400" /> View Original
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator className="bg-zinc-50" />
            <DropdownMenuItem
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-red-500 focus:text-red-600 focus:bg-red-50 rounded-xl cursor-pointer py-3 font-bold"
            >
              <Trash2 size={16} className="mr-3" />
              {isDeleting ? 'Deleting...' : 'Delete Permanently'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}