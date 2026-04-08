# ENVIRONMENT_MATRIX

## Objective
Define the current Photune environment-variable surface based on verified code paths, `.env.example`, and runtime env guards.

This document distinguishes:
- required in all environments
- conditionally required by active feature paths
- active but runtime-specific
- present in schema/docs but not required for current active route surfaces

## 1. Canonical Environment Model

### All Environments
These are required for the app to boot correctly in any meaningful environment:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL`

### Feature-Conditional Provider Groups
These are required only when the corresponding feature path is exercised:
- Groq group
- Cloudflare group
- Stripe group
- Mailgun group

### Current Production Intent
Based on current active routes and shared libraries, the canonical active provider set is:
- Supabase
- Stripe
- Mailgun
- Groq
- Cloudflare

## 2. Core Runtime Variables

### `NEXT_PUBLIC_SUPABASE_URL`
- Required: Yes
- Scope: Browser + Server
- Used by:
  - Supabase browser client
  - Supabase server client
  - middleware/session flows
- Validation: `src/shared/lib/env/server.ts`
- Status: Present in `.env.example`

### `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Required: Yes
- Scope: Browser + Server
- Used by:
  - Supabase browser client
  - Supabase server client
  - middleware/session flows
- Validation: `src/shared/lib/env/server.ts`
- Status: Present in `.env.example`

### `NEXT_PUBLIC_SITE_URL`
- Required: Yes
- Scope: Browser + Server
- Used by:
  - site config
  - billing return URLs
  - application URL construction
- Validation: `src/shared/lib/env/server.ts`
- Status: Present in `.env.example`

## 3. AI Provider Variables

### Groq
#### `GROQ_API_KEY`
- Required: Conditional
- Required when:
  - `/api/ai/groq` is enabled or called
- Validation: `requireGroqEnv()` in `src/shared/lib/env/providers.ts`
- Status: Present in `.env.example`

### Cloudflare
#### `CLOUDFLARE_ACCOUNT_ID`
- Required: Conditional
- Required when:
  - `/api/ai/inpaint`
  - `/api/ai/workers`
  are enabled or called
- Validation: `requireCloudflareEnv()`
- Status: Present in `.env.example`

#### `CLOUDFLARE_API_TOKEN`
- Required: Conditional
- Required when:
  - `/api/ai/inpaint`
  - `/api/ai/workers`
  are enabled or called
- Validation: `requireCloudflareEnv()`
- Status: Present in `.env.example`

## 4. Stripe Variables

### `STRIPE_SECRET_KEY`
- Required: Conditional
- Required when:
  - `/api/stripe/checkout`
  - `/api/stripe/portal`
  - `/api/stripe/webhook`
  are active
- Validation: `requireStripeEnv()`
- Status: Present in `.env.example`

### `STRIPE_WEBHOOK_SECRET`
- Required: Conditional
- Required when:
  - `/api/stripe/webhook` is active
- Validation: `requireStripeEnv()`
- Status: Present in `.env.example`

### `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- Required: Conditional
- Required when:
  - client-side Stripe flows are enabled
- Validation: not enforced in the same server helper as secret keys
- Status: Present in `.env.example`

### `STRIPE_PRO_MONTHLY_PRICE_ID`
- Required: Conditional
- Required when:
  - Pro monthly checkout path is active
- Validation: `requireStripeEnv()`
- Status: Present in `.env.example`

### `STRIPE_PRO_YEARLY_PRICE_ID`
- Required: Conditional
- Required when:
  - Pro yearly checkout path is active
- Validation: `requireStripeEnv()`
- Status: Present in `.env.example`

### `STRIPE_ENTERPRISE_MONTHLY_PRICE_ID`
- Required: Conditional
- Required when:
  - Enterprise monthly checkout path is active
- Validation: `requireStripeEnv()`
- Status: Present in `.env.example`

## 5. Email Variables

### Mailgun
#### `MAILGUN_API_KEY`
- Required: Conditional
- Required when:
  - transactional email delivery is used
- Validation: `requireMailgunEnv()` in `src/shared/lib/env/email.ts`
- Status: Present in `.env.example`

#### `MAILGUN_DOMAIN`
- Required: Conditional
- Required when:
  - transactional email delivery is used
- Validation: `requireMailgunEnv()`
- Status: Present in `.env.example`

#### `MAILGUN_FROM_EMAIL`
- Required: Conditional
- Required when:
  - transactional email delivery is used
- Validation: `requireMailgunEnv()`
- Status: Present in `.env.example`

## 6. Environment Profile by Stage

## Local Development
Minimum required for authenticated non-provider bootstrapping:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL`

Add depending on exercised features:
- `GROQ_API_KEY`
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_PRO_MONTHLY_PRICE_ID`
- `STRIPE_PRO_YEARLY_PRICE_ID`
- `STRIPE_ENTERPRISE_MONTHLY_PRICE_ID`
- `MAILGUN_API_KEY`
- `MAILGUN_DOMAIN`
- `MAILGUN_FROM_EMAIL`

Notes:
- local development can run without all providers if the corresponding routes are not exercised
- build behavior may still require placeholder values in CI-style validation contexts

## CI Validation
Verified in `.github/workflows/ci.yml`:
- build step injects placeholder values for Supabase, Stripe, Mailgun, Groq, and Cloudflare
- smoke steps do not require live provider credentials

Implication:
- CI validates static correctness and route/build compatibility
- CI does not prove live provider connectivity

## Preview / Staging
Required:
- all core runtime vars
- all provider vars for previewed features
- preview-correct `NEXT_PUBLIC_SITE_URL`

Not yet proven:
- a distinct documented staging contract separate from production
- automated drift detection between preview and production secret sets

## Production
Required:
- all core runtime vars
- all vars for every active provider path exposed in production
- secure secret management outside repository

Current active production-intent provider set:
- Supabase
- Stripe
- Mailgun
- Groq
- Cloudflare

## 7. Verified Env Validation Surfaces

### Core Server Validation
- `src/shared/lib/env/server.ts`

### Provider Validation
- `src/shared/lib/env/providers.ts`
  - `requireStripeEnv()`
  - `requireGroqEnv()`
  - `requireCloudflareEnv()`

### Email Validation
- `src/shared/lib/env/email.ts`
  - `requireMailgunEnv()`

Assessment:
- fail-fast env validation exists for the main provider groups
- centralization is present but still segmented by concern

## 8. Environment Risks
1. `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is present in `.env.example`, but its validation path is less explicit than secret Stripe vars.
2. Preview/staging discipline is not fully codified beyond placeholder CI values and generic `.env.example` guidance.
3. Legacy payment tables remain in schema even though the active environment contract is Stripe-only for billing routes.
4. There is no verified automated secret completeness checker beyond route-level fail-fast helpers.
5. Route-level env checks protect invocation, but they do not guarantee startup-time validation of every enabled feature surface.

## 9. Normalization Rules
1. Treat `.env.example` as the canonical public contract for required variables.
2. Keep active provider groups limited to the currently supported runtime surface.
3. Do not reintroduce deferred billing provider variables unless corresponding runtime paths are intentionally restored.
4. When adding a new provider-dependent route, add:
   - `.env.example` entry
   - runtime validation helper
   - CI placeholder value if required for build
   - documentation update in this file
5. Any variable required for production-only operations must be called out explicitly in deployment docs.

## 10. Required Follow-Up Actions

### P0
- Keep `.env.example`, runtime validation helpers, and CI placeholder env blocks synchronized.

### P1
- Add a startup or validation script that can assert a complete production environment contract before deployment.

### P2
- Decide whether to formalize separate env manifests for local, preview, and production rather than relying on one generalized template.
