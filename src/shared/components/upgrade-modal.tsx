'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Crown, Zap, Check, Loader2 } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: string;
}

const PLANS = [
  {
    name: 'Pro',
    price: 9.99,
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
    price: 49.99,
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

  const handleUpgrade = async (priceId: string) => {
    setLoading(priceId);
    
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tier: priceId.includes('enterprise') ? 'enterprise' : 'pro',
          interval: 'monthly'
        }),
      });
      
      const data = await res.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('Failed to create checkout:', data.error);
      }
    } catch (error) {
      console.error('Upgrade error:', error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white dark:bg-zinc-900 rounded-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Crown className="w-5 h-5 text-amber-500" />
            <DialogTitle className="text-xl dark:text-white">Upgrade to Pro</DialogTitle>
          </div>
          <DialogDescription className="text-zinc-500 dark:text-zinc-400">
            Unlock {feature} with Photune Pro. Starting at $9.99/month.
          </DialogDescription>
        </DialogHeader>

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
                    ${plan.price}
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
                onClick={() => handleUpgrade(plan.priceId)}
                disabled={loading !== null}
                className="w-full"
                variant={plan.name === 'Pro' ? 'default' : 'outline'}
              >
                {loading === plan.priceId ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Get {plan.name}
                  </>
                )}
              </Button>
            </div>
          ))}
        </div>

        <p className="text-xs text-center text-zinc-400">
          Cancel anytime. Secure payment via Stripe.
        </p>
      </DialogContent>
    </Dialog>
  );
}
