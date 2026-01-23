import { SignInForm } from '@/features/authentication/components/SignInForm';
import { SocialAuth } from '@/features/authentication/components/SocialAuth';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-6">
      <div className="w-full max-w-[400px] space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black tracking-tight">Sign In</h1>
          <p className="text-zinc-500 text-sm">Welcome back to phoTextAI</p>
        </div>

        <div className="bg-white p-8 rounded-[32px] shadow-2xl shadow-zinc-200 border border-zinc-100">
          <SocialAuth />
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-zinc-100"></span></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-zinc-400 font-bold">Or continue with</span></div>
          </div>
          <SignInForm />
        </div>

        <p className="text-center text-sm text-zinc-500">
          Don't have an account? <Link href="/signup" className="text-zinc-900 font-bold hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
