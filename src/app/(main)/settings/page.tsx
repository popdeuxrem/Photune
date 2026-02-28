'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/shared/lib/supabase/client';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { 
  User, 
  Mail, 
  Lock, 
  CreditCard, 
  Crown,
  LogOut,
  Loader2,
  Save,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  
  // Form states
  const [name, setName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);
      setName(user.user_metadata?.full_name || '');
      setLoading(false);
    });
  }, [router, supabase]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const { error } = await supabase.auth.updateUser({
      data: { full_name: name }
    });

    if (error) {
      alert(error.message);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setSaving(true);
    
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      alert(error.message);
    } else {
      setSaved(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/dashboard" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
              ← Back
            </a>
            <h1 className="font-bold text-lg">Account Settings</h1>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto p-4 sm:p-8 space-y-8">
        {/* Profile Section */}
        <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-zinc-500" />
            </div>
            <div>
              <h2 className="font-bold">Profile</h2>
              <p className="text-sm text-zinc-500">Manage your account information</p>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-xs font-bold uppercase text-zinc-500">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email" className="text-xs font-bold uppercase text-zinc-500">Email</Label>
              <Input
                id="email"
                type="email"
                value={user?.email || ''}
                disabled
                className="rounded-xl bg-zinc-50 dark:bg-zinc-800"
              />
              <p className="text-xs text-zinc-400">Email cannot be changed</p>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <Button type="submit" disabled={saving} className="rounded-full">
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                Save Changes
              </Button>
              {saved && (
                <span className="flex items-center gap-1 text-sm text-green-600">
                  <CheckCircle2 className="w-4 h-4" /> Saved
                </span>
              )}
            </div>
          </form>
        </section>

        {/* Subscription Section */}
        <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
              <Crown className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="font-bold">Subscription</h2>
              <p className="text-sm text-zinc-500">Manage your plan</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl">
            <div>
              <p className="font-bold">Free Plan</p>
              <p className="text-sm text-zinc-500">5 AI credits/month</p>
            </div>
            <Button asChild className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500">
              <a href="/#pricing">Upgrade</a>
            </Button>
          </div>
        </section>

        {/* Password Section */}
        <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center">
              <Lock className="w-5 h-5 text-zinc-500" />
            </div>
            <div>
              <h2 className="font-bold">Password</h2>
              <p className="text-sm text-zinc-500">Change your password</p>
            </div>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="current-password" className="text-xs font-bold uppercase text-zinc-500">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="new-password" className="text-xs font-bold uppercase text-zinc-500">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="rounded-xl"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password" className="text-xs font-bold uppercase text-zinc-500">Confirm</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="rounded-xl"
                />
              </div>
            </div>

            <Button type="submit" disabled={saving || !currentPassword || !newPassword} className="rounded-full">
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Update Password
            </Button>
          </form>
        </section>

        {/* Danger Zone */}
        <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-red-200 dark:border-red-900/50 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <LogOut className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="font-bold">Sign Out</h2>
              <p className="text-sm text-zinc-500">Sign out of your account</p>
            </div>
          </div>

          <Button 
            variant="outline" 
            onClick={handleSignOut}
            className="rounded-full border-red-200 text-red-600 hover:bg-red-50"
          >
            Sign Out
          </Button>
        </section>
      </div>
    </div>
  );
}
