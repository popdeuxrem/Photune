'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { SubscriptionTier, getTierFromString, TIER_FEATURES } from '../lib/subscription';
import { createClient } from '@/shared/lib/supabase/client';

interface UserSubscription {
  tier: SubscriptionTier;
  aiCreditsUsed: number;
  aiCreditsLimit: number;
}

const TIER_CONFIG: Record<SubscriptionTier, Record<string, boolean>> = {
  free: { watermark: true, batchProcessing: false, brandKit: false, prioritySupport: false },
  pro: { watermark: false, batchProcessing: true, brandKit: true, prioritySupport: true },
  enterprise: { watermark: false, batchProcessing: true, brandKit: true, prioritySupport: true },
};

const SubscriptionContext = createContext<{
  subscription: UserSubscription;
  canUseFeature: (feature: string) => boolean;
  useAICredit: () => boolean;
  isLoading: boolean;
}>({
  subscription: { tier: 'free', aiCreditsUsed: 0, aiCreditsLimit: 5 },
  canUseFeature: () => false,
  useAICredit: () => false,
  isLoading: true,
});

export function useSubscription() {
  return useContext(SubscriptionContext);
}

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [subscription, setSubscription] = useState<UserSubscription>({ tier: 'free', aiCreditsUsed: 0, aiCreditsLimit: 5 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSubscription() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsLoading(false);
        return;
      }

      // Fetch user subscription from DB
      const { data } = await supabase
        .from('user_subscriptions')
        .select('tier, ai_credits_used, ai_credits_limit')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setSubscription({
          tier: getTierFromString(data.tier || 'free'),
          aiCreditsUsed: data.ai_credits_used || 0,
          aiCreditsLimit: data.ai_credits_limit || 5,
        });
      }
      setIsLoading(false);
    }

    loadSubscription();
  }, []);

  const canUseFeature = (feature: string): boolean => {
    return TIER_CONFIG[subscription.tier][feature] ?? false;
  };

  const useAICredit = (): boolean => {
    if (subscription.aiCreditsLimit === -1) return true; // unlimited
    return subscription.aiCreditsUsed < subscription.aiCreditsLimit;
  };

  return (
    <SubscriptionContext.Provider value={{ 
      subscription, 
      canUseFeature, 
      useAICredit,
      isLoading 
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
}
