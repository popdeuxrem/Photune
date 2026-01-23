import { AuthUI } from '@/features/authentication/components/AuthUI';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AuthPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      {/* Branding Side (Visible on Large Screens) */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-zinc-900 text-white relative overflow-hidden">
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center text-sm font-bold text-zinc-400 hover:text-white transition-colors gap-2">
            <ArrowLeft size={16} /> Back to Website
          </Link>
        </div>
        
        <div className="relative z-10">
          <h2 className="text-5xl font-black tracking-tight mb-6">Create magic <br/>with every pixel.</h2>
          <p className="text-zinc-400 text-lg max-w-sm">Join the community of designers using AI to redefine image editing.</p>
        </div>

        {/* Decorative Grid Pattern */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" 
             style={{backgroundImage: 'radial-gradient(circle at 2px 2px, #444 1px, transparent 0)', backgroundSize: '24px 24px'}}>
        </div>
      </div>

      {/* Auth Side */}
      <div className="flex items-center justify-center p-8 bg-zinc-50/50">
        <div className="w-full max-w-sm">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black tracking-tight mb-2">Welcome Back</h1>
            <p className="text-zinc-500 text-sm">Sign in to your design studio</p>
          </div>
          
          <div className="bg-white p-8 rounded-[32px] shadow-2xl border border-zinc-100">
            <AuthUI />
          </div>

          <p className="mt-8 text-center text-xs text-zinc-400 leading-relaxed px-4">
            By continuing, you agree to our Terms of Service and Privacy Policy. 
            Runs on Supabase Secure Auth.
          </p>
        </div>
      </div>
    </div>
  );
}
