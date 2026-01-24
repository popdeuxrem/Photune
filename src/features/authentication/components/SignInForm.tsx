'use client';

import { useState } from 'react';
import { createClient } from '@/shared/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { useToast } from '@/shared/components/ui/use-toast';
import { Loader2, KeyRound, Mail } from 'lucide-react';

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
      toast({ title: "Email required", description: "Enter your email to receive a reset link.", variant: "destructive" });
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Link Sent", description: "Check your inbox for the recovery link." });
    }
  };

  return (
    <form onSubmit={handleSignIn} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-xs font-bold uppercase text-zinc-500 ml-1">Email Address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
          <Input 
            id="email" type="email" placeholder="name@company.com" required 
            value={email} onChange={(e) => setEmail(e.target.value)} 
            className="pl-10 h-12 rounded-xl border-zinc-200 focus:ring-zinc-900" 
          />
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center px-1">
          <Label htmlFor="password" className="text-xs font-bold uppercase text-zinc-500">Password</Label>
          <button 
            type="button" onClick={handleResetPassword}
            className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors"
          >
            Forgot?
          </button>
        </div>
        <div className="relative">
          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
          <Input 
            id="password" type="password" required 
            value={password} onChange={(e) => setPassword(e.target.value)} 
            className="pl-10 h-12 rounded-xl border-zinc-200 focus:ring-zinc-900" 
          />
        </div>
      </div>
      <Button type="submit" className="w-full h-12 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold transition-all shadow-lg active:scale-[0.98]" disabled={loading}>
        {loading ? <Loader2 className="animate-spin" /> : "Sign In"}
      </Button>
    </form>
  );
}
