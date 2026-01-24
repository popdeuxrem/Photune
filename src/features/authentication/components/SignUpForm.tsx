'use client';

import { useState } from 'react';
import { createClient } from '@/shared/lib/supabase/client';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { useToast } from '@/shared/components/ui/use-toast';
import { Loader2, Mail, ShieldCheck } from 'lucide-react';

export function SignUpForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: { emailRedirectTo: `${window.location.origin}/api/auth/callback` }
    });
    
    if (error) {
      toast({ title: "Sign Up Failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Account Created", description: "Check your email to verify your account." });
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSignUp} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-xs font-bold uppercase text-zinc-500 ml-1">Email Address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
          <Input 
            id="email" type="email" placeholder="name@company.com" required 
            value={email} onChange={(e) => setEmail(e.target.value)} 
            className="pl-10 h-12 rounded-xl border-zinc-200" 
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" university-id="password" className="text-xs font-bold uppercase text-zinc-500 ml-1">Secure Password</Label>
        <div className="relative">
          <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
          <Input 
            id="password" type="password" required 
            value={password} onChange={(e) => setPassword(e.target.value)} 
            className="pl-10 h-12 rounded-xl border-zinc-200" 
          />
        </div>
      </div>
      <Button type="submit" className="w-full h-12 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold transition-all shadow-lg active:scale-[0.98]" disabled={loading}>
        {loading ? <Loader2 className="animate-spin" /> : "Create Studio Account"}
      </Button>
    </form>
  );
}
