import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/shared/lib/supabase/server';
import { createPaystackCheckout, handleSuccessfulPayment } from '@/shared/lib/paystack';

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { tier } = await req.json();

  if (!tier || !['pro', 'enterprise'].includes(tier)) {
    return NextResponse.json({ error: 'Invalid tier' }, { status: 400 });
  }

  try {
    const { authorizationUrl, reference } = await createPaystackCheckout(
      user.id,
      user.email!,
      tier
    );

    // Store reference for verification later
    await supabase.from('payment_references').upsert({
      user_id: user.id,
      reference,
      provider: 'paystack',
      tier,
      status: 'pending',
    }, { onConflict: 'reference' });

    return NextResponse.json({ url: authorizationUrl, reference });
  } catch (error: any) {
    console.error('Paystack error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
