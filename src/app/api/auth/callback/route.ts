import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getErrorSummary, logError, logInfo, logWarn } from '@/shared/lib/logging/logger';
import { applyRateLimit, makeRateLimitKey } from '@/shared/lib/security/rate-limit';
import { rateLimitResponse } from '@/shared/lib/security/rate-limit-response';

export async function GET(request: Request) {
  const rateLimit = applyRateLimit({
    key: makeRateLimitKey('/api/auth/callback', request),
    windowMs: 60_000,
    max: 30,
  });

  if (!rateLimit.allowed) {
    logWarn({
      event: 'auth_callback_rate_limited',
      surface: 'auth',
      route: '/api/auth/callback',
      operation: 'auth_callback',
      statusCode: 429,
      message: 'Auth callback rate limit exceeded',
    });
    return rateLimitResponse(rateLimit.retryAfterSeconds);
  }

  logInfo({
    event: 'auth_callback_start',
    surface: 'auth',
    route: '/api/auth/callback',
    operation: 'auth_callback',
  });
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  if (code) {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) { return cookieStore.get(name)?.value },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )
    
    // Exchange the temporary code for a long-lived session
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Force an absolute redirect to /dashboard on the same origin
      return NextResponse.redirect(`${origin}/dashboard`)
    }
  }

  // If exchange fails, return to login with error state
  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}
