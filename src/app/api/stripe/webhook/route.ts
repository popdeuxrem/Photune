import { NextRequest, NextResponse } from 'next/server';
import { handleWebhook } from '@/shared/lib/stripe';
import { stripe } from '@/shared/lib/stripe-client';

export async function POST(req: NextRequest) {
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

// Disable body parsing for webhook
export const config = {
  api: {
    bodyParser: false,
  },
};
