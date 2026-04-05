# PRE_DEPLOY_CHECKLIST

## Purpose
This checklist is the release gate for Photune.

Do not deploy because the app “looks fine.”
Deploy only when the checks below are complete and the release is understood.

This checklist applies to preview and production, with stricter enforcement for production.

---

## 1. Release Intent

- [ ] The purpose of this release is clear
- [ ] The exact scope of change is known
- [ ] Unrelated work is not bundled into this release
- [ ] User-facing naming/copy remains consistent as `Photune`
- [ ] Risk level has been classified: Low / Medium / High
- [ ] Rollback path is known before deployment

If the release purpose or rollback path is unclear, stop here.

---

## 2. Repo State

- [ ] Correct branch is checked out
- [ ] Working tree is clean, or all local changes are intentional and understood
- [ ] Required files are committed
- [ ] No local-only fixes are being relied on for deployment
- [ ] Commit SHA to be deployed is known

Suggested commands:

```bash
git status --short
git rev-parse --abbrev-ref HEAD
git rev-parse HEAD


⸻

3. Validation Gate

Required from repo root:

npm ci --legacy-peer-deps
npm run check

	•	npm ci --legacy-peer-deps passed
	•	npm run lint passed
	•	npm run typecheck passed
	•	npm run build passed
	•	npm run smoke passed
	•	npm run check passed

If any validation step fails, deployment is blocked.

⸻

4. Schema and Persistence Readiness
	•	Checked-in migrations reflect the intended runtime state
	•	Checked-in schema matches the current app contract
	•	projects contract remains valid
	•	No out-of-band database change is required but undocumented
	•	Any schema-affecting change has explicit compatibility notes

If schema changed:
	•	migration files are present in repo
	•	blast radius is understood
	•	rollback or forward-fix path is known
	•	dependent routes/features were validated

High-risk schema areas:
	•	projects
	•	subscription persistence
	•	owner-scoped access behavior

⸻

5. Environment Readiness

Core
	•	NEXT_PUBLIC_SUPABASE_URL is present and correct
	•	NEXT_PUBLIC_SUPABASE_ANON_KEY is present and correct
	•	NEXT_PUBLIC_SITE_URL is correct for target environment

Stripe
	•	STRIPE_SECRET_KEY is present
	•	NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is present
	•	STRIPE_WEBHOOK_SECRET is present
	•	Stripe price IDs are present and correct

Mailgun
	•	MAILGUN_API_KEY is present
	•	MAILGUN_DOMAIN is present
	•	MAILGUN_FROM_EMAIL is present

Groq
	•	GROQ_API_KEY is present

Cloudflare
	•	CLOUDFLARE_ACCOUNT_ID is present
	•	CLOUDFLARE_API_TOKEN is present
	•	Deferred providers are not being activated accidentally
	•	Environment differences between preview and production are understood

If env correctness is uncertain, deployment is blocked.

⸻

6. Provider Discipline

Canonical providers:
	•	Stripe
	•	Mailgun
	•	Groq
	•	Cloudflare

Deferred providers:
	•	Paystack
	•	NowPayments
	•	Resend

Required checks:
	•	npm run smoke:providers passed
	•	provider inventory has been reviewed if provider-related code changed
	•	no new deferred-provider spread exists in runtime paths

Suggested commands:

npm run smoke:providers
./scripts/provider-inventory.sh


⸻

7. Route and Flow Readiness

Before deployment, confirm the release is expected to preserve the following in the target environment:
	•	landing page
	•	login route
	•	signup/auth callback path
	•	authenticated dashboard load
	•	editor route for an existing project
	•	project save/load cycle
	•	upgrade entrypoint
	•	Stripe checkout initiation
	•	at least one active AI route relevant to the release

If the release affects any of these flows, explicit post-deploy verification is mandatory.

⸻

8. Logging and Diagnostics Readiness
	•	Sufficient logs exist to diagnose the changed surface
	•	No secrets are logged by the changed code
	•	Operator knows where to inspect logs after deploy
	•	High-risk route changes include a diagnosis path

Reference:
	•	LOGGING_STANDARD.md
	•	OBSERVABILITY.md

⸻

9. Deployment Path Readiness
	•	Deployment path is known: CI-driven or manual
	•	CI is healthy for this branch/release
	•	Manual deploy steps are understood if CI path is unavailable
	•	Last known-good deployment is identifiable
	•	Release owner and verifier are known

Reference:
	•	DEPLOYMENT.md
	•	ROLLBACK.md

⸻

10. Production Approval Gate

Required before production deploy:
	•	Release summary is prepared
	•	Known risks are written down
	•	High-risk changes are explicitly acknowledged
	•	Rollback trigger conditions are known
	•	Rollback target is known
	•	A post-deploy verifier is assigned
	•	Current incident state does not make deployment unsafe

If any production approval item is unknown, do not deploy.

⸻

11. Post-Deploy Verification Plan

A deployment is not complete at “deploy succeeded.”

Immediately after deploy, verify:
	•	/ loads
	•	/login loads
	•	authenticated /dashboard loads
	•	existing project opens in /editor/[projectId]
	•	one save/load cycle works
	•	upgrade modal loads
	•	Stripe checkout route behaves correctly
	•	at least one active AI flow behaves correctly
	•	logs show no immediate regression spike

If any of these fail, treat the release as suspect and evaluate rollback.

⸻

12. Stop Conditions

Stop and do not deploy if any of the following are true:
	•	validation failed
	•	required env values are uncertain or missing
	•	schema compatibility is uncertain
	•	provider path is unclear
	•	rollback target is unknown
	•	release scope is not well understood
	•	user-facing risk is high and unmitigated

Any checked item in this section blocks deployment.

