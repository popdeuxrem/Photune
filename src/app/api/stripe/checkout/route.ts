import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/shared/lib/supabase/server';
import { createCheckoutSession } from '@/shared/lib/stripe';
import { getErrorSummary, logError, logInfo, logWarn } from '@/shared/lib/logging/logger';
import { requireStripeEnv } from '@/shared/lib/env/providers';
import { applyRateLimit, makeRateLimitKey } from '@/shared/lib/security/rate-limit';
import { rateLimitResponse } from '@/shared/lib/security/rate-limit-response';

export async function POST(req: NextRequest) {
  requireStripeEnv();

  const rateLimit = applyRateLimit({
    key: makeRateLimitKey('/api/stripe/checkout', req),
    windowMs: 60_000,
    max: 20,
  });

  if (!rateLimit.allowed) {
    logWarn({
      event: 'stripe_checkout_rate_limited',
      surface: 'billing',
      route: '/api/stripe/checkout',
      provider: 'stripe',
      statusCode: 429,
      message: 'Stripe checkout route rate limit exceeded',
    });
    return rateLimitResponse(rateLimit.retryAfterSeconds);
  }

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { tier, interval = 'monthly' } = await req.json();

  if (!tier || !['pro', 'enterprise'].includes(tier)) {
    return NextResponse.json({ error: 'Invalid tier' }, { status: 400 });
  }

  try {
    const session = await createCheckoutSession(
      user.id,
      user.email!,
      tier,
      interval
    );

    logInfo({
      event: 'stripe_checkout_success',
      surface: 'billing',
      route: '/api/stripe/checkout',
      provider: 'stripe',
      operation: 'checkout_create',
    });
    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
