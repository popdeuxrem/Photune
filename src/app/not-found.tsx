import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="relative mb-8">
          <h1 className="text-[120px] font-black text-zinc-200 dark:text-zinc-800 leading-none">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-zinc-900 dark:bg-white rounded-full flex items-center justify-center">
              <Home className="w-10 h-10 text-white dark:text-zinc-900" />
            </div>
          </div>
        </div>
        
        <h2 className="text-2xl font-black mb-3">Page not found</h2>
        <p className="text-zinc-500 dark:text-zinc-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="rounded-full">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Link>
          </Button>
          <Button variant="outline" asChild className="rounded-full">
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
