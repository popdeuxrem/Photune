# REPO_AUDIT

## Repository
- Name: `Photune`
- Visibility: Public
- Default branch: `main`

## Executive Assessment
This repository is an incomplete production candidate.

It is not an empty starter and not a coherent production system yet. It already contains:
- Next.js 14 App Router application structure
- Supabase SSR auth/session integration
- Browser-side editor stack (`fabric`, `tesseract.js`, `zustand`)
- AI proxy routes
- Stripe, Paystack, and crypto payment surfaces
- Vercel deployment configuration
- GitHub Actions deployment workflow

However, the current repo has material contradictions across:
- product naming
- documented vs actual persistence model
- external service scope
- CI/CD validation discipline
- security posture
- deployment readiness

## Observed Stack

### Runtime / Framework
- Node-oriented devcontainer based on Node 20
- Next.js `^14.2.3`
- React `^18.2.0`
- TypeScript `^5`

### Frontend / Editor
- Fabric.js `5.3.0`
- Tesseract.js `^5.1.0`
- Zustand `^4.5.2`
- Radix UI
- Tailwind CSS

### Backend / Platform
- Supabase SSR + Supabase JS
- Stripe
- Mailgun
- Resend dependency present
- Cloudflare AI credentials expected
- Groq API credentials expected
- Paystack credentials expected
- NowPayments credentials expected

## Source Layout

### `src/app`
Route groups and route handlers exist for:
- `(auth)` → `auth`, `login`, `signup`
- `(main)` → `dashboard`, `editor/[projectId]`, `onboarding`, `settings`
- `api` → `ai`, `auth/callback`, `payments`, `stripe`
- root routes → `layout.tsx`, `page.tsx`, `not-found.tsx`

### `src/features`
Domain slices:
- `authentication`
- `dashboard`
- `editor`

### `src/shared`
Shared system modules:
- `components`
- `config`
- `lib`
- `store`
- `templates/email`

### `src/types`
- `fabric.d.ts`

## Naming / Branding Audit
Observed identities in the current repo:
- Repository/package/app: `Photune`
- Site config: `phoTextAI`
- README title: `phoTextAI`
- README positioning: “alternative to photext.shop”
- Metadata URL: `https://photune.app`

This is a high-severity product identity split. It must be resolved before any production hardening.

## Package Script Audit
Current scripts:
- `dev`
- `build`
- `start`
- `lint`

Missing scripts:
- `typecheck`
- `test`
- `test:e2e`
- `check`
- `db:*`
- `smoke`
- `format`

This means the repo can build and lint, but cannot objectively prove correctness beyond those minimal gates.

## Route / Capability Audit

### Auth
Present:
- login/signup route group
- Supabase callback route
- middleware route protection

Assessment:
- auth path exists and is structurally coherent
- callback exchanges code for session and redirects to `/dashboard`

### Dashboard
Present:
- dashboard page
- project listing and delete actions

Assessment:
- dashboard logic expects a `projects` table
- this is incompatible with the checked-in `supabase/schema.sql`

### Editor
Present:
- editor route at `/editor/[projectId]`
- `EditorClient`
- keyboard shortcuts
- Fabric canvas import/export loading path

Assessment:
- editor load path explicitly reads from `projects`
- persistence contract is real in app code, but absent from checked-in schema

### AI
Present route groups:
- `/api/ai/groq`
- `/api/ai/inpaint`
- `/api/ai/workers`

Assessment:
- provider surface is inconsistent
- README references Puter.js + Cloudflare
- current code also includes Groq proxy and Cloudflare route handlers
- no explicit provider arbitration layer exists

### Payments
Present route groups:
- `/api/stripe/checkout`
- `/api/stripe/portal`
- `/api/stripe/webhook`

Removed:
- `/api/payments/crypto` (NowPayments, removed in Batch 3)
- `/api/payments/paystack` (removed in Batch 4)

Assessment:
- Stripe is now the sole active billing provider
- All deferred payment providers have been removed

## Data Model Audit
Checked-in schema defines:
- `user_subscriptions`
- `brand_kits`
- `ai_usage_logs`
- `payment_references`
- `crypto_payments`

App code additionally expects:
- `projects`

This is the most immediate persistence contradiction in the repository.

## Config Audit

### `next.config.mjs`
- `reactStrictMode: false`
- remote image patterns for Supabase, Puter, GitHub Codespaces, Vercel previews
- Webpack browser fallback disables `canvas`, `fs`, `path`

Assessment:
- editor/browser compatibility was considered
- strict mode is disabled, which reduces dev signal for unsafe effects

### `vercel.json`
- framework: nextjs
- install command uses `npm install --legacy-peer-deps`
- global security headers are minimal
- fonts receive immutable caching

Assessment:
- deploy path is Vercel-first
- header posture is incomplete for a production editor handling auth, uploads, and payment flows

### GitHub Actions
- one workflow: `ci.yml`
- behavior is deploy-oriented
- workflow name still references `phoTextAI`
- no separate validation job for lint/typecheck/test
- deploy path uses `vercel pull`, `vercel build`, `vercel deploy`

Assessment:
- current CI is not true CI; it is deployment automation with limited validation

## Security Audit
Observed:
- middleware route protection exists
- Supabase SSR cookie handling exists
- Stripe webhook signature verification exists
- Vercel headers include `nosniff`, `DENY`, and legacy XSS header
- no CSP observed
- no rate limiting layer observed
- no explicit upload validation policy observed
- crypto webhook helper explicitly says HMAC verification should be done properly in production

Assessment:
- partial hardening exists
- production security posture is incomplete

## Operational Readiness Audit
Present:
- devcontainer
- Vercel config
- GitHub Actions workflow
- `.env.example`

Missing:
- runbook
- deployment procedure
- rollback procedure
- observability guide
- environment matrix discipline
- smoke tests
- incident basics

## Priority Findings
1. Product identity is inconsistent.
2. App code requires `projects`, but checked-in schema does not define it.
3. Validation gates are inadequate for production work.
4. External service footprint is too broad for current repo maturity.
5. CI is deploy-first rather than validate-first.
6. Security posture is incomplete for a paid AI editor.

