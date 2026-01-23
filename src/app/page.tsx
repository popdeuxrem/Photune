import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';
import { Sparkles, Zap, Shield, Wand2 } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <span className="text-xl font-black tracking-tighter">phoTextAI</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/auth" className="text-sm font-medium hover:text-zinc-500 transition-colors">Sign In</Link>
          <Button asChild className="bg-zinc-900 text-white rounded-full px-6">
            <Link href="/editor/new">Try for Free</Link>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="px-6 pt-20 pb-32 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-xs font-bold text-zinc-600 mb-6">
            <Sparkles size={12} className="text-amber-500" />
            POWERED BY HYBRID EDGE AI
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tight text-zinc-900 mb-8 leading-[0.9]">
            Edit text in <span className="text-zinc-400 italic">any</span> image.
          </h1>
          <p className="text-xl text-zinc-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Upload any photo, and our AI instantly turns static text into editable layers. 
            Magic erase backgrounds and rewrite content in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="h-14 px-10 text-lg rounded-full bg-zinc-900 hover:bg-zinc-800">
              <Link href="/editor/new">Start Designing Now</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-14 px-10 text-lg rounded-full border-2">
              <Link href="/dashboard">View Projects</Link>
            </Button>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="bg-zinc-50 py-24 border-t border-zinc-100">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white shadow-sm rounded-2xl flex items-center justify-center mb-6 border border-zinc-100">
                <Wand2 className="text-blue-500" />
              </div>
              <h3 className="font-bold text-lg mb-2">Instant OCR</h3>
              <p className="text-zinc-500 text-sm">Convert flat images into editable text blocks with 99% accuracy using WASM-optimized Tesseract.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white shadow-sm rounded-2xl flex items-center justify-center mb-6 border border-zinc-100">
                <Zap className="text-amber-500" />
              </div>
              <h3 className="font-bold text-lg mb-2">AI Magic Erase</h3>
              <p className="text-zinc-500 text-sm">Remove original text or watermarks from backgrounds seamlessly using Cloudflare Generative AI.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white shadow-sm rounded-2xl flex items-center justify-center mb-6 border border-zinc-100">
                <Shield className="text-emerald-500" />
              </div>
              <h3 className="font-bold text-lg mb-2">Secure & Free</h3>
              <p className="text-zinc-500 text-sm">Your data is yours. Open-source, self-hostable, and runs on free-tier cloud resources.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
