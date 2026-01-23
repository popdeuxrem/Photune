import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 text-center">
      <h1 className="text-6xl font-black tracking-tighter mb-4">phoTextAI</h1>
      <p className="text-xl text-zinc-500 mb-8 max-w-md">Edit text in any image instantly with AI and OCR magic.</p>
      <div className="flex gap-4">
        <Button asChild size="lg"><Link href="/editor/new">Start Editing</Link></Button>
        <Button asChild variant="outline" size="lg"><Link href="/dashboard">My Projects</Link></Button>
      </div>
    </div>
  );
}
