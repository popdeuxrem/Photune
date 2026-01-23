import { AuthUI } from '@/features/authentication/components/AuthUI';

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-zinc-200">
        <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
        <p className="text-zinc-500 mb-6">Sign in to manage your projects.</p>
        <AuthUI />
      </div>
    </div>
  );
}
