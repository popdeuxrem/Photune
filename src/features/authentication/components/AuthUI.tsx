'use client';

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { createClient } from '@/shared/lib/supabase/client';
import { useEffect, useState } from 'react';

export function AuthUI() {
  const supabase = createClient();
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    // Set the origin only after the component has mounted in the browser
    setOrigin(window.location.origin);
  }, []);

  return (
    <Auth
      supabaseClient={supabase}
      appearance={{ theme: ThemeSupa }}
      providers={['google', 'github']}
      // Only provide the redirect URL once we are in the browser context
      redirectTo={origin ? `${origin}/api/auth/callback` : undefined}
    />
  );
}
