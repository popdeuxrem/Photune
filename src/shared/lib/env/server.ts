type RequiredEnvKey =
  | 'NEXT_PUBLIC_SUPABASE_URL'
  | 'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  | 'NEXT_PUBLIC_SITE_URL';

function requireEnv(name: RequiredEnvKey): string {
  const value = process.env[name];
  if (!value || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getServerEnv() {
  return {
    NEXT_PUBLIC_SUPABASE_URL: requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
    NEXT_PUBLIC_SITE_URL: requireEnv('NEXT_PUBLIC_SITE_URL'),
  };
}

export const serverEnv = {
  get NEXT_PUBLIC_SUPABASE_URL() { return getServerEnv().NEXT_PUBLIC_SUPABASE_URL; },
  get NEXT_PUBLIC_SUPABASE_ANON_KEY() { return getServerEnv().NEXT_PUBLIC_SUPABASE_ANON_KEY; },
  get NEXT_PUBLIC_SITE_URL() { return getServerEnv().NEXT_PUBLIC_SITE_URL; },
};
