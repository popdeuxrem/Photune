# ENVIRONMENT_MATRIX

## Purpose
This file normalizes the environment surface currently implied by the repository.

It distinguishes:
- required now
- conditionally required
- currently inconsistent
- missing from `.env.example` but referenced in code

## 1. Core Runtime Variables

### `NEXT_PUBLIC_SUPABASE_URL`
- Required: Yes
- Scope: Browser + Server
- Used by:
  - Supabase browser client
  - Supabase server client
  - middleware
  - auth callback
- Status: Present in `.env.example`

### `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Required: Yes
- Scope: Browser + Server
- Used by:
  - Supabase browser client
  - Supabase server client
  - middleware
  - auth callback
- Status: Present in `.env.example`

### `NEXT_PUBLIC_SITE_URL`
- Required: Yes
- Scope: Browser + Server
- Used by:
  - site config
  - Stripe success/cancel URLs
  - Stripe portal fallback return URL
  - NowPayments callback URL construction
- Status: Present in `.env.example`

## 2. AI Variables

### `GROQ_API_KEY`
- Required: Conditional
- Required when:
  - `/api/ai/groq` is enabled
- Status: Present in `.env.example`

### `CLOUDFLARE_ACCOUNT_ID`
- Required: Conditional
- Required when:
  - `/api/ai/inpaint`
  - `/api/ai/workers`
  are enabled
- Status: Present in `.env.example`

### `CLOUDFLARE_API_TOKEN`
- Required: Conditional
- Required when:
  - `/api/ai/inpaint`
  - `/api/ai/workers`
  are enabled
- Status: Present in `.env.example`

## 3. Stripe Variables

### `STRIPE_SECRET_KEY`
- Required: Conditional
- Required when:
  - Stripe checkout/portal/webhook flows are active
- Status: Present in `.env.example`

### `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- Required: Likely conditional
- Observed:
  - present in `.env.example`
  - not confirmed in inspected route files
- Status: Present in `.env.example`

### `STRIPE_WEBHOOK_SECRET`
- Required: Conditional
- Required when:
  - `/api/stripe/webhook` is active
- Status: Present in `.env.example`

### `STRIPE_PRO_MONTHLY_PRICE_ID`
- Required: Conditional
- Required when:
  - Pro monthly Stripe billing is active
- Status: Present in `.env.example`

### `STRIPE_PRO_YEARLY_PRICE_ID`
- Required: Conditional
- Required when:
  - Pro yearly Stripe billing is active
- Status: Present in `.env.example`

### `STRIPE_ENTERPRISE_MONTHLY_PRICE_ID`
- Required: Conditional
- Required when:
  - Enterprise monthly Stripe billing is active
- Status: Present in `.env.example`

## 6. Mail / Email Variables

### `MAILGUN_API_KEY`
- Required: Conditional
- Required when:
  - `src/shared/lib/email.ts` is used
- Status: Missing from `.env.example`

### `MAILGUN_DOMAIN`
- Required: Conditional
- Required when:
  - `src/shared/lib/email.ts` is used
- Status: Missing from `.env.example`

### `MAILGUN_FROM_EMAIL`
- Required: Conditional
- Required when:
  - `src/shared/lib/email.ts` is used
- Status: Missing from `.env.example`

## 8. Environment Profiles

### Local Development
Must have at minimum:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL`

Needed depending on active flows:
- `GROQ_API_KEY`
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`
- Stripe or Paystack or NowPayments variables

### Preview
Must define:
- all active production-path provider vars for the previewed feature set
- preview-safe `NEXT_PUBLIC_SITE_URL`

Current repo issue:
- no explicit preview/staging variable discipline is documented

### Production
Must define:
- Supabase runtime vars
- active AI provider vars
- exactly one canonical billing provider set, unless multi-provider is deliberate
- webhook secrets for active billing providers
- email provider vars for the active provider

Current repo issue:
- provider sprawl means “production env” is not tightly bounded

## 8. Environment Risks
1. `.env.example` omits Mailgun vars even though Mailgun code exists.
2. `.env.example` includes multiple payment providers without defining canonical precedence.
3. site identity is inconsistent across env-driven and hardcoded config.
4. no staging/preview/production contract is documented.
5. no secret rotation or webhook secret handling procedure is documented.

## 9. Required Normalization Actions
1. Add missing Mailgun vars or remove Mailgun integration.
2. Choose canonical billing provider path.
3. Choose canonical email provider path.
4. Add environment-classification comments:
   - required in all envs
   - preview only
   - production only
   - optional/feature-flagged
5. Add validation to fail fast on missing required server env vars.

