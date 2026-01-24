'use client';

import { Button } from '@/shared/components/ui/button';
import { Plus, FolderOpen, SearchX } from 'lucide-react';
import Link from 'next/link';

export function EmptyState({ isSearch = false }: { isSearch?: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 bg-white border border-zinc-100 rounded-[40px] text-center shadow-sm">
      <div className="w-20 h-20 bg-zinc-50 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
        {isSearch ? (
          <SearchX className="text-zinc-300 w-10 h-10" />
        ) : (
          <FolderOpen className="text-zinc-300 w-10 h-10" />
        )}
      </div>
      
      <h2 className="text-2xl font-black text-zinc-900 mb-2">
        {isSearch ? "No results found" : "Your studio is empty"}
      </h2>
      <p className="text-zinc-500 mb-10 max-w-sm mx-auto leading-relaxed">
        {isSearch 
          ? "We couldn't find any projects matching your search terms. Try a different name."
          : "Start by uploading an image or creating a new design from scratch with our AI tools."}
      </p>

      {!isSearch && (
        <Button asChild size="lg" className="rounded-full px-10 h-12 font-bold">
          <Link href="/editor/new">
            <Plus className="mr-2 h-5 w-5" /> Create First Project
          </Link>
        </Button>
      )}
    </div>
  );
}
