export function requireStripeEnv() {
  const keys = [
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'STRIPE_PRO_MONTHLY_PRICE_ID',
    'STRIPE_PRO_YEARLY_PRICE_ID',
    'STRIPE_ENTERPRISE_MONTHLY_PRICE_ID',
  ] as const;

  const missing = keys.filter((key) => !process.env[key] || process.env[key]!.trim() === '');
  if (missing.length > 0) {
    throw new Error(`Missing required Stripe environment variables: ${missing.join(', ')}`);
  }
}

export function requireGroqEnv() {
  if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY.trim() === '') {
    throw new Error('Missing required environment variable: GROQ_API_KEY');
  }
}

export function requireCloudflareEnv() {
  const keys = ['CLOUDFLARE_ACCOUNT_ID', 'CLOUDFLARE_API_TOKEN'] as const;
  const missing = keys.filter((key) => !process.env[key] || process.env[key]!.trim() === '');
  if (missing.length > 0) {
    throw new Error(`Missing required Cloudflare environment variables: ${missing.join(', ')}`);
  }
}