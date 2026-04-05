# ROLLBACK

## Purpose
This document defines the rollback procedure for Photune.

Photune rollback must be:
- fast enough to reduce user impact
- explicit enough to avoid improvisation
- conservative around stateful systems
- verified after execution

Rollback is not only a deployment action. It may involve:
- code reversion
- configuration correction
- provider correction
- selective forward-fix
- deployment promotion to a last known-good build

---

## Rollback Principles

1. **Protect users first**
   - restore service before optimizing root-cause analysis depth

2. **Classify before changing**
   - determine whether failure is code, config, schema, provider, or mixed

3. **Prefer the smallest successful reversal**
   - config fix before full rollback when config is clearly at fault
   - app rollback before schema rollback when schema is stateful

4. **Do not improvise destructive database changes**
   - schema rollback is high risk
   - user data integrity takes precedence over symmetry

5. **Verify after rollback**
   - rollback is incomplete until core flows are revalidated

---

## Rollback Triggers

Consider rollback when any of the following occur after deploy:

### User-Facing Functional Failure
- login/signup/auth callback is broken
- dashboard is unavailable
- editor cannot open existing projects
- save/load project cycle is broken
- upgrade flow is broken
- core AI route used in production is non-functional

### Stability Failure
- widespread runtime exceptions
- repeated route crashes
- severe hydration/render regressions
- production-only failure not seen in preview/local validation

### Configuration / Provider Failure
- missing or incorrect env values
- invalid webhook secrets
- broken provider credentials
- wrong callback URL / site URL assumptions

### Contract Failure
- app code expects schema not present in production
- schema change is incompatible with deployed code
- ownership/access policy regression causes read/write failure

---

## Rollback Classification

## Class 1 — Code Regression
Examples:
- route logic bug
- component crash
- server handler regression
- bad conditional path
- broken client/server boundary

Primary response:
- revert to last known-good deployment or code state

## Class 2 — Configuration Regression
Examples:
- missing environment variable
- wrong Stripe webhook secret
- wrong Mailgun config
- wrong Supabase URL/key assumptions
- incorrect site URL

Primary response:
- correct config first
- redeploy only if required by platform/runtime behavior

## Class 3 — Provider Regression
Examples:
- Stripe outage or invalid auth
- Mailgun delivery/auth issue
- Groq or Cloudflare route failure
- Supabase service/config mismatch

Primary response:
- determine whether provider failure is external or self-inflicted
- isolate affected feature
- rollback app only if recent code/config introduced the failure

## Class 4 — Schema-Coupled Regression
Examples:
- `projects` table/column mismatch
- app code deployed before migration
- incompatible persistence contract
- broken entitlement persistence

Primary response:
- avoid destructive schema reversal
- prefer restoring compatible app version if possible
- use forward-fix when rollback would risk data loss or further inconsistency

## Class 5 — Mixed Failure
Examples:
- deploy included code + env + schema changes
- rollback candidate is not obvious
- multiple providers affected through shared config

Primary response:
- stop further changes
- isolate the first failing contract
- restore last known-good user path with the lowest-risk intervention

---

## Canonical Rollback Order

Use this sequence:

1. **Acknowledge and classify**
2. **Measure blast radius**
3. **Decide rollback class**
4. **Choose smallest safe reversal**
5. **Execute rollback or config correction**
6. **Verify core flows**
7. **Document incident**
8. **Plan preventive follow-up**

Do not skip classification unless the outage is obvious and severe enough to require immediate deployment restoration.

---

## Rollback Decision Matrix

### If the issue is clearly config-only
Use:
- config correction
- provider credential correction
- webhook/config revalidation

Do not rollback code unless config correction fails or code also changed the behavior.

### If the issue is clearly code-only
Use:
- Vercel rollback to last known-good deployment
- or git revert + validated redeploy

### If the issue involves schema compatibility
Use:
- app rollback only if old app remains compatible with current schema
- otherwise prefer controlled forward-fix

### If the issue affects billing/auth/persistence
Treat as higher risk.
Require:
- explicit verification after rollback
- log review
- confirmation that user-facing paths are healthy again

---

## Canonical Rollback Targets

### Target A — Last Known-Good Vercel Deployment
Preferred for stateless app regression.

Use when:
- problem began immediately after deploy
- previous deployment is known healthy
- schema is unchanged or backward-compatible

### Target B — Corrected Environment Configuration
Preferred for config-only failure.

Use when:
- code is known good
- symptoms point to missing/incorrect env or provider settings

### Target C — Forward Fix
Preferred for stateful/schema-coupled issues where rollback is unsafe.

Use when:
- rollback would strand data
- schema has already changed incompatibly
- reversal is riskier than a precise corrective patch

---

## Vercel Rollback Procedure

### Preconditions
- identify incident start time
- identify current production deployment
- identify last known-good production deployment
- confirm whether schema/env changed with the release

### Procedure
1. open Vercel deployment history
2. select the last known-good production deployment
3. restore/re-promote that deployment
4. verify the key routes immediately
5. inspect logs for continuing failures

### Required Verification After Vercel Rollback
Verify:
- `/`
- `/login`
- authenticated `/dashboard`
- `/editor/[projectId]` for a known-good project
- one save/load cycle if safe to test
- upgrade modal / Stripe entrypoint load

---

## Git Revert + Redeploy Procedure

Use when a formal rollback needs to be preserved in git history.

### Procedure
1. identify the bad commit(s)
2. create a revert commit
3. run:
   ```bash
   npm ci --legacy-peer-deps
   npm run check

	4.	deploy through the normal validated path
	5.	verify core routes and impacted features

Notes
	•	prefer revert over history rewriting on shared branches
	•	do not combine revert with unrelated cleanup

⸻

Configuration Rollback Procedure

Use when the root cause is environment/provider configuration.

Procedure
	1.	identify the incorrect variable/setting
	2.	correct only the affected values
	3.	confirm no unrelated config drift exists
	4.	redeploy only if platform/runtime behavior requires it
	5.	verify the exact affected flow

Typical Cases
	•	bad NEXT_PUBLIC_SITE_URL
	•	wrong STRIPE_WEBHOOK_SECRET
	•	missing Mailgun credentials
	•	missing Groq/Cloudflare vars
	•	wrong Supabase URL/key assumptions

⸻

Schema Rollback Constraints

Schema rollback is the highest-risk rollback class.

Rules
	•	do not drop or alter schema destructively without impact assessment
	•	do not assume reverse migration is safe
	•	do not rollback stateful changes purely for symmetry
	•	if new data has been written under the new schema, prefer forward remediation unless reversal is proven safe

For Photune Specifically

Pay close attention to:
	•	projects
	•	subscription state
	•	ownership/access assumptions
	•	webhook-driven persistence changes

Safer Alternatives
	•	restore compatible app code
	•	add a compatibility patch
	•	forward-migrate missing structures
	•	hotfix query assumptions

⸻

Provider-Specific Rollback Notes

Supabase

Rollback questions:
	•	is this auth config, query logic, or schema?
	•	are route protections still correct?
	•	are owner-scoped queries intact?

Stripe

Rollback questions:
	•	is checkout failing?
	•	is portal failing?
	•	is webhook verification failing?
	•	is entitlement state broken due to app logic or provider config?

Mailgun

Rollback questions:
	•	is delivery failing due to credentials, sender config, or code path?
	•	does the failure block an essential user workflow?

Groq / Cloudflare

Rollback questions:
	•	is the failure isolated to one route/provider?
	•	can the affected feature be degraded without app rollback?

⸻

Required Post-Rollback Verification

A rollback is not complete until these are checked:

Public Surface
	•	homepage loads
	•	no immediate production crash

Auth
	•	login page loads
	•	auth flow behaves normally
	•	protected routes behave correctly

Persistence
	•	dashboard loads
	•	existing project opens
	•	save/load path works if safe to verify

Billing
	•	upgrade entrypoint loads
	•	checkout initiation path is healthy if in scope

Logs
	•	no repeated fatal route failures
	•	no obvious provider auth/config error storm

⸻

Rollback Abort Conditions

Pause and reassess rollback if:
	•	rollback target is not clearly known-good
	•	schema has changed incompatibly and reversal is unclear
	•	config and code failures are intertwined but unclassified
	•	rollback would likely worsen data integrity risk
	•	verification fails after rollback and a second rollback is being considered blindly

In these cases:
	•	stabilize the system
	•	reduce blast radius
	•	use forward-fix planning with explicit verification

⸻

Incident Record Minimum

Every rollback or rollback-like recovery must record:
	•	incident start time
	•	deploy/commit SHA involved
	•	rollback class
	•	triggering symptom
	•	user-facing blast radius
	•	rollback target
	•	whether schema/config/provider changes were involved
	•	verification results
	•	follow-up actions

⸻

Closure Criteria

Do not consider rollback complete until:
	1.	the system is back on a known-good state
	2.	core routes/features are verified
	3.	logs no longer show active regression symptoms
	4.	the incident has been documented
	5.	follow-up remediation is identified

⸻

Follow-Up After Rollback

After service is restored:
	1.	identify root cause precisely
	2.	add missing validation or smoke coverage if applicable
	3.	update docs/runbooks if procedure changed
	4.	prevent recurrence with the smallest durable guardrail

Rollback ends the immediate incident.
It does not complete the engineering work.

