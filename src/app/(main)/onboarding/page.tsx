'use client';

import { Button } from '@/shared/components/ui/button';
import { useRouter } from 'next/navigation';
import { Wand2, Image as ImageIcon, Type } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[32px] shadow-2xl border border-zinc-100 p-10 text-center">
        <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl">
          <Wand2 className="text-white w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black tracking-tight mb-4 text-zinc-900">Welcome to Studio</h1>
        <p className="text-zinc-500 mb-8 leading-relaxed">
          phoTextAI uses hybrid intelligence to help you redesign static images. Ready to create your first project?
        </p>
        
        <div className="space-y-4 mb-10">
          <div className="flex items-center gap-4 text-left p-4 rounded-2xl bg-zinc-50">
            <ImageIcon className="text-zinc-400 shrink-0" />
            <div>
              <p className="text-sm font-bold">Upload an Image</p>
              <p className="text-xs text-zinc-500">Drag & drop any photo or document.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-left p-4 rounded-2xl bg-zinc-50">
            <Type className="text-zinc-400 shrink-0" />
            <div>
              <p className="text-sm font-bold">Edit Text Layers</p>
              <p className="text-xs text-zinc-500">Change fonts, colors, and content instantly.</p>
            </div>
          </div>
        </div>

        <Button onClick={() => router.push('/editor/new')} className="w-full h-12 rounded-full text-lg font-bold">
          Create My First Project
        </Button>
      </div>
    </div>
  );
}
