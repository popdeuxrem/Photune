import { NextRequest, NextResponse } from 'next/server';
import { handleWebhook } from '@/shared/lib/stripe';
import { stripe } from '@/shared/lib/stripe-client';
import { getErrorSummary, logError, logInfo, logWarn } from '@/shared/lib/logging/logger';
import { requireStripeEnv } from '@/shared/lib/env/providers';
import { applyRateLimit, makeRateLimitKey } from '@/shared/lib/security/rate-limit';
import { rateLimitResponse } from '@/shared/lib/security/rate-limit-response';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  requireStripeEnv();

  const rateLimit = applyRateLimit({
    key: makeRateLimitKey('/api/stripe/webhook', req),
    windowMs: 60_000,
    max: 120,
  });

  if (!rateLimit.allowed) {
    logWarn({
      event: 'stripe_webhook_rate_limited',
      surface: 'billing',
      route: '/api/stripe/webhook',
      provider: 'stripe',
      statusCode: 429,
      message: 'Stripe webhook route rate limit exceeded',
    });
    return rateLimitResponse(rateLimit.retryAfterSeconds);
  }

  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  try {
    const result = await handleWebhook(body, signature);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
