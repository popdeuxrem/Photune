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

  return (
    <form onSubmit={handleSignIn} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input id="email" type="email" placeholder="name@company.com" required 
               value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-xl" />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="password">Password</Label>
          <button type="button" className="text-xs text-zinc-500 hover:text-zinc-900 underline">Forgot password?</button>
        </div>
        <Input id="password" type="password" required 
               value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-xl" />
      </div>
      <Button type="submit" className="w-full h-11 rounded-xl bg-zinc-900" disabled={loading}>
        {loading ? <Loader2 className="animate-spin" /> : "Sign In with Email"}
      </Button>
    </form>
  );
}
