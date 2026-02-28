import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';
import { 
  Sparkles, 
  Wand2, 
  Shield, 
  Zap, 
  ArrowRight, 
  CheckCircle2,
  Palette,
  Layers,
  Download,
  CreditCard,
  Bitcoin,
  Headphones,
  Clock,
  Users,
  Star
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-zinc-900 selection:text-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-zinc-100 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">P</span>
            </div>
            <span className="text-xl font-black tracking-tighter">Photune</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Features</Link>
            <Link href="#pricing" className="text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Pricing</Link>
            <Link href="/dashboard" className="text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Dashboard</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-bold px-4 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-full transition-colors">Sign In</Link>
            <Button asChild className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 px-6 shadow-lg shadow-amber-200 dark:shadow-amber-900/30">
              <Link href="/signup">Get Started Free</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="pt-32">
        <section className="px-6 pb-24 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-8 animate-in fade-in slide-in-from-bottom-2">
            <Sparkles size={12} />
            Now with Groq AI - 10x Faster
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[0.9]">
            Edit text in <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">any image.</span>
          </h1>
          <p className="text-xl text-zinc-500 dark:text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            AI-powered text extraction, magic erase, and font matching. 
            Turn static images into editable designs in seconds. Free to start.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="h-14 px-10 text-lg rounded-full bg-zinc-900 dark:bg-white dark:text-zinc-900 shadow-2xl hover:scale-105 transition-transform">
              <Link href="/editor/new">Start Editing Free <ArrowRight className="ml-2 w-5 h-5" /></Link>
            </Button>
            <p className="text-sm font-bold text-zinc-400">No credit card required • 5 free credits</p>
          </div>

          {/* Demo Preview */}
          <div className="mt-16 relative">
            <div className="relative mx-auto max-w-4xl rounded-2xl overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800">
              <div className="aspect-[16/9] bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center">
                    <Wand2 className="w-12 h-12 text-white" />
                  </div>
                  <p className="text-zinc-500 dark:text-zinc-400 font-medium">Interactive Editor Preview</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-24 border-y border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black mb-4">Everything you need</h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-lg max-w-2xl mx-auto">
                Professional image editing tools powered by AI. No design skills required.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-amber-200 dark:hover:border-amber-800 transition-colors group">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-100 dark:shadow-blue-900/30 mb-6">
                  <Wand2 size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">AI Text Extraction</h3>
                <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4">
                  High-precision OCR detects text in any image. Click to edit, rewrite with AI, or change fonts instantly.
                </p>
                <ul className="space-y-2">
                  {['One-click detection', 'Auto font matching', 'Multi-language support'].map((t) => (
                    <li key={t} className="flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-300">
                      <CheckCircle2 size={14} className="text-emerald-500" /> {t}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Feature 2 */}
              <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-amber-200 dark:hover:border-amber-800 transition-colors group">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-amber-100 dark:shadow-amber-900/30 mb-6">
                  <Zap size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">Magic Erase</h3>
                <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4">
                  Remove any text, watermark, or object with AI-generated background fill. Seamlessly.
                </p>
                <ul className="space-y-2">
                  {['Text removal', 'Watermark erase', 'Smart inpainting'].map((t) => (
                    <li key={t} className="flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-300">
                      <CheckCircle2 size={14} className="text-emerald-500" /> {t}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Feature 3 */}
              <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-amber-200 dark:hover:border-amber-800 transition-colors group">
                <div className="w-12 h-12 bg-zinc-900 dark:bg-white rounded-2xl flex items-center justify-center text-white dark:text-zinc-900 shadow-xl shadow-zinc-200 dark:shadow-zinc-800 mb-6">
                  <Download size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">Pro Export</h3>
                <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4">
                  Download in PNG, JPEG, WEBP, SVG, or PDF. Up to 4K resolution with transparency support.
                </p>
                <ul className="space-y-2">
                  {['4K Resolution', 'Vector SVG', 'Transparent PNG'].map((t) => (
                    <li key={t} className="flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-300">
                      <CheckCircle2 size={14} className="text-emerald-500" /> {t}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Feature 4 */}
              <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-amber-200 dark:hover:border-amber-800 transition-colors group">
                <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-purple-100 dark:shadow-purple-900/30 mb-6">
                  <Palette size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">Brand Kit</h3>
                <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4">
                  Save your brand colors and fonts. Apply them to any text with one click.
                </p>
                <ul className="space-y-2">
                  {['Unlimited colors', 'Font library', 'Quick apply'].map((t) => (
                    <li key={t} className="flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-300">
                      <CheckCircle2 size={14} className="text-emerald-500" /> {t}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Feature 5 */}
              <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-amber-200 dark:hover:border-amber-800 transition-colors group">
                <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-green-100 dark:shadow-green-900/30 mb-6">
                  <Layers size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">Batch Processing</h3>
                <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4">
                  Process multiple images at once. OCR, resize, or export in bulk.
                </p>
                <ul className="space-y-2">
                  {['Up to 50 images', 'Bulk export', 'Queue processing'].map((t) => (
                    <li key={t} className="flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-300">
                      <CheckCircle2 size={14} className="text-emerald-500" /> {t}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Feature 6 */}
              <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-amber-200 dark:hover:border-amber-800 transition-colors group">
                <div className="w-12 h-12 bg-rose-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-rose-100 dark:shadow-rose-900/30 mb-6">
                  <Sparkles size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">AI Writing</h3>
                <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4">
                  Rewrite any text with AI. Choose tones: professional, casual, marketing, or concise.
                </p>
                <ul className="space-y-2">
                  {['4 tone presets', 'Instant rewrite', 'Groq-powered'].map((t) => (
                    <li key={t} className="flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-300">
                      <CheckCircle2 size={14} className="text-emerald-500" /> {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black mb-4">Simple pricing</h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-lg max-w-2xl mx-auto">
                Start free, upgrade when you need more. Cancel anytime.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Free */}
              <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border-2 border-zinc-200 dark:border-zinc-800">
                <h3 className="text-xl font-bold mb-2">Free</h3>
                <div className="mb-6">
                  <span className="text-4xl font-black">$0</span>
                  <span className="text-zinc-500">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {['5 AI credits/month', 'Basic OCR', 'Standard exports', '1 Brand kit', 'Community support'].map((t) => (
                    <li key={t} className="flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-300">
                      <CheckCircle2 size={16} className="text-emerald-500" /> {t}
                    </li>
                  ))}
                </ul>
                <Button asChild variant="outline" className="w-full rounded-full">
                  <Link href="/signup">Get Started</Link>
                </Button>
              </div>

              {/* Pro */}
              <div className="bg-gradient-to-b from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-8 rounded-2xl border-2 border-amber-300 dark:border-amber-700 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-black uppercase rounded-full">
                  Most Popular
                </div>
                <h3 className="text-xl font-bold mb-2">Pro</h3>
                <div className="mb-6">
                  <span className="text-4xl font-black">$9.99</span>
                  <span className="text-zinc-500">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {['100 AI credits/month', 'Priority OCR', '4K exports', 'Batch processing', 'Unlimited brand kits', 'Priority support'].map((t) => (
                    <li key={t} className="flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-300">
                      <CheckCircle2 size={16} className="text-emerald-500" /> {t}
                    </li>
                  ))}
                </ul>
                <Button asChild className="w-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                  <Link href="/signup?plan=pro">Upgrade to Pro</Link>
                </Button>
              </div>

              {/* Enterprise */}
              <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border-2 border-zinc-200 dark:border-zinc-800">
                <h3 className="text-xl font-bold mb-2">Enterprise</h3>
                <div className="mb-6">
                  <span className="text-4xl font-black">$49.99</span>
                  <span className="text-zinc-500">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {['Unlimited AI credits', 'API access', 'Custom branding', 'Team collaboration', 'Dedicated support', 'SLA guarantee'].map((t) => (
                    <li key={t} className="flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-300">
                      <CheckCircle2 size={16} className="text-emerald-500" /> {t}
                    </li>
                  ))}
                </ul>
                <Button asChild variant="outline" className="w-full rounded-full">
                  <Link href="/contact">Contact Sales</Link>
                </Button>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mt-12 text-center">
              <p className="text-sm text-zinc-500 mb-4">Accepted payment methods</p>
              <div className="flex items-center justify-center gap-6">
                <div className="flex items-center gap-2 text-zinc-400">
                  <CreditCard size={20} />
                  <span className="text-sm font-medium">Cards & Bank</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-400">
                  <Bitcoin size={20} />
                  <span className="text-sm font-medium">Crypto (USDT, BTC, ETH)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-zinc-900 text-white">
          <div className="max-w-3xl mx-auto text-center px-6">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Ready to transform your images?</h2>
            <p className="text-xl text-zinc-400 mb-10">
              Join thousands of designers using Photune to create stunning visuals.
            </p>
            <Button asChild size="lg" className="h-14 px-10 text-lg rounded-full bg-white text-zinc-900 hover:bg-zinc-100 shadow-2xl">
              <Link href="/editor/new">Start Editing Free <ArrowRight className="ml-2 w-5 h-5" /></Link>
            </Button>
            <p className="mt-4 text-sm text-zinc-500">No credit card required</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-zinc-100 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">P</span>
                </div>
                <span className="text-lg font-black">Photune</span>
              </div>
              <p className="text-sm text-zinc-500">AI-powered image text editing for everyone.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li><Link href="#features" className="hover:text-zinc-900 dark:hover:text-zinc-100">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-zinc-900 dark:hover:text-zinc-100">Pricing</Link></li>
                <li><Link href="/dashboard" className="hover:text-zinc-900 dark:hover:text-zinc-100">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li><Link href="/about" className="hover:text-zinc-900 dark:hover:text-zinc-100">About</Link></li>
                <li><Link href="/blog" className="hover:text-zinc-900 dark:hover:text-zinc-100">Blog</Link></li>
                <li><Link href="/contact" className="hover:text-zinc-900 dark:hover:text-zinc-100">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li><Link href="/privacy" className="hover:text-zinc-900 dark:hover:text-zinc-100">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-zinc-900 dark:hover:text-zinc-100">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-zinc-400">© {new Date().getFullYear()} Photune. All rights reserved.</p>
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Sparkles size={14} />
              Powered by Groq & Cloudflare AI
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
