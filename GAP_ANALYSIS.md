# GAP_ANALYSIS

## Summary
The repository already contains substantial product code, but it is not yet production-capable because core system contracts are inconsistent.

The highest-value path is not broad feature expansion. It is reconciliation and hardening.

## Gap 1 — Product Identity Is Split
### Evidence
Observed names:
- Photune
- phoTextAI
- photext.shop reference
- photune.app

### Impact
- metadata drift
- legal/copy inconsistency
- billing/product naming inconsistency
- email identity inconsistency
- SEO inconsistency
- future migration ambiguity

### Required Fix
Create and enforce one canonical identity across:
- README
- metadata
- site config
- emails
- workflow names
- payment copy
- domain references

Priority: **P0**

---

## Gap 2 — Persistence Contract Is Broken
### Evidence
App code reads and mutates `projects`, while checked-in `supabase/schema.sql` does not define `projects`.

### Impact
- dashboard cannot be trusted
- editor load/save path is not reproducible from repo state
- README setup instructions do not match checked-in schema discipline

### Required Fix
Add a canonical `projects` table migration or revise app code if project persistence is intentionally removed.

Priority: **P0**

---

## Gap 3 — CI Is Not a Validation Gate
### Evidence
`package.json` exposes only:
- dev
- build
- start
- lint

Workflow is deploy-oriented and still named for `phoTextAI`.

### Impact
- no objective typecheck gate
- no test gate
- no smoke gate
- production deploy path may pass while key flows are broken

### Required Fix
Introduce:
- `typecheck`
- `check` aggregator
- route/API smoke checks
- validation-first CI jobs before deployment

Priority: **P0**

---

## Gap 4 — Payment Architecture Is Over-Broad
### Evidence
Repo includes:
- Stripe routes/libs/schema
- Paystack libs/schema/api subtree
- NowPayments libs/schema/api subtree

### Impact
- unnecessary operational complexity
- multiple webhook surfaces
- unclear subscription source of truth
- larger blast radius for billing defects

### Required Fix
Choose one canonical MVP billing rail.
Demote others to explicitly deferred or optional extensions.

Priority: **P1**

---

## Gap 5 — Email Strategy Is Inconsistent
### Evidence
- `mailgun.js` dependency exists
- inspected email implementation uses Mailgun
- the environment and docs must stay aligned to the Mailgun-only path

### Impact
- broken transactional email in real deployments if env vars not set
- unclear provider ownership
- incomplete env contract

### Required Fix
Keep one provider only.
Align dependency graph, env example, and implementation to Mailgun.

Priority: **P1**

---

## Gap 6 — Security Hardening Is Partial
### Evidence
Present:
- auth middleware
- Stripe signature verification
- minimal security headers

Missing / incomplete:
- CSP
- rate limiting
- upload validation policy
- complete webhook verification discipline for crypto flows
- secret/env validation layer

### Impact
- avoidable security regressions
- weak edge posture for auth + payment + AI routes
- unclear abuse controls

### Required Fix
Add:
- security baseline doc
- server env validation
- CSP and stronger headers
- rate limiting on API routes
- strict webhook verification for non-Stripe flows

Priority: **P1**

---

## Gap 7 — Operational Readiness Is Incomplete
### Evidence
Missing:
- deployment procedure
- rollback procedure
- observability docs
- environment promotion model
- smoke validation
- incident guidance

### Impact
- deployment is possible but not governed
- rollback path is undefined
- failures are harder to diagnose

### Required Fix
Create:
- `DEPLOYMENT.md`
- `RUNBOOK.md`
- `OBSERVABILITY.md`
- `ROLLBACK.md`

Priority: **P1**

---

## Gap 8 — AI Provider Boundary Is Unclear
### Evidence
Current AI surface includes:
- Groq proxy
- Cloudflare routes
- Puter client-side path/fallback
- README references an older/alternate provider story

### Impact
- hard to reason about latency/cost/failure modes
- unclear model selection behavior
- inconsistent frontend/backend invocation path

### Required Fix
Define a canonical AI routing strategy:
- which operations use which provider
- what fails open vs fails closed
- what is browser-side vs server-side
- how usage is metered

Priority: **P1**

---

## Gap 9 — React Strict Mode Is Disabled
### Evidence
`next.config.mjs` sets `reactStrictMode: false`.

### Impact
- reduced visibility into side-effect issues
- editor behavior may rely on non-robust lifecycle assumptions

### Required Fix
Audit why it was disabled.
Re-enable if possible after editor stabilization.

Priority: **P2**

---

## Gap 10 — Dead / Partial Code Risk Is High
### Evidence
Multiple surfaces exist that were not fully reconciled:
- provider duplication
- naming duplication
- env/doc mismatch
- route subtree breadth beyond current validation coverage

### Impact
- hidden breakage
- misleading docs
- maintenance drag
- false sense of completeness

### Required Fix
Perform a branch-by-branch audit:
- keep
- repair
- remove
- defer

Priority: **P1**

## Recommended Execution Order

### Track 1 — Contract Reconciliation
1. resolve naming
2. reconcile schema vs app code
3. normalize env surface

### Track 2 — Validation Baseline
1. add typecheck
2. add build+l int+typecheck aggregate
3. add minimal smoke coverage
4. convert CI to validate-first

### Track 3 — Provider Scope Reduction
1. choose canonical billing rail
2. choose canonical email rail
3. define AI routing policy
4. demote or remove non-canonical paths

### Track 4 — Security + Ops
1. env validation
2. stronger headers / CSP
3. rate limiting
4. deployment/runbook/rollback docs

## Decision Dependencies
The following decisions must be explicit before major implementation:
- canonical product name
- canonical domain
- canonical payment provider
- canonical email provider
- canonical AI provider routing
- whether `projects` remains the persistence center of the editor

