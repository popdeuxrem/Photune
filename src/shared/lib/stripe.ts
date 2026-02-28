/**
 * Photune Stripe Integration
 * Handles subscription billing, webhooks, and portal
 */

import { stripe } from './stripe-client';
import { createClient } from '@/shared/lib/supabase/server';

const PRICE_IDS = {
  pro_monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
  pro_yearly: process.env.STRIPE_PRO_YEARLY_PRICE_ID,
  enterprise_monthly: process.env.STRIPE_ENTERPRISE_MONTHLY_PRICE_ID,
};

export type SubscriptionTier = 'free' | 'pro' | 'enterprise';
export type BillingInterval = 'monthly' | 'yearly';

/**
 * Create a checkout session for upgrading subscription
 */
export async function createCheckoutSession(
  userId: string,
  userEmail: string,
  tier: 'pro' | 'enterprise',
  interval: BillingInterval = 'monthly'
) {
  const priceId = tier === 'pro' 
    ? (interval === 'monthly' ? PRICE_IDS.pro_monthly : PRICE_IDS.pro_yearly)
    : PRICE_IDS.enterprise_monthly;

  if (!priceId) {
    throw new Error('Invalid price configuration');
  }

  const session = await stripe.checkout.sessions.create({
    customer_email: userEmail,
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?upgrade=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?upgrade=cancelled`,
    metadata: {
      userId,
      tier,
    },
  });

  return session;
}

/**
 * Create customer portal session for managing subscription
 */
export async function createPortalSession(customerId: string, returnUrl: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session;
}

/**
 * Handle webhook events from Stripe
 */
export async function handleWebhook(
  payload: string | Buffer,
  signature: string
) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  
  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    throw new Error(`Webhook signature verification failed`);
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      await handleCheckoutComplete(session);
      break;
    }
    
    case 'customer.subscription.updated': {
      const subscription = event.data.object;
      await handleSubscriptionUpdate(subscription);
      break;
    }
    
    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      await handleSubscriptionDeleted(subscription);
      break;
    }
    
    case 'invoice.payment_failed': {
      const invoice = event.data.object;
      await handlePaymentFailed(invoice);
      break;
    }
  }

  return { received: true };
}

async function handleCheckoutComplete(session: any) {
  const userId = session.metadata?.userId;
  const customerId = session.customer;
  const subscriptionId = session.subscription;

  if (!userId) return;

  // Update user subscription in DB
  const supabase = createClient();
  await supabase.from('user_subscriptions').upsert({
    user_id: userId,
    stripe_customer_id: customerId,
    stripe_subscription_id: subscriptionId,
    tier: session.metadata?.tier || 'pro',
    ai_credits_limit: session.metadata?.tier === 'enterprise' ? -1 : 100, // -1 = unlimited
    billing_cycle_start: new Date().toISOString(),
  }, { onConflict: 'user_id' });
}

async function handleSubscriptionUpdate(subscription: any) {
  const supabase = createClient();
  
  // Get user by stripe customer
  const { data } = await supabase
    .from('user_subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', subscription.customer)
    .single();

  if (!data) return;

  const tier = subscription.items.data[0]?.price?.id === PRICE_IDS.enterprise_monthly 
    ? 'enterprise' 
    : 'pro';

  await supabase.from('user_subscriptions')
    .update({
      tier,
      ai_credits_limit: tier === 'enterprise' ? -1 : 100,
      billing_cycle_end: new Date(subscription.current_period_end * 1000).toISOString(),
    })
    .eq('user_id', data.user_id);
}

async function handleSubscriptionDeleted(subscription: any) {
  const supabase = createClient();
  
  await supabase.from('user_subscriptions')
    .update({
      tier: 'free',
      stripe_subscription_id: null,
      ai_credits_limit: 5,
    })
    .eq('stripe_customer_id', subscription.customer);
}

async function handlePaymentFailed(invoice: any) {
  // Could send email notification here
  console.log('Payment failed for customer:', invoice.customer);
}

// Helper to get user's subscription status
export async function getUserSubscription(userId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('user_subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    return { tier: 'free', aiCreditsUsed: 0, aiCreditsLimit: 5 };
  }

  return {
    tier: data.tier,
    aiCreditsUsed: data.ai_credits_used,
    aiCreditsLimit: data.ai_credits_limit,
    stripeCustomerId: data.stripe_customer_id,
  };
}
