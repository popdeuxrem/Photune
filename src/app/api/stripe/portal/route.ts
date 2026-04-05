import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/shared/lib/supabase/server';
import { createPortalSession } from '@/shared/lib/stripe';
import { requireStripeEnv } from '@/shared/lib/env/providers';
import { applyRateLimit, makeRateLimitKey } from '@/shared/lib/security/rate-limit';
import { rateLimitResponse } from '@/shared/lib/security/rate-limit-response';
import { logWarn } from '@/shared/lib/logging/logger';

export async function POST(req: NextRequest) {
  requireStripeEnv();

  const rateLimit = applyRateLimit({
    key: makeRateLimitKey('/api/stripe/portal', req),
    windowMs: 60_000,
    max: 20,
  });

  if (!rateLimit.allowed) {
    logWarn({
      event: 'stripe_portal_rate_limited',
      surface: 'billing',
      route: '/api/stripe/portal',
      provider: 'stripe',
      statusCode: 429,
      message: 'Stripe portal route rate limit exceeded',
    });
    return rateLimitResponse(rateLimit.retryAfterSeconds);
  }

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get user's stripe customer ID
  const { data: subscription } = await supabase
    .from('user_subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .single();

  if (!subscription?.stripe_customer_id) {
    return NextResponse.json({ error: 'No active subscription' }, { status: 400 });
  }

  const { searchParams } = new URL(req.url);
  const returnUrl = searchParams.get('return_url') || `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`;

  try {
    const session = await createPortalSession(
      subscription.stripe_customer_id,
      returnUrl
    );

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Portal error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
