# SYSTEM_INVENTORY

## Objective
Provide a verified inventory of the current Photune repository so planning and implementation can reference actual system surfaces rather than inferred structure.

## 1. Runtime Inventory

### Framework and Language
- Next.js `^14.2.3`
- React `^18.2.0`
- TypeScript `^5`

### Package Manager
- npm
- lockfile present: `package-lock.json`

### Build / Validation Scripts
- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`
- `npm run typecheck`
- `npm run check`
- `npm run smoke:projects`
- `npm run smoke`
- `npm run smoke:providers`
- `npm run providers:classify`

## 2. Repository Topology

### Root Directories
- `.devcontainer/`
- `.github/`
- `artifacts/`
- `public/`
- `scripts/`
- `src/`
- `supabase/`

### Root Config / Control Files
- `.env.example`
- `.eslintrc.json`
- `components.json`
- `jsconfig.json`
- `next.config.mjs`
- `package.json`
- `postcss.config.mjs`
- `tailwind.config.ts`
- `tsconfig.json`
- `vercel.json`

### Root Documentation Layer
The repository contains extensive documentation, including kernel, audit, editor design, provider policy, deployment, security, and validation artifacts.

## 3. Application Route Inventory

### Root App Files
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/not-found.tsx`
- `src/app/globals.css`
- `src/app/forgot-password/page.tsx`

### Auth Route Group: `src/app/(auth)`
- `src/app/(auth)/auth/page.tsx`
- `src/app/(auth)/login/page.tsx`
- `src/app/(auth)/signup/page.tsx`

### Main App Route Group: `src/app/(main)`
- `src/app/(main)/layout.tsx`
- `src/app/(main)/loading.tsx`
- `src/app/(main)/dashboard/page.tsx`
- `src/app/(main)/editor/[projectId]/page.tsx`
- `src/app/(main)/onboarding/page.tsx`
- `src/app/(main)/settings/page.tsx`

### API Route Inventory: `src/app/api`
- `src/app/api/ai/groq/route.ts`
- `src/app/api/ai/inpaint/route.ts`
- `src/app/api/ai/workers/route.ts`
- `src/app/api/auth/callback/route.ts`
- `src/app/api/stripe/checkout/route.ts`
- `src/app/api/stripe/portal/route.ts`
- `src/app/api/stripe/webhook/route.ts`

### App Asset Inventory
Fonts bundled in app tree:
- `Geist-Bold.woff2`
- `Geist-Regular.woff2`
- `GeistMono-Regular.woff2`

## 4. Feature Inventory

### `src/features/authentication`
Verified files:
- `components/SignInForm.tsx`
- `components/SignUpForm.tsx`
- `components/SocialAuth.tsx`
- `hooks/useUser.ts`
- `lib/actions.ts`

Responsibility:
- user entry/auth UI
- auth state hooks
- auth server actions

### `src/features/dashboard`
Verified files:
- `components/DashboardClient.tsx`
- `components/EmptyState.tsx`
- `components/ProjectCard.tsx`
- `hooks/useDashboardControls.ts`
- `lib/actions.ts`
- `lib/normalize-projects.ts`

Responsibility:
- project listing and dashboard presentation
- project deletion
- normalized dashboard data handling

### `src/features/editor`
Verified sub-surfaces:
- core editor shell and client
- canvas component
- ingestion status
- mode navigation
- empty state
- export modal
- job status panel
- text properties
- AI tools modal
- title assist

Verified panel inventory:
- `BackgroundModePanel.tsx`
- `EffectModePanel.tsx`
- `EraseModePanel.tsx`
- `ExportModePanel.tsx`
- `LayersModePanel.tsx`
- `RewriteModePanel.tsx`
- `TextModePanel.tsx`
- `UploadModePanel.tsx`

Verified toolbar inventory:
- `AiToolsPanel.tsx`
- `BatchProcessorPanel.tsx`
- `BrandKitPanel.tsx`
- `EffectsPanel.tsx`
- `InfoPanel.tsx`
- `RemovePanel.tsx`
- `Sidebar.tsx`
- `StampPanel.tsx`

Verified editor library inventory:
- `actions.ts`
- `color-sampling.ts`
- `create-text-object.ts`
- `export-utils.ts`
- `font-matcher.ts`
- `image-filters.ts`
- `inpainting.ts`
- `layer-filters.ts`
- `layer-system.ts`
- `ocr-engine.ts`
- `ocr-worker.ts`
- `preprocessing.ts`

Responsibility:
- canvas-driven editing
- OCR-assisted text workflows
- export pipeline
- layer system behaviors
- AI and image manipulation helpers

## 5. Shared Library Inventory

### `src/shared/config`
- `site.ts`

Responsibility:
- site identity and description

### `src/shared/lib/env`
- `server.ts`
- `providers.ts`
- `email.ts`

Responsibility:
- fail-fast environment validation for runtime, provider, and email configuration

### `src/shared/lib/security`
- `rate-limit.ts`
- `rate-limit-response.ts`
- `upload-validation.ts`

Responsibility:
- API throttling helpers
- upload MIME/size validation
- HTTP 429 response normalization

### `src/shared/lib/supabase`
- `client.ts`
- `server.ts`

Responsibility:
- browser/server Supabase access

### `src/shared/lib/ai`
- `ai-cache.ts`
- `ai-hash.ts`
- `photune-ai.ts`

Additional AI-related shared files:
- `ai-client.ts`
- `photune-ai.ts`

Responsibility:
- AI adapter, request, and caching helpers

### `src/shared/lib/billing / email / logging`
- `stripe.ts`
- `stripe-client.ts`
- `subscription.ts`
- `email.ts`
- `email/provider.ts`
- `logging/logger.ts`

Responsibility:
- billing session/webhook support
- feature entitlements by tier
- transactional email delivery via Mailgun
- structured logging helpers

## 6. Data Inventory

### Supabase Schema Artifacts
- `supabase/schema.sql`
- `supabase/migrations/20260403_000001_create_projects.sql`

### Verified Tables in `supabase/schema.sql`
- `user_subscriptions`
- `brand_kits`
- `ai_usage_logs`
- `payment_references`
- `crypto_payments`
- `projects`

### Projects Table Contract
Verified columns:
- `id`
- `user_id`
- `name`
- `canvas_data`
- `original_image_url`
- `created_at`
- `updated_at`

Verified controls:
- RLS enabled
- ownership policy present
- update trigger present
- indexes present

## 7. Script Inventory

### `scripts/`
- `classify-provider-surface.sh`
- `install-kilo-cli.sh`
- `provider-inventory.sh`
- `smoke-projects.mjs`
- `smoke-provider-policy.mjs`

Responsibility:
- provider classification
- provider inventory generation
- smoke validation for projects contract
- smoke validation for provider policy discipline

### Root Helper Scripts
- `PATCH_FIX_TEXT_FONT_TYPES.sh`
- `PATCH_FIX_TEXT_FONT_TYPES_V2.sh`
- `VERIFY_AI_TASK_ADAPTERS.sh`
- `VERIFY_AI_TASK_STATUS_HOOK.sh`
- `VERIFY_FIX_TEXT_FONT_TYPES_V2.sh`

Assessment:
- repository contains implementation-era helper scripts beyond the main npm workflow
- not all helper scripts are guaranteed to be part of the canonical validation gate

## 8. Deployment / CI Inventory

### GitHub Actions
- `.github/workflows/ci.yml`

Verified jobs:
- `validate`
- `deploy`

### Deployment Target
- Vercel via `vercel.json`
- build/install assumptions encoded in workflow and config

### Dev Environment
- `.devcontainer/devcontainer.json`
- Node-focused containerized development path

## 9. Security / Policy Inventory

### Verified Security Controls
- response headers in `vercel.json`
- content security policy in `vercel.json`
- upload validation helper
- rate limiting helper
- environment requirement guards

### Provider Governance Artifacts
- `PROVIDER_POLICY.md`
- `PROVIDER_QUARANTINE.md`
- `PROVIDER_REMOVAL_STRATEGY.md`
- `artifacts/provider-inventory.md`

## 10. Product / Commercial Inventory

### Subscription Tiers
Defined in `src/shared/lib/subscription.ts`:
- `free`
- `pro`
- `enterprise`

### Tiered Feature Concepts
Verified in code:
- watermark behavior
- export entitlement differences
- AI credits
- batch processing
- brand kit
- priority support
- enterprise custom branding flag

## 11. Inventory Conclusions
1. Photune already contains a broad application surface spanning auth, dashboard, editor, AI, billing, and persistence.
2. The active billing path is Stripe; active transactional email path is Mailgun.
3. The editor is modular and materially implemented, not conceptual.
4. The repository includes both product code and substantial governance/operations documentation.
5. The main inventory risk is not missing structure but allowing inactive or deferred surfaces to continue drifting inside docs, schema, or helper scripts.
