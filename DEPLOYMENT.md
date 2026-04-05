# DEPLOYMENT

## Purpose
This document defines the deployment contract for Photune.

Photune is a Vercel-deployed Next.js application with:
- Supabase for auth and persistence
- Stripe for canonical billing
- Mailgun for canonical transactional email
- Groq for text AI operations
- Cloudflare for image / worker-backed AI operations

Deployment is not considered valid unless code, schema, environment, and provider assumptions are aligned.

---

## Canonical Deployment Topology

### Application Runtime
- Platform: Vercel
- Framework: Next.js App Router
- Package manager: npm
- Validation entrypoint: `npm run check`

### External Dependencies
- Supabase
  - auth
  - database
- Stripe
  - checkout
  - billing portal
  - webhook-backed entitlement updates
- Mailgun
  - transactional email
- Groq
  - text generation / rewrite
- Cloudflare
  - image / worker-backed AI routes

### Deferred / Non-Canonical Providers
These may still exist in the repository during transition, but they are not approved for expansion:
- Paystack
- NowPayments
- Resend

Deployment must not introduce new runtime dependence on deferred providers without an explicit decision update.

---

## Deployment Invariants

A deployment is valid only if all of the following are true:

1. Product identity is consistent as `Photune`
2. `npm run check` passes
3. checked-in schema and app code agree on persistence contracts
4. required environment variables exist in the target environment
5. canonical provider paths are configured for the exercised features
6. rollback path is known before deploy
7. no unresolved critical production incident is in progress

---

## Required Pre-Deploy Validation

Run from repo root:

```bash
npm ci --legacy-peer-deps
npm run check

This must prove:
	•	ESLint passes at enforcement level
	•	TypeScript typecheck passes
	•	production build passes
	•	smoke checks pass

If npm run check fails, deployment is blocked.

⸻

Environment Classes

1. Local

Purpose:
	•	development
	•	targeted debugging
	•	pre-merge verification

Minimum expected:
	•	NEXT_PUBLIC_SUPABASE_URL
	•	NEXT_PUBLIC_SUPABASE_ANON_KEY
	•	NEXT_PUBLIC_SITE_URL

Add provider variables only for flows being exercised locally.

2. Preview

Purpose:
	•	branch validation
	•	feature review
	•	pre-production confidence

Requirements:
	•	environment values sufficient for exercised routes
	•	safe callback URLs
	•	no hidden production-only assumptions

Preview must be treated as a real validation surface, not a cosmetic build target.

3. Production

Purpose:
	•	live user traffic

Requirements:
	•	all canonical provider variables are present
	•	webhook secrets are configured
	•	stable site URL is configured
	•	current schema is compatible with deployed code
	•	deployment originates from validated main branch state

⸻

Required Environment Surface

See:
	•	.env.example
	•	ENVIRONMENT_MATRIX.md

At minimum, production deployment must satisfy:

Core
	•	NEXT_PUBLIC_SUPABASE_URL
	•	NEXT_PUBLIC_SUPABASE_ANON_KEY
	•	NEXT_PUBLIC_SITE_URL

Stripe
	•	STRIPE_SECRET_KEY
	•	NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
	•	STRIPE_WEBHOOK_SECRET
	•	STRIPE_PRO_MONTHLY_PRICE_ID
	•	STRIPE_PRO_YEARLY_PRICE_ID
	•	STRIPE_ENTERPRISE_MONTHLY_PRICE_ID

Mailgun
	•	MAILGUN_API_KEY
	•	MAILGUN_DOMAIN
	•	MAILGUN_FROM_EMAIL

Groq
	•	GROQ_API_KEY

Cloudflare
	•	CLOUDFLARE_ACCOUNT_ID
	•	CLOUDFLARE_API_TOKEN

Deployment should fail fast when required server env vars are absent.

⸻

Schema and Migration Discipline

Photune is not deployable if application code depends on database structures that are not represented in checked-in schema/migrations.

Rules:
	1.	migrations must be committed to the repo
	2.	checked-in schema must reflect the intended current state
	3.	schema changes must land before dependent app code
	4.	ad hoc production database mutation without repo capture is not acceptable

Special attention areas:
	•	projects
	•	subscription persistence
	•	ownership / user-scoped access assumptions

⸻

Canonical Deployment Paths

Path A — CI-Driven Production Deployment

Preferred path.

Trigger:
	•	push to main

Expected CI order:
	1.	checkout
	2.	install
	3.	lint
	4.	typecheck
	5.	build
	6.	smoke
	7.	deploy to Vercel

Deployment must be gated on validation success.

Path B — Manual Production Deployment

Use only when necessary.

Required steps:

npm ci --legacy-peer-deps
npm run check
vercel pull --yes --environment=production
vercel build --prod
vercel deploy --prebuilt --prod

Manual deployment is invalid if the validation step is skipped.

⸻

Deployment Procedure

Step 1 — Confirm Repo State

Verify:
	•	correct branch
	•	clean or intentionally understood working tree
	•	no unreviewed local mutations
	•	no missing committed migrations/docs relevant to the release

Recommended:

git status --short
git rev-parse --abbrev-ref HEAD
git rev-parse HEAD

Step 2 — Validate Locally or in CI

Run:

npm ci --legacy-peer-deps
npm run check

Do not proceed on partial success.

Step 3 — Confirm Environment Readiness

Verify target environment contains the required canonical provider variables.

Check especially:
	•	Supabase public values
	•	Stripe secret + webhook secret
	•	Mailgun credentials
	•	Groq key
	•	Cloudflare account/token
	•	correct NEXT_PUBLIC_SITE_URL

Step 4 — Confirm Schema Readiness

Verify:
	•	required migration files exist
	•	checked-in schema matches expected runtime contract
	•	no pending out-of-band schema dependency exists

Step 5 — Deploy

Use either:
	•	validated CI push to main
	•	manual Vercel deployment after successful local validation

Step 6 — Post-Deploy Verification

Immediately verify:
	1.	/
	2.	/login
	3.	authenticated /dashboard
	4.	/editor/[projectId] for an existing project
	5.	one save/load project cycle
	6.	upgrade entrypoint loads
	7.	logs show no immediate regression spike

⸻

Post-Deploy Verification Checklist

Public Surface
	•	landing page loads
	•	no immediate console/runtime crash
	•	metadata/branding reflect Photune

Auth
	•	login page loads
	•	signup/auth callback flow is functional
	•	authenticated redirect behavior is sane

Projects
	•	dashboard loads projects
	•	existing project opens
	•	save and reload work
	•	owner-scoped access assumptions still hold

Billing
	•	upgrade modal opens
	•	Stripe checkout route responds
	•	portal route responds for eligible users

AI
	•	at least one text AI route behaves normally
	•	at least one Cloudflare-backed route behaves normally if enabled in that environment

Logs
	•	no repeated fatal route errors
	•	no obvious provider auth failures
	•	no webhook/config regression symptoms

⸻

Abort Conditions

Stop deployment or treat the release as failed if any of the following occur:
	•	npm run check fails
	•	required environment values are missing
	•	schema/app contracts are mismatched
	•	canonical provider path is broken for an exercised feature
	•	smoke tests fail
	•	deployment succeeds but post-deploy verification fails

⸻

Release Record Minimum

Each production release should record:
	•	commit SHA
	•	deployment time
	•	summary of change
	•	whether schema changed
	•	whether env changed
	•	provider changes, if any
	•	known risks
	•	rollback target or last known-good deployment

⸻

High-Risk Deployment Categories

Treat the following as medium/high-risk releases:
	•	auth/session changes
	•	schema changes
	•	project persistence changes
	•	Stripe/webhook changes
	•	provider-routing changes
	•	middleware changes
	•	environment variable contract changes

For these:
	•	minimize blast radius
	•	validate preview behavior first
	•	verify rollback path before deploy
	•	perform explicit post-deploy checks

⸻

What Deployment Does Not Guarantee

A green deployment does not automatically prove:
	•	billing webhooks are fully healthy
	•	all AI providers are healthy
	•	all user-specific project states are intact
	•	no latent runtime issue exists under production traffic

That is why post-deploy verification and rollback readiness are mandatory.

