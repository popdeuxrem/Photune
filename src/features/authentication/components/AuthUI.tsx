'use client';

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { createClient } from '@/shared/lib/supabase/client';
import { useEffect, useState } from 'react';

export function AuthUI() {
  const supabase = createClient();
  const [authUrl, setAuthUrl] = useState<string | null>(null);

  useEffect(() => {
    // Construct the absolute URL for the callback
    const url = `${window.location.origin}/api/auth/callback`;
    setAuthUrl(url);
  }, []);

  // Don't render the Auth UI until the URL is generated (prevents mismatch)
  if (!authUrl) return <div className="h-[300px] flex items-center justify-center">Loading Auth...</div>;

  return (
    <Auth
      supabaseClient={supabase}
      appearance={{ theme: ThemeSupa }}
      providers={['google', 'github']}
      redirectTo={authUrl}
      onlyThirdPartyProviders={true}
    />
  );
}
