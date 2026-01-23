'use client';

import { Card, CardContent, CardFooter } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Trash2, Edit } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export function ProjectCard({ project, onDelete }: { project: any; onDelete: (id: string) => void }) {
  return (
    <Card className="overflow-hidden group">
      <CardContent className="p-0 aspect-video bg-zinc-100 relative">
        {project.original_image_url && (
          <Image src={project.original_image_url} alt={project.name} fill className="object-cover" />
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button asChild size="sm" variant="secondary"><Link href={`/editor/${project.id}`}><Edit className="w-4 h-4 mr-1" /> Edit</Link></Button>
        </div>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center">
        <span className="font-medium truncate">{project.name}</span>
        <Button size="icon" variant="ghost" className="text-zinc-400 hover:text-red-500" onClick={() => onDelete(project.id)}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
