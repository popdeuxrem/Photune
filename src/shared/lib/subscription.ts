/**
 * Freemium Subscription Tiers
 */

export type SubscriptionTier = 'free' | 'pro' | 'enterprise';

export const TIER_FEATURES = {
  free: {
    name: 'Free',
    watermark: true,
    maxExports: 'low-res',
    aiCredits: 5,
    batchProcessing: false,
    brandKit: false,
    prioritySupport: false,
  },
  pro: {
    name: 'Pro',
    watermark: false,
    maxExports: 'unlimited',
    aiCredits: 100,
    batchProcessing: true,
    brandKit: true,
    prioritySupport: true,
  },
  enterprise: {
    name: 'Enterprise',
    watermark: false,
    maxExports: 'unlimited',
    aiCredits: 'unlimited',
    batchProcessing: true,
    brandKit: true,
    prioritySupport: true,
    customBranding: true,
  },
} as const;

export function canUseFeature(tier: SubscriptionTier, feature: keyof typeof TIER_FEATURES.free): boolean {
  const tierFeatures = TIER_FEATURES[tier];
  const featureValue = tierFeatures[feature];
  
  // Check for boolean true or non-false values
  if (typeof featureValue === 'boolean') {
    return featureValue;
  }
  if (featureValue === 'unlimited' || featureValue === true) {
    return true;
  }
  return false;
}

export function getTierFromString(tier: string): SubscriptionTier {
  if (tier === 'pro' || tier === 'enterprise') return tier;
  return 'free';
}
