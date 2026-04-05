# SYSTEM_INVENTORY

## 1. Application Runtime

### Framework
- Next.js App Router
- React 18
- TypeScript 5

### Package Manager
- npm
- lockfile present: `package-lock.json`

### Current NPM Scripts
- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`

## 2. Source Topology

### Root
- `.devcontainer/`
- `.github/workflows/`
- `public/`
- `src/`
- `supabase/`
- `.env.example`
- `next.config.mjs`
- `vercel.json`
- `package.json`

### `src/`
- `app/`
- `features/`
- `shared/`
- `types/`
- `middleware.ts`

## 3. Route Inventory

### Public / Root
- `/` → landing page
- `not-found` route present

### Auth Route Group: `src/app/(auth)`
- `/auth`
- `/login`
- `/signup`

### Main App Route Group: `src/app/(main)`
- `/dashboard`
- `/editor/[projectId]`
- `/onboarding`
- `/settings`

### API Route Groups: `src/app/api`
- `/api/ai/groq`
- `/api/ai/inpaint`
- `/api/ai/workers`
- `/api/auth/callback`
- `/api/payments/crypto`
- `/api/payments/paystack`
- `/api/stripe/checkout`
- `/api/stripe/portal`
- `/api/stripe/webhook`

## 4. Feature Inventory

### `src/features/authentication`
Purpose:
- sign-in / sign-up UI and auth feature components

### `src/features/dashboard`
Purpose:
- project listing
- project deletion
- dashboard presentation

Confirmed behavior:
- queries `projects`
- deletes from `projects`

### `src/features/editor`
Purpose:
- editor shell
- canvas
- toolbar/sidebar
- job status
- editor eventing and save workflow

Confirmed behavior:
- editor dispatches `photune-save`
- loads `canvas_data` from project records
- assumes background image rehydration with CORS-safe reloads

## 5. Shared Module Inventory

### `src/shared/config`
- `site.ts`
- current site config still names the product `phoTextAI`

### `src/shared/lib`
Observed modules:
- `supabase/`
- `ai-client.ts`
- `email.ts`
- `photune-ai.ts`
- `stripe-client.ts`
- `stripe.ts`
- `subscription.ts`
- `utils.ts`

Note: `paystack.ts` and `nowpayments.ts` removed (Batches 3-4)

### `src/shared/store`
- Zustand-backed editor/application state

### `src/shared/templates/email`
- email template directory exists

## 6. Persistence Inventory

### Checked-in SQL Schema
File:
- `supabase/schema.sql`

Tables present:
- `user_subscriptions`
- `brand_kits`
- `ai_usage_logs`
- `payment_references`
- `crypto_payments`

### Persistence Expectations in App Code
Required but absent from checked-in schema:
- `projects`

Expected `projects` fields from code/README:
- `id`
- `user_id`
- `name`
- `canvas_data`
- `original_image_url`
- timestamps

## 7. Auth Inventory

### Provider
- Supabase Auth via `@supabase/ssr`

### Clients
- browser client in `src/shared/lib/supabase/client.ts`
- server client in `src/shared/lib/supabase/server.ts`

### Session / Guarding
- middleware refreshes/gets user
- protects `/dashboard`, `/editor`, `/onboarding`
- redirects authenticated users away from auth pages

### Callback
- `/api/auth/callback`
- exchanges auth code for session
- redirects to `/dashboard` on success

## 8. AI Inventory

### Browser-side AI usage
- `ai-client.ts` uses `puter` when available
- fallback path calls `/api/ai/workers`

### Server-side AI routes
- Groq proxy for chat completions
- Cloudflare inpaint route
- Cloudflare workers route for image gen / text gen

### AI Operations Explicitly Referenced
- rewrite
- font detection / matching
- captioning
- inpainting
- image generation

## 9. Payment Inventory

### Stripe
- checkout route
- portal route
- webhook route
- shared Stripe library
- `user_subscriptions` table integration

### Paystack
- shared paystack library
- `payment_references` table suggests persistence for paystack/stripe
- API route subtree exists

### Crypto / NowPayments
- shared crypto library
- `crypto_payments` table
- API route subtree exists
- helper explicitly notes production webhook verification is incomplete

## 10. Email Inventory
- `mailgun.js` dependency
- checked shared email implementation uses Mailgun

## 11. Deployment Inventory

### Hosting
- Vercel is the explicit deployment target

### Deployment Config
- `vercel.json`
- immutable cache for `/fonts/*`
- minimal global headers

### CI/CD
- `.github/workflows/ci.yml`
- deploys through Vercel CLI
- production-oriented workflow
- no separate hard validation stage

## 12. Observability / Ops Inventory
Present:
- some console logging in server actions / API handlers

Missing:
- structured logging
- tracing
- metrics
- uptime checks
- alerting
- incident/runbook docs
- rollback automation

## 13. Dependency Risk Summary

### High-confidence production dependencies
- Next.js
- React
- Supabase
- Fabric.js
- Tesseract.js
- Stripe

### Scope-expanding dependencies
- Mailgun
- Resend
- Paystack
- NowPayments
- Groq
- Cloudflare AI
- Puter runtime integration

These are not yet reduced to a disciplined production boundary.

