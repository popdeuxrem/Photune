import { SignUpForm } from '@/features/authentication/components/SignUpForm';
import { SocialAuth } from '@/features/authentication/components/SocialAuth';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-6">
      <div className="w-full max-w-[400px] space-y-8">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-black">P</span>
            </div>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">Create account</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">Start editing images with AI for free</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-8 rounded-[32px] shadow-2xl shadow-zinc-200 dark:shadow-zinc-800 border border-zinc-100 dark:border-zinc-800">
          <SocialAuth />
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-zinc-100 dark:border-zinc-800"></span></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-zinc-900 px-2 text-zinc-400 font-bold">Or continue with</span></div>
          </div>
          <SignUpForm />
        </div>

        <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
          Already have an account? <Link href="/login" className="text-zinc-900 dark:text-white font-bold hover:underline">Sign In</Link>
        </p>

        <p className="text-center text-xs text-zinc-400">
          By signing up, you agree to our <Link href="/terms" className="underline">Terms</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
