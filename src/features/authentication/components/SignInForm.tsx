'use client';

import { useState } from 'react';
import { createClient } from '@/shared/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { useToast } from '@/shared/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

export function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();
  const { toast } = useToast();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast({ title: "Login Failed", description: error.message, variant: "destructive" });
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      toast({ title: "Email required", description: "Please enter your email address first.", variant: "destructive" });
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Reset Link Sent", description: "Check your email for the recovery link." });
    }
  };

  return (
    <form onSubmit={handleSignIn} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-zinc-700 font-semibold">Email Address</Label>
        <Input 
          id="email" 
          type="email" 
          placeholder="name@example.com" 
          required 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          className="rounded-xl h-11 border-zinc-200" 
        />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="password" className="text-zinc-700 font-semibold">Password</Label>
          <button 
            type="button" 
            onClick={handleResetPassword}
            className="text-[11px] font-bold uppercase tracking-tighter text-zinc-400 hover:text-zinc-900 transition-colors"
          >
            Forgot password?
          </button>
        </div>
        <Input 
          id="password" 
          type="password" 
          required 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          className="rounded-xl h-11 border-zinc-200" 
        />
      </div>
      <Button 
        type="submit" 
        className="w-full h-12 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold shadow-lg shadow-zinc-200 transition-all active:scale-[0.98]" 
        disabled={loading}
      >
        {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Sign In"}
      </Button>
    </form>
  );
}
