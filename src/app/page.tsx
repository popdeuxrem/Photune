import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';
import { Sparkles, Wand2, Shield, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-zinc-900 selection:bg-zinc-900 selection:text-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-zinc-100 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">P</span>
            </div>
            <span className="text-xl font-black tracking-tighter">phoTextAI</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">Features</Link>
            <Link href="/dashboard" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">My Projects</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-bold px-4 py-2 hover:bg-zinc-50 rounded-full transition-colors">Sign In</Link>
            <Button asChild className="rounded-full bg-zinc-900 hover:bg-zinc-800 px-6 shadow-lg shadow-zinc-200">
              <Link href="/signup">Get Started Free</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="pt-32">
        <section className="px-6 pb-20 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-8 animate-in fade-in slide-in-from-bottom-2">
            <Sparkles size={12} className="text-amber-500" />
            Hybrid Edge AI Technology
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[0.9]">
            The end of <span className="text-zinc-400">static images.</span>
          </h1>
          <p className="text-xl text-zinc-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Instantly turn any flat image into editable layers. Extract text with high-precision OCR, 
            magic-erase backgrounds, and redesign everything in your browser.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="h-14 px-10 text-lg rounded-full bg-zinc-900 shadow-2xl hover:scale-105 transition-transform">
              <Link href="/editor/new">Start Editing Now <ArrowRight className="ml-2 w-5 h-5" /></Link>
            </Button>
            <p className="text-sm font-bold text-zinc-400">No credit card required.</p>
          </div>
        </section>

        {/* Dynamic Feature Display */}
        <section id="features" className="py-24 border-t border-zinc-100 bg-zinc-50/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-100">
                  <Wand2 size={24} />
                </div>
                <h3 className="text-xl font-bold">Pro-Level OCR</h3>
                <p className="text-zinc-500 leading-relaxed">Advanced canvas preprocessing extracts text from even the messiest backgrounds with bounding-box accuracy.</p>
                <ul className="space-y-2 pt-2">
                  {['Auto-thresholding', 'Font detection', 'Layer mapping'].map((t) => (
                    <li key={t} className="flex items-center gap-2 text-sm font-bold text-zinc-700">
                      <CheckCircle2 size={14} className="text-emerald-500" /> {t}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-amber-100">
                  <Zap size={24} />
                </div>
                <h3 className="text-xl font-bold">Magic Inpainting</h3>
                <p className="text-zinc-500 leading-relaxed">Erase original text or watermarks from your images using Cloudflare&apos;s generative AI models in one click.</p>
                <ul className="space-y-2 pt-2">
                  {['Text removal', 'Object cleanup', 'Background fill'].map((t) => (
                    <li key={t} className="flex items-center gap-2 text-sm font-bold text-zinc-700">
                      <CheckCircle2 size={14} className="text-emerald-500" /> {t}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-zinc-200">
                  <Shield size={24} />
                </div>
                <h3 className="text-xl font-bold">Studio Export</h3>
                <p className="text-zinc-500 leading-relaxed">Download your creations in high-resolution PNG, PDF, or SVG. Perfect for professional branding and social media.</p>
                <ul className="space-y-2 pt-2">
                  {['4K Resolution', 'Vector SVG', 'Multi-page PDF'].map((t) => (
                    <li key={t} className="flex items-center gap-2 text-sm font-bold text-zinc-700">
                      <CheckCircle2 size={14} className="text-emerald-500" /> {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 px-6 border-t border-zinc-100 text-center text-zinc-400 text-sm font-medium">
        © {new Date().getFullYear()} phoTextAI. Built for designers. Powered by Open Source.
      </footer>
    </div>
  );
}
