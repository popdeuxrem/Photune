# RUNBOOK

## Purpose
This runbook defines the standard operating procedure for validating, diagnosing, and recovering the current Photune system.

Use this document when:
- local validation fails
- preview or production behavior regresses
- a route or provider integration breaks
- schema/app assumptions drift
- a release must be assessed or recovered quickly

This runbook is for the current bounded product:
- Vercel-hosted Next.js app
- Supabase auth and persistence
- Stripe billing
- Mailgun email
- Groq text AI
- Cloudflare image / worker-backed AI routes

---

## Core Operating Rule

Debug in this order:

1. reproduce
2. isolate
3. patch minimally
4. verify
5. prevent recurrence

Do not skip directly to broad rewrites.
Do not assume code failure when the issue may be config, schema, or provider related.

---

## Canonical Validation Commands

### Full validation
Run from repo root:

```bash
npm ci --legacy-peer-deps
npm run check

Individual validation steps

npm run lint
npm run typecheck
npm run build
npm run smoke

Smoke subsets

npm run smoke:projects
npm run smoke:providers

Provider inventory

./scripts/provider-inventory.sh


⸻

Standard Triage Flow

Step 1 — Classify the failure

Determine whether the issue is primarily:
	•	code
	•	configuration
	•	schema/data
	•	provider/integration
	•	deployment/runtime environment

Step 2 — Establish blast radius

Determine:
	•	one route or many
	•	one user or many
	•	local only, preview only, or production
	•	read path, write path, or billing/auth path

Step 3 — Reproduce deterministically

Use the narrowest repeatable path possible.

Examples:
	•	open /login
	•	load /dashboard
	•	open /editor/[projectId]
	•	invoke checkout
	•	run npm run smoke:projects

Step 4 — Isolate the contract

Identify which contract failed:
	•	env presence
	•	route logic
	•	Supabase query
	•	ownership check
	•	provider credential
	•	webhook verification
	•	build/type contract

Step 5 — Patch minimally

Prefer:
	•	one-file fixes
	•	exact-line fixes
	•	config correction over code mutation when appropriate

Avoid:
	•	dependency churn
	•	opportunistic refactors
	•	unrelated cleanup during incident response

Step 6 — Verify

Re-run the smallest relevant check first, then broader validation.

Step 7 — Prevent recurrence

If the issue exposed a missing guard, add:
	•	a smoke check
	•	a validation script
	•	a doc update
	•	a logging improvement

⸻

Known Good Validation Baseline

A healthy current baseline means all of the following pass:
	•	npm run lint
	•	npm run typecheck
	•	npm run build
	•	npm run smoke
	•	npm run check

If any of these regress, do not treat the repo as release-ready.

⸻

Failure Classes and Response

1. Local Validation Failure

Symptoms
	•	npm run lint fails
	•	npm run typecheck fails
	•	npm run build fails
	•	npm run smoke fails

Likely Causes
	•	broken source edit
	•	schema/app contract drift
	•	provider-policy drift
	•	missing local env assumptions during build
	•	case/path issues

Actions
	1.	run:

npm run lint
npm run typecheck
npm run build
npm run smoke


	2.	identify the first failing step
	3.	inspect only the implicated files/contracts
	4.	patch minimally
	5.	rerun the failing step before rerunning all checks

⸻

2. Dashboard Fails to Load Projects

Symptoms
	•	dashboard errors or redirects unexpectedly
	•	projects missing unexpectedly
	•	project query failure

Likely Causes
	•	Supabase auth/session issue
	•	projects schema drift
	•	owner-scoped query mismatch
	•	broken dashboard read path

Checks

npm run smoke:projects
grep -RIn --exclude-dir=node_modules --exclude-dir=.next \
  -e ".from('projects')" \
  -e '.from("projects")' \
  src

Verify
	•	authenticated user exists
	•	projects table exists in checked-in schema/migrations
	•	dashboard and editor still query projects
	•	owner scope is enforced where required

⸻

3. Editor Fails to Load or Save

Symptoms
	•	editor route loads blank or crashes
	•	existing project will not open
	•	save/load cycle fails

Likely Causes
	•	bad route param handling
	•	broken project fetch
	•	invalid canvas_data
	•	serialization/deserialization regression
	•	project ownership/access issue

Checks
	1.	open a known existing project
	2.	inspect route/server logs
	3.	verify projects query path
	4.	verify save path if recently changed
	5.	rerun npm run smoke:projects

Recovery
	•	patch exact read/save contract
	•	avoid broad editor refactors during incident response

⸻

4. Login or Auth Callback Failure

Symptoms
	•	login page loads but auth fails
	•	callback route errors
	•	authenticated routes redirect unexpectedly
	•	session is not restored

Likely Causes
	•	wrong Supabase env values
	•	callback URL mismatch
	•	middleware regression
	•	auth code exchange failure

Checks
	•	verify:
	•	NEXT_PUBLIC_SUPABASE_URL
	•	NEXT_PUBLIC_SUPABASE_ANON_KEY
	•	NEXT_PUBLIC_SITE_URL
	•	inspect callback route behavior
	•	inspect middleware behavior on:
	•	/login
	•	/dashboard
	•	/editor/[projectId]

Recovery
	•	correct env/config first if wrong
	•	patch middleware/callback only if code is clearly at fault

⸻

5. Billing Flow Failure

Symptoms
	•	upgrade modal loads but checkout fails
	•	billing portal fails
	•	user entitlement does not update
	•	webhook-driven state does not reconcile

Likely Causes
	•	missing Stripe env vars
	•	wrong Stripe price IDs
	•	wrong webhook secret
	•	route regression
	•	provider drift introduced into runtime

Checks

Verify presence of:
	•	STRIPE_SECRET_KEY
	•	NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
	•	STRIPE_WEBHOOK_SECRET
	•	Stripe price IDs

Run:

npm run smoke:providers
./scripts/provider-inventory.sh

Recovery
	•	correct Stripe env/config first
	•	verify canonical provider path remains Stripe
	•	do not re-enable deferred billing providers as a shortcut

⸻

6. Email Delivery Failure

Symptoms
	•	transactional emails fail
	•	auth or billing-adjacent email behavior breaks

Likely Causes
	•	missing Mailgun env vars
	•	Mailgun implementation regression
	•	provider drift toward deferred email path

Checks

Verify:
	•	MAILGUN_API_KEY
	•	MAILGUN_DOMAIN
	•	MAILGUN_FROM_EMAIL

Search for drift:

./scripts/provider-inventory.sh

Recovery
	•	fix Mailgun config/implementation
	•	do not spread Resend usage without explicit decision update

⸻

7. AI Route Failure

Symptoms
	•	rewrite fails
	•	inpaint fails
	•	worker-backed AI route errors
	•	only some AI operations fail

Likely Causes
	•	missing Groq or Cloudflare env
	•	provider-specific route failure
	•	request payload regression
	•	provider outage or auth failure

Checks

Verify:
	•	GROQ_API_KEY
	•	CLOUDFLARE_ACCOUNT_ID
	•	CLOUDFLARE_API_TOKEN

Classify failure:
	•	text path
	•	image path
	•	worker-backed path

Recovery
	•	patch provider-specific route/config only
	•	avoid broad AI abstraction rewrites during incident response

⸻

8. Provider Policy Smoke Failure

Symptoms
	•	npm run smoke:providers fails
	•	CI reports deferred provider usage in disallowed path

Meaning

A deferred provider reference has appeared in a runtime location where policy forbids it.

Checks

Run:

npm run smoke:providers
./scripts/provider-inventory.sh

Inspect the exact offending file(s).

Recovery
	•	remove or quarantine the deferred provider reference
	•	if the failure is a false positive, narrow the test with evidence
	•	do not disable the smoke test to make CI green

⸻

9. Build Passes but Production Fails

Symptoms
	•	CI green
	•	deployment succeeds
	•	runtime route breaks in preview/production

Likely Causes
	•	missing env/config in deployed environment
	•	browser/server boundary issue
	•	provider secret mismatch
	•	untested live-only path

Checks
	1.	compare local/preview/production environment assumptions
	2.	inspect Vercel logs
	3.	inspect provider dashboards if relevant
	4.	verify the exact failing route manually

Recovery

Classify as:
	•	code rollback candidate
	•	config correction
	•	schema compatibility issue

Use ROLLBACK.md if user-facing impact is significant.

⸻

High-Risk Areas

Treat any issue involving these areas as higher risk:
	•	auth/session handling
	•	projects persistence
	•	Stripe checkout/portal/webhook
	•	schema changes
	•	middleware changes
	•	env contract changes
	•	provider routing changes

For these:
	•	narrow blast radius first
	•	verify rollback path before risky mutation
	•	require explicit post-fix verification

⸻

Quick Diagnostic Commands

Repo state

git status --short
git rev-parse --abbrev-ref HEAD
git rev-parse HEAD

Dependency/runtime info

node -v
npm -v

Full validation

npm run check

Security header sanity check

python3 -m json.tool vercel.json >/dev/null
grep -n "Content-Security-Policy" vercel.json

Projects contract

npm run smoke:projects

Provider policy

npm run smoke:providers
./scripts/provider-inventory.sh

Find project queries

grep -RIn --exclude-dir=node_modules --exclude-dir=.next \
  -e ".from('projects')" \
  -e '.from("projects")' \
  src

Find deferred provider references

grep -RIn --exclude-dir=node_modules --exclude-dir=.next \
  -e 'paystack' -e 'PAYSTACK_' \
  -e 'nowpayments' -e 'NOWPAYMENTS_' \
  -e 'resend' -e 'RESEND_' \
  src .env.example package.json


⸻

Incident Record Minimum

For any meaningful issue, record:
	•	timestamp first observed
	•	affected surface
	•	severity / blast radius
	•	classification: code, config, schema, provider, deployment
	•	exact command or route used to reproduce
	•	fix applied
	•	validation commands rerun
	•	whether rollback was needed

⸻

Closure Criteria

Do not close an incident until:
	1.	the issue is reproduced or clearly classified
	2.	the minimal fix is applied
	3.	the relevant validation passes
	4.	broader validation is rerun when appropriate
	5.	any missing guardrail is documented or added
	6.	rollback is no longer required

⸻

Escalation Rule

Escalate immediately when the issue involves:
	•	auth outage
	•	dashboard or editor persistence outage
	•	billing failure affecting users
	•	schema corruption risk
	•	production env/secret drift
	•	repeated deployment failure with unclear root cause

