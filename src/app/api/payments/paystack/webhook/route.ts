import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/shared/lib/supabase/server';
import { verifyTransaction, handleSuccessfulPayment } from '@/shared/lib/paystack';

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Verify webhook signature in production
  // const signature = req.headers.get('x-paystack-signature');
  
  const { event, data } = body;

  if (event === 'charge.success') {
    const reference = data.reference;
    const status = data.status;
    const amount = data.amount;
    const customer = data.customer;

    if (status === 'success') {
      // Get payment reference from DB
      const supabase = createClient();
      const { data: paymentRef } = await supabase
        .from('payment_references')
        .select('user_id, tier')
        .eq('reference', reference)
        .single();

      if (paymentRef) {
        await handleSuccessfulPayment(paymentRef.user_id, paymentRef.tier);
        
        // Update payment status
        await supabase
          .from('payment_references')
          .update({ status: 'completed' })
          .eq('reference', reference);
      }
    }
  }

  return NextResponse.json({ received: true });
}
