'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/shared/lib/supabase/client';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Loader2, Eye, EyeOff, Mail, Lock, User, ArrowRight, CheckCircle2 } from 'lucide-react';

export function SignUpForm() {
  const router = useRouter();
  const supabase = createClient();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Show success message or redirect
      router.push('/dashboard?welcome=true');
    }
  };

  const benefits = [
    '5 free AI credits',
    'No credit card required',
    'Export in multiple formats',
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name" className="text-xs font-bold uppercase text-zinc-500">Full Name</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="pl-10 h-12 rounded-xl bg-zinc-50 border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-xs font-bold uppercase text-zinc-500">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 h-12 rounded-xl bg-zinc-50 border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-xs font-bold uppercase text-zinc-500">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 pr-10 h-12 rounded-xl bg-zinc-50 border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900"
            required
            minLength={8}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <p className="text-xs text-zinc-400">Must be at least 8 characters</p>
      </div>

      <Button 
        type="submit" 
        disabled={loading}
        className="w-full h-12 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            Create Account <ArrowRight className="ml-2 w-4 h-4" />
          </>
        )}
      </Button>

      {/* Benefits preview */}
      <div className="pt-4 border-t border-zinc-100">
        <p className="text-xs font-medium text-zinc-500 mb-3">You'll get:</p>
Name="space-y        <ul class-2">
          {benefits.map((benefit) => (
            <li key={benefit} className="flex items-center gap-2 text-sm text-zinc-600">
              <CheckCircle2 size={14} className="text-emerald-500" />
              {benefit}
            </li>
          ))}
        </ul>
      </div>
    </form>
  );
}
