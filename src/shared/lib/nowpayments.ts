/**
 * Photune NowPayments Integration
 * Handles crypto payments (Bitcoin, Ethereum, USDT, etc.)
 */

import { createClient } from '@/shared/lib/supabase/server';

const NOWPAYMENTS_API_KEY = process.env.NOWPAYMENTS_API_KEY;
const NOWPAYMENTS_IPN_SECRET = process.env.NOWPAYMENTS_IPN_SECRET;
const NOWPAYMENTS_BASE_URL = 'https://api.nowpayments.io/v1';

export type SubscriptionTier = 'free' | 'pro' | 'enterprise';
export type CryptoCurrency = 'BTC' | 'ETH' | 'USDT' | 'USDC' | 'BNB' | 'SOL';

interface PriceInfo {
  currency: string;
  amount: number;
}

// USD prices for each tier (in cents)
const USD_PRICES: Record<SubscriptionTier, number> = {
  free: 0,
  pro: 999, // $9.99
  enterprise: 4999, // $49.99
};

/**
 * Get estimated price in crypto
 */
export async function getCryptoPrice(
  amountUSD: number,
  currency: CryptoCurrency
): Promise<PriceInfo> {
  if (!NOWPAYMENTS_API_KEY) {
    throw new Error('NowPayments not configured');
  }

  const response = await fetch(
    `${NOWPAYMENTS_BASE_URL}/estimate?amount=${amountUSD}&currency_from=usd&currency_to=${currency}`,
    {
      headers: {
        'x-api-key': NOWPAYMENTS_API_KEY!,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to get crypto estimate');
  }

  const data = await response.json();
  return {
    currency,
    amount: data.estimated_amount,
  };
}

/**
 * Create a crypto payment invoice
 */
export async function createCryptoInvoice(
  userId: string,
  userEmail: string,
  tier: 'pro' | 'enterprise',
  currency: CryptoCurrency = 'USDT'
) {
  if (!NOWPAYMENTS_API_KEY) {
    throw new Error('NowPayments not configured');
  }

  const amountUSD = USD_PRICES[tier] / 100;
  
  // Get crypto price
  const priceInfo = await getCryptoPrice(amountUSD, currency);

  const response = await fetch(`${NOWPAYMENTS_BASE_URL}/invoice`, {
    method: 'POST',
    headers: {
      'x-api-key': NOWPAYMENTS_API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      price_amount: priceInfo.amount,
      price_currency: currency.toLowerCase(),
      order_id: `${userId}-${tier}-${Date.now()}`,
      order_description: `Photune ${tier} subscription`,
      ipn_callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payments/crypto/webhook`,
      customer_email: userEmail,
      metadata: {
        userId,
        tier,
      },
    }),
  });

  const data = await response.json();
  
  if (!data.id) {
    throw new Error('Failed to create crypto invoice');
  }

  return {
    invoiceId: data.id,
    paymentUrl: data.invoice_url,
    amount: priceInfo.amount,
    currency,
    expiresAt: data.invoice_expiry_at,
  };
}

/**
 * Get payment status from NowPayments
 */
export async function getPaymentStatus(paymentId: string) {
  if (!NOWPAYMENTS_API_KEY) {
    throw new Error('NowPayments not configured');
  }

  const response = await fetch(
    `${NOWPAYMENTS_BASE_URL}/payment/${paymentId}`,
    {
      headers: {
        'x-api-key': NOWPAYMENTS_API_KEY!,
      },
    }
  );

  const data = await response.json();
  return {
    status: data.payment_status,
    amount: data.pay_amount,
    currency: data.pay_currency,
  };
}

/**
 * Handle IPN webhook from NowPayments
 */
export async function handleCryptoWebhook(
  payload: any,
  hmac: string
): Promise<{ success: boolean; userId?: string; tier?: SubscriptionTier }> {
  // Verify HMAC signature
  // In production, verify this properly
  
  const { payment_status, order_id, metadata } = payload;

  if (payment_status !== 'finished' && payment_status !== 'confirmed') {
    return { success: false };
  }

  const [userId, tier] = order_id.split('-');
  
  if (!userId || !tier) {
    return { success: false };
  }

  // Update user subscription
  const supabase = createClient();
  
  const credits = tier === 'enterprise' ? -1 : tier === 'pro' ? 100 : 5;

  await supabase.from('user_subscriptions').upsert({
    user_id: userId,
    tier,
    ai_credits_limit: credits,
    billing_cycle_start: new Date().toISOString(),
    billing_cycle_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  }, { onConflict: 'user_id' });

  return { success: true, userId, tier: tier as SubscriptionTier };
}

/**
 * Get list of supported cryptocurrencies
 */
export function getSupportedCurrencies(): CryptoCurrency[] {
  return ['BTC', 'ETH', 'USDT', 'USDC', 'BNB', 'SOL'];
}

/**
 * Get USD price for a tier
 */
export function getTierPrice(tier: SubscriptionTier): number {
  return USD_PRICES[tier];
}
