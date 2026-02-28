-- Photune Database Schema
-- Run these in Supabase SQL Editor

-- User Subscriptions
CREATE TABLE user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tier VARCHAR(20) DEFAULT 'free' CHECK (tier IN ('free', 'pro', 'enterprise')),
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  ai_credits_used INT DEFAULT 0,
  ai_credits_limit INT DEFAULT 5,
  billing_cycle_start DATE,
  billing_cycle_end DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own subscription" 
  ON user_subscriptions FOR ALL 
  USING (auth.uid() = user_id);

-- Brand Kits (saved per user)
CREATE TABLE brand_kits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(100) DEFAULT 'My Brand',
  colors JSONB DEFAULT '[{"id": "1", "hex": "#000000", "name": "Primary"}, {"id": "2", "hex": "#ffffff", "name": "Background"}]'::jsonb,
  fonts JSONB DEFAULT '[{"id": "1", "family": "Inter", "role": "body"}, {"id": "2", "family": "Playfair Display", "role": "heading"}]'::jsonb,
  logos TEXT[],
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE brand_kits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own brand kits" 
  ON brand_kits FOR ALL 
  USING (auth.uid() = user_id);

-- AI Usage Logs (for analytics/billing)
CREATE TABLE ai_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  operation VARCHAR(50) NOT NULL, -- 'rewrite', 'font-detect', 'inpaint', 'background-gen'
  credits_consumed INT DEFAULT 1,
  model_used VARCHAR(50),
  input_tokens INT,
  output_tokens INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE ai_usage_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own usage logs" 
  ON ai_usage_logs FOR SELECT 
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX idx_brand_kits_user_id ON brand_kits(user_id);
CREATE INDEX idx_ai_usage_user_id ON ai_usage_logs(user_id);
CREATE INDEX idx_ai_usage_created_at ON ai_usage_logs(created_at);
