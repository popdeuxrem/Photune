/**
 * Photune Paystack Integration
 * Handles subscription billing via Paystack (Africa-focused)
 */

import { createClient } from '@/shared/lib/supabase/server';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

export type SubscriptionTier = 'free' | 'pro' | 'enterprise';

interface PaystackPlan {
  amount: number; // kobo
  interval: 'monthly' | 'yearly';
  name: string;
  description: string;
}

const PLANS: Record<SubscriptionTier, PaystackPlan> = {
  free: { amount: 0, interval: 'monthly', name: 'Free', description: 'Basic features' },
  pro: { amount: 99900, interval: 'monthly', name: 'Pro', description: 'Pro features - N9,990/month' },
  enterprise: { amount: 499900, interval: 'monthly', name: 'Enterprise', description: 'Everything + API - N49,990/month' },
};

/**
 * Create a Paystack checkout/authorization URL for subscription
 */
export async function createPaystackCheckout(
  userId: string,
  userEmail: string,
  tier: 'pro' | 'enterprise'
) {
  if (!PAYSTACK_SECRET_KEY) {
    throw new Error('Paystack not configured');
  }

  const plan = PLANS[tier];
  
  // First, create a customer
  const customerRes = await fetch(`${PAYSTACK_BASE_URL}/customer`, {
    method    headers: {
: 'POST',
      'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: userEmail,
      metadata: { userId },
    }),
  });

  const customerData = await customerRes.json();
  if (!customerData.status) {
    throw new Error('Failed to create Paystack customer');
  }

  const customerCode = customerData.data.customer_code;

  // Create checkout session
  const checkoutRes = await fetch(`${PAYSTACK_BASE_URL}/checkout`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      customer: customerCode,
      amount: plan.amount,
      currency: 'NGN',
      metadata: {
        userId,
        tier,
        type: 'subscription',
      },
    }),
  });

  const checkoutData = await checkoutRes.json();
  if (!checkoutData.status) {
    throw new Error('Failed to create checkout');
  }

  return {
    authorizationUrl: checkoutData.data.authorization_url,
    reference: checkoutData.data.reference,
  };
}

/**
 * Initialize transaction (alternative: direct payment)
 */
export async function initializeTransaction(
  userId: string,
  userEmail: string,
  amount: number,
  currency: 'NGN' | 'USD' | 'GBP' = 'NGN'
) {
  if (!PAYSTACK_SECRET_KEY) {
    throw new Error('Paystack not configured');
  }

  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: userEmail,
      amount: amount * 100, // kobo
      currency,
      metadata: {
        userId,
        type: 'subscription',
      },
    }),
  });

  const data = await response.json();
  if (!data.status) {
    throw new Error(data.message || 'Payment initialization failed');
  }

  return data.data;
}

/**
 * Verify transaction payment
 */
export async function verifyTransaction(reference: string) {
  if (!PAYSTACK_SECRET_KEY) {
    throw new Error('Paystack not configured');
  }

  const response = await fetch(
    `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
    {
      headers: {
        'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    }
  );

  const data = await response.json();
  return data.data;
}

/**
 * Create subscription from successful payment
 */
export async function handleSuccessfulPayment(
  userId: string,
  tier: SubscriptionTier
) {
  const supabase = createClient();

  // Determine credits based on tier
  const credits = tier === 'enterprise' ? -1 : tier === 'pro' ? 100 : 5;

  await supabase.from('user_subscriptions').upsert({
    user_id: userId,
    tier,
    ai_credits_limit: credits,
    billing_cycle_start: new Date().toISOString(),
    billing_cycle_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  }, { onConflict: 'user_id' });
}

/**
 * Get user's subscription status from Paystack
 */
export async function getUserSubscription(userId: string) {
  const supabase = createClient();
  
  const { data } = await supabase
    .from('user_subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single();

  return data;
}
