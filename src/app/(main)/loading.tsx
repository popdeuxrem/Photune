'use client';

import { Loader2 } from 'lucide-react';

export default function LoadingPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-10 h-10 animate-spin text-zinc-400 mx-auto mb-4" />
        <p className="text-zinc-500 dark:text-zinc-400 font-medium">Loading...</p>
      </div>
    </div>
  );
}
