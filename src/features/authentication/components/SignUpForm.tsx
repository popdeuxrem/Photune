'use client';

import { useState } from 'react';
import { createClient } from '@/shared/lib/supabase/client';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { useToast } from '@/shared/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

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
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Check your email", description: "A confirmation link has been sent." });
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSignUp} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input id="email" type="email" placeholder="name@company.com" required 
               value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-xl" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Create Password</Label>
        <Input id="password" type="password" required 
               value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-xl" />
      </div>
      <Button type="submit" className="w-full h-11 rounded-xl bg-zinc-900" disabled={loading}>
        {loading ? <Loader2 className="animate-spin" /> : "Create Account"}
      </Button>
    </form>
  );
}
