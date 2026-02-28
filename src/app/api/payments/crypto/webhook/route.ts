import { NextRequest, NextResponse } from 'next/server';
import { handleCryptoWebhook } from '@/shared/lib/nowpayments';
import { createClient } from '@/shared/lib/supabase/server';

export async function POST(req: NextRequest) {
  const body = await req.text();
  
  // Verify IPN (in production, verify HMAC signature)
  // const hmac = req.headers.get('x-nowpayments-sig');

  try {
    const payload = JSON.parse(body);
    
    const result = await handleCryptoWebhook(payload, '');

    if (result.success) {
      // Update payment status in DB
      const supabase = createClient();
      await supabase
        .from('crypto_payments')
        .update({ status: 'completed' })
        .eq('user_id', result.userId);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Crypto webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
