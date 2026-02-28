'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Crown, Zap, Check, Loader2, CreditCard, Bitcoin } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: string;
}

type PaymentMethod = 'card' | 'crypto';

const PLANS = [
  {
    name: 'Pro',
    priceUSD: 9.99,
    priceNaira: 9990,
    interval: 'month',
    features: [
      'No watermark on exports',
      '100 AI credits/month',
      'Batch processing',
      'Brand kit storage',
      'Priority support',
    ],
    priceId: 'pro_monthly',
  },
  {
    name: 'Enterprise',
    priceUSD: 49.99,
    priceNaira: 49990,
    interval: 'month',
    features: [
      'Everything in Pro',
      'Unlimited AI credits',
      'Custom branding',
      'API access',
      'Dedicated support',
    ],
    priceId: 'enterprise_monthly',
  },
];

export function UpgradeModal({ isOpen, onClose, feature }: UpgradeModalProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');

  const handlePayment = async (priceId: string, method: PaymentMethod) => {
    setLoading(priceId);
    
    try {
      const endpoint = method === 'crypto' 
        ? '/api/payments/crypto/checkout'
        : '/api/payments/paystack/checkout';
      
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tier: priceId.includes('enterprise') ? 'enterprise' : 'pro'
        }),
      });
      
      const data = await res.json();
      
      if (data.url || data.paymentUrl) {
        window.location.href = data.url || data.paymentUrl;
      } else {
        console.error('Failed to create payment:', data.error);
      }
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white dark:bg-zinc-900 rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Crown className="w-5 h-5 text-amber-500" />
            <DialogTitle className="text-xl dark:text-white">Upgrade to Pro</DialogTitle>
          </div>
          <DialogDescription className="text-zinc-500 dark:text-zinc-400">
            Unlock {feature} with Photune Pro. Choose your payment method below.
          </DialogDescription>
        </DialogHeader>

        {/* Payment Method Toggle */}
        <div className="flex gap-2 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
          <button
            onClick={() => setPaymentMethod('card')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all ${
              paymentMethod === 'card' 
                ? 'bg-white dark:bg-zinc-700 shadow-sm' 
                : 'text-zinc-500 hover:text-zinc-700'
            }`}
          >
            <CreditCard size={16} />
            Card / Bank
          </button>
          <button
            onClick={() => setPaymentMethod('crypto')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all ${
              paymentMethod === 'crypto' 
                ? 'bg-white dark:bg-zinc-700 shadow-sm' 
                : 'text-zinc-500 hover:text-zinc-700'
            }`}
          >
            <Bitcoin size={16} />
            Crypto
          </button>
        </div>

        {/* Plans */}
        <div className="space-y-4 py-4">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className="border-2 border-zinc-200 dark:border-zinc-700 rounded-xl p-4 hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-bold text-lg dark:text-white">{plan.name}</h3>
                  <p className="text-2xl font-black">
                    {paymentMethod === 'crypto' ? '~$' : '₦'}
                    {paymentMethod === 'crypto' ? plan.priceUSD : plan.priceNaira}
                    <span className="text-sm font-normal text-zinc-500">/{plan.interval}</span>
                  </p>
                </div>
                {plan.name === 'Pro' && (
                  <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs font-bold px-2 py-1 rounded-full">
                    POPULAR
                  </span>
                )}
              </div>

              <ul className="space-y-2 mb-4">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
                    <Check className="w-4 h-4 text-green-500 shrink-0" />
                    {feat}
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handlePayment(plan.priceId, paymentMethod)}
                disabled={loading !== null}
                className="w-full"
                variant={plan.name === 'Pro' ? 'default' : 'outline'}
              >
                {loading === plan.priceId ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Pay with {paymentMethod === 'crypto' ? 'Crypto' : 'Card/Bank'}
                  </>
                )}
              </Button>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4 pt-2 border-t border-zinc-200 dark:border-zinc-700">
          <div className="flex items-center gap-1 text-xs text-zinc-400">
            <CreditCard size={14} />
            Paystack
          </div>
          <div className="flex items-center gap-1 text-xs text-zinc-400">
            <Bitcoin size={14} />
            Crypto (BTC, ETH, USDT)
          </div>
        </div>

        <p className="text-xs text-center text-zinc-400 pt-2">
          Cancel anytime. Secure payments via Paystack or Cryptocurrency.
        </p>
      </DialogContent>
    </Dialog>
  );
}
