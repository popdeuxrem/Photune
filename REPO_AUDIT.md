# REPO_AUDIT

## Objective
Reconcile the current repository against the Phase 0 kernel so subsequent work is based on verified code, configuration, and operational surfaces rather than stale assumptions.

## Repository
- Name: `Photune`
- Package: `photune`
- Branch assumption during audit: extracted working tree from `Photune-main.zip`
- Audit date basis: repository state inspected in-session

## Audit Method
This audit was derived from direct inspection of:
- `package.json`
- `.env.example`
- `.github/workflows/ci.yml`
- `next.config.mjs`
- `vercel.json`
- `src/app/**`
- `src/features/**`
- `src/shared/lib/**`
- `supabase/schema.sql`
- `supabase/migrations/20260403_000001_create_projects.sql`

No runtime execution, deployment, or database connectivity validation was performed as part of this document.

## Executive Assessment
Photune is a substantial work-in-progress rather than a greenfield scaffold.

It already contains:
- authenticated application routing
- dashboard and project persistence paths
- a Fabric.js-based editor surface
- OCR support via `tesseract.js`
- AI routes for Groq and Cloudflare
- Stripe billing routes
- Mailgun transactional email integration
- Supabase-backed persistence and row-level security primitives
- CI validation and Vercel deployment automation
- baseline security controls for uploads, API throttling, and response headers

It is **not yet proven production-ready** from repository inspection alone. The remaining issues are less about missing product direction and more about reconciliation, validation depth, and operational hardening.

## Observed Stack

### Runtime / Framework
- Next.js `^14.2.3`
- React `^18.2.0`
- TypeScript `^5`
- npm with `package-lock.json`
- Node 20 used in CI and devcontainer direction

### Editor / Frontend
- Fabric.js `5.3.0`
- Tesseract.js `^5.1.0`
- Zustand `^4.5.2`
- Tailwind CSS `^3.4.1`
- Radix UI component primitives

### Platform / Service Integrations
- Supabase SSR + `@supabase/supabase-js`
- Stripe
- Mailgun
- Groq
- Cloudflare Workers AI / Cloudflare AI routes

### Build / Deployment
- GitHub Actions CI workflow
- Vercel deployment target
- `vercel.json` security header configuration

## Source Topology

### Root-Level Operational Files
Present:
- `README.md`
- `PROJECT_BRIEF.md`
- `SUCCESS_CRITERIA.md`
- `ARCHITECTURE.md`
- `ROADMAP.md`
- `DECISIONS.md`
- `RISKS.md`
- `REPO_AUDIT.md`
- `SYSTEM_INVENTORY.md`
- `ENVIRONMENT_MATRIX.md`
- `GAP_ANALYSIS.md`
- `DEPLOYMENT.md`
- `RUNBOOK.md`
- `ROLLBACK.md`
- `OBSERVABILITY.md`
- `SECURITY.md`

### Application Layout
- `src/app`
- `src/features`
- `src/shared`
- `src/types`
- `supabase`
- `scripts`
- `.github/workflows`
- `.devcontainer`

## Package Script Audit
Current scripts in `package.json`:
- `dev`
- `build`
- `start`
- `lint`
- `typecheck`
- `check`
- `smoke:projects`
- `smoke`
- `smoke:providers`
- `providers:classify`

Assessment:
- the repository now has a meaningful validation baseline
- `check` aggregates lint, typecheck, build, and smoke
- there is still **no general test suite** (`test`, `test:unit`, `test:e2e` absent)
- smoke coverage is targeted rather than comprehensive

## Route Audit

### Public / Root Routes
Present:
- `/`
- `/forgot-password`
- `not-found`

### Auth Routes
Present under `src/app/(auth)`:
- `/auth`
- `/login`
- `/signup`

### Main App Routes
Present under `src/app/(main)`:
- `/dashboard`
- `/editor/[projectId]`
- `/onboarding`
- `/settings`

### API Routes
Present under `src/app/api`:
- `/api/ai/groq`
- `/api/ai/inpaint`
- `/api/ai/workers`
- `/api/auth/callback`
- `/api/stripe/checkout`
- `/api/stripe/portal`
- `/api/stripe/webhook`

Assessment:
- previously documented Paystack and NowPayments API routes are no longer present
- Stripe is the only active billing route surface in the current repo
- AI routes are explicitly server-mediated rather than direct client-secret exposure

## Feature Audit

### Authentication
Verified surfaces:
- sign-in UI
- sign-up UI
- social auth component
- `useUser` hook
- server-side auth actions
- callback route and middleware support

Assessment:
- auth is structurally present
- correctness of all auth flows was not runtime-tested in this audit

### Dashboard
Verified surfaces:
- dashboard page
- dashboard client component
- empty state
- project cards
- dashboard controls hook
- server actions
- project normalization helper

Verified contract:
- dashboard reads `projects`
- dashboard deletes user-owned `projects`

### Editor
Verified surfaces include:
- `EditorClient`
- `Canvas`
- `EditorShell`
- upload, text, layers, effects, erase, rewrite, export, and background panels
- toolbar panels for AI tools, brand kit, effects, batch processing, info, remove, and stamp
- OCR engine and worker
- export utilities
- inpainting helpers
- layer system helpers

Assessment:
- editor surface is substantial and already partitioned into features/components/lib
- this is not a placeholder editor
- persistence and export are first-class concerns in the current codebase

## Persistence Audit

### Verified Persistence Structures
Present in `supabase/schema.sql` and migration:
- `projects`
- `user_subscriptions`
- `brand_kits`
- `ai_usage_logs`
- `payment_references`
- `crypto_payments`

### Projects Contract
Verified fields:
- `id`
- `user_id`
- `name`
- `canvas_data`
- `original_image_url`
- `created_at`
- `updated_at`

Verified safeguards:
- row-level security enabled
- ownership policy present
- update trigger for `updated_at`
- supporting indexes present

Assessment:
- the earlier schema contradiction has been closed; `projects` now exists in checked-in schema
- there is some schema breadth beyond the currently active product path, especially around deferred payment tables

## Environment Audit

### Verified Core Environment Variables
Present in `.env.example`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL`

### Verified AI Variables
- `GROQ_API_KEY`
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`

### Verified Billing Variables
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_PRO_MONTHLY_PRICE_ID`
- `STRIPE_PRO_YEARLY_PRICE_ID`
- `STRIPE_ENTERPRISE_MONTHLY_PRICE_ID`

### Verified Email Variables
- `MAILGUN_API_KEY`
- `MAILGUN_DOMAIN`
- `MAILGUN_FROM_EMAIL`

### Verified Runtime Env Validation Helpers
Present:
- `src/shared/lib/env/server.ts`
- `src/shared/lib/env/providers.ts`
- `src/shared/lib/env/email.ts`

Assessment:
- the repo now includes explicit fail-fast helpers for server, Stripe, Groq, Cloudflare, and Mailgun env requirements
- env discipline exists, but not all routes/components are guaranteed to consume a single centralized env manifest yet

## Security Audit

### Verified Controls Present
- auth middleware for route protection
- Stripe webhook signature handling route
- CSP and security headers in `vercel.json`
- in-memory API rate limiting helpers
- upload validation helper with MIME and size checks
- server-side provider env requirement guards

### Constraints / Caveats
- rate limiting is in-memory, so limits are instance-local and not globally shared across serverless instances
- no durable abuse-control store is verified in the repo
- no antivirus or deep file inspection path is verified
- no explicit secret rotation procedure is verified in code; that belongs to operational docs/process

Assessment:
- security posture is materially stronger than earlier repo state
- abuse controls and distributed rate limiting remain incomplete for a true high-scale production posture

## CI / Delivery Audit

### GitHub Actions
Verified workflow: `.github/workflows/ci.yml`

Jobs:
- `validate`
  - checkout
  - setup node 20
  - `npm ci --legacy-peer-deps`
  - `npm run lint`
  - `npm run typecheck`
  - `npm run build`
  - `npm run smoke:projects`
  - `npm run smoke:providers`
- `deploy`
  - gated on `validate`
  - production deploy to Vercel on push to `main`

Assessment:
- CI is now validation-first before deployment
- workflow naming is aligned to Photune
- there is still no deeper automated regression coverage beyond lint/typecheck/build/smoke

## Branding / Identity Audit
Verified current primary identity:
- package name: `photune`
- site config name: `Photune`
- workflow name: `Photune CI and Deploy`
- root schema and docs primarily use `Photune`

Historical lineage still visible:
- `photext.shop` remains relevant as predecessor context in docs
- legacy references may still exist in older design/notes docs

Assessment:
- canonical product identity is substantially normalized to Photune
- follow-up grep-based cleanup may still be warranted for stale historical references outside core product/runtime files

## Operational Readiness Assessment
Present in repository:
- devcontainer
- CI workflow
- Vercel config
- `.env.example`
- operational documents (`DEPLOYMENT.md`, `RUNBOOK.md`, `ROLLBACK.md`, `OBSERVABILITY.md`, `SECURITY.md`)
- smoke scripts

Not proven by this audit:
- deployment success from current commit
- end-to-end database provisioning from clean environment
- recovery exercises
- alert wiring
- production telemetry ingestion

## Audit Conclusions
1. The repository is materially more coherent than the earlier repo snapshot implied.
2. The `projects` persistence contract now exists in checked-in schema and migration artifacts.
3. Stripe is the active billing provider in code paths; Paystack and NowPayments have been removed from active routes but still leave historical schema/docs residue.
4. Mailgun is the active transactional email provider in code and env surface.
5. The repository has a real validation baseline through lint, typecheck, build, and targeted smoke checks.
6. Security and operational posture have improved, but some controls remain baseline rather than production-hardened at scale.
7. The primary remaining risk is not greenfield implementation; it is drift between code, schema breadth, and documentation.

## Highest-Priority Audit Findings

### P0
1. Ensure all audit/kernel docs reflect the current Stripe-only active billing route surface.
2. Keep `projects` schema, migration, and app contract synchronized as a protected compatibility surface.
3. Preserve `check` and smoke coverage as mandatory validation gates for all future changes.

### P1
1. Reduce or quarantine deferred payment tables/docs that are no longer part of the active runtime path.
2. Expand automated regression coverage beyond lint/typecheck/build/smoke.
3. Replace instance-local rate limiting with a distributed control if higher-volume production use is expected.

### P2
1. Audit the necessity of `reactStrictMode: false` and re-enable when editor lifecycle stability allows.
2. Normalize older historical docs so architectural drift does not re-enter through stale guidance.
