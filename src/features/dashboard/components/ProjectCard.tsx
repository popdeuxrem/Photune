'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Trash2, Edit3, MoreHorizontal, Calendar, Image as ImageIcon } from 'lucide-react';

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

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export function ProjectCard({
  project,
  onDelete,
  variant = 'grid',
}: ProjectCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  const preview = project.original_image_url;
  const showPreview = Boolean(preview) && !imageFailed;

  useEffect(() => {
    setImageFailed(false);
  }, [preview]);

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

  if (variant === 'list') {
    return (
      <div className="group rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm transition hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
        <div className="flex items-center gap-4">
          <Link
            href={`/editor/${project.id}`}
            className="flex min-w-0 flex-1 items-center gap-4"
          >
            <div className="relative flex h-20 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950">
              {showPreview ? (
                // eslint-disable-next-line @next/next/no-img-element -- dashboard previews may be data URLs or mixed remote sources; current card preview flow intentionally uses raw img
                <img
                  src={preview!}
                  alt={project.name}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                  onError={() => setImageFailed(true)}
                />
              ) : (
                <ImageIcon className="h-6 w-6 text-zinc-400" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="truncate text-base font-semibold text-zinc-950 dark:text-zinc-50">
                {project.name}
              </div>
              <div className="mt-1 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                <Calendar className="h-3.5 w-3.5" />
                <span>Updated {formatUpdatedAt(project.updated_at)}</span>
              </div>
            </div>
          </Link>

          <ProjectActions
            project={project}
            onDelete={handleDelete}
            isDeleting={isDeleting}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="group overflow-hidden rounded-[1.75rem] border border-zinc-200 bg-white p-2 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.12)] dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
      <div className="overflow-hidden rounded-[1.25rem] border border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
        <Link href={`/editor/${project.id}`} className="block">
          <div className="relative aspect-[4/5] overflow-hidden">
            {showPreview ? (
              // eslint-disable-next-line @next/next/no-img-element -- dashboard previews may be data URLs or mixed remote sources; current card preview flow intentionally uses raw img
              <img
                src={preview!}
                alt={project.name}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                onError={() => setImageFailed(true)}
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-zinc-400">
                <ImageIcon className="h-10 w-10" />
                <span className="text-xs font-medium">No preview available</span>
              </div>
            )}

            <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/10" />

            <div className="absolute inset-x-0 bottom-4 flex justify-center opacity-0 transition duration-300 group-hover:opacity-100">
              <div className="rounded-full bg-white/95 px-4 py-2 text-sm font-medium text-zinc-950 shadow-lg backdrop-blur">
                Open project
              </div>
            </div>
          </div>
        </Link>
      </div>

      <div className="flex items-start justify-between gap-4 px-4 pb-3 pt-4">
        <div className="min-w-0">
          <Link
            href={`/editor/${project.id}`}
            className="block truncate text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-50"
          >
            {project.name}
          </Link>
          <div className="mt-1 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
            <Calendar className="h-3.5 w-3.5" />
            <span>Updated {formatUpdatedAt(project.updated_at)}</span>
          </div>
        </div>

        <ProjectActions
          project={project}
          onDelete={handleDelete}
          isDeleting={isDeleting}
        />
      </div>
    </div>
  );
}

type ProjectActionsProps = {
  project: Project;
  onDelete: () => void | Promise<void>;
  isDeleting: boolean;
};

function ProjectActions({
  project,
  onDelete,
  isDeleting,
}: ProjectActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
          aria-label={`Actions for ${project.name}`}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-48 rounded-xl border-zinc-200 dark:border-zinc-800"
      >
        <DropdownMenuItem asChild>
          <Link href={`/editor/${project.id}`} className="flex items-center">
            <Edit3 className="mr-2 h-4 w-4" />
            Open project
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={onDelete}
          disabled={isDeleting}
          className="text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {isDeleting ? 'Deleting...' : 'Delete project'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}