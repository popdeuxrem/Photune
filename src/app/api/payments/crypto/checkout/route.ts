import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/shared/lib/supabase/server';
import { createCryptoInvoice, getSupportedCurrencies, getTierPrice } from '@/shared/lib/nowpayments';

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { tier, currency = 'USDT' } = await req.json();

  if (!tier || !['pro', 'enterprise'].includes(tier)) {
    return NextResponse.json({ error: 'Invalid tier' }, { status: 400 });
  }

  try {
    const result = await createCryptoInvoice(
      user.id,
      user.email!,
      tier,
      currency
    );

    // Store payment info
    await supabase.from('crypto_payments').insert({
      user_id: user.id,
      invoice_id: result.invoiceId,
      provider: 'nowpayments',
      tier,
      currency: result.currency,
      amount: result.amount,
      status: 'pending',
    });

    return NextResponse.json({
      paymentUrl: result.paymentUrl,
      invoiceId: result.invoiceId,
      amount: result.amount,
      currency: result.currency,
    });
  } catch (error: any) {
    console.error('Crypto payment error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  // Return supported currencies and prices
  const currencies = getSupportedCurrencies();
  
  const prices = {
    pro: {
      USD: getTierPrice('pro') / 100,
      crypto: {} as Record<string, number>,
    },
    enterprise: {
      USD: getTierPrice('enterprise') / 100,
      crypto: {} as Record<string, number>,
    },
  };

  return NextResponse.json({
    currencies,
    prices,
  });
}
