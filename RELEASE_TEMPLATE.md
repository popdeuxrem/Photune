# RELEASE_TEMPLATE

## Release Summary
- Product: Photune
- Date: 
- Commit SHA: 38f0961640e047f4ae64d4b1ab0b677cbcd12bf6
- Branch: main
- Environment: Preview
- Release owner:

---

## Scope
This release prepares Photune as a controlled preview release candidate.

### Included
- Product/repo normalization to `Photune`
- Persistence contract reconciliation for `projects`
- Validate-first CI and local validation gates
- Provider reduction to canonical stack:
  - Stripe
  - Mailgun
  - Groq
  - Cloudflare
  - Supabase
- Structured logging on critical paths
- Security hardening:
  - CSP baseline
  - browser security headers
  - env enforcement on canonical routes
  - baseline route-level rate limiting
  - upload validation policy and enforcement
- Operational artifacts:
  - deployment
  - rollback
  - runbook
  - observability
  - security
  - pre-deploy checklist
  - production readiness review

### Explicitly Not Included
- distributed/global rate limiting
- tighter second-pass CSP reduction
- broader media/upload support beyond PNG/JPEG/WebP
- full tracing/metrics platform
- deeper route-by-route smoke coverage beyond current baseline

---

## Risk Classification
- [ ] Low
- [x] Medium
- [ ] High

### Why
- canonical runtime paths were modified and hardened
- billing/auth/AI routes now have env enforcement and rate limiting
- security headers/CSP can still reveal runtime-only issues in preview
- remaining risk is primarily runtime observation risk, not repo integrity risk

---

## Validation
### Required Checks
- [x] `npm run lint`
- [x] `npm run typecheck`
- [x] `npm run build`
- [x] `npm run smoke`
- [x] `npm run check`

### Results
- lint: PASS
- typecheck: PASS
- build: PASS
- smoke: PASS
- check: PASS

---

## Schema Impact
- [x] No new schema change in this release batch
- [ ] Schema change included

### Details
- migration files: existing reconciled `projects` contract already in repo state
- affected tables: `projects`, existing subscription-related tables remain as documented
- compatibility notes: current app and checked-in schema are aligned
- rollback or forward-fix notes: use deployment rollback first; avoid destructive DB rollback without explicit impact assessment

---

## Environment Impact
- [ ] No environment change
- [x] Environment change included

### Details
- added variables: canonical enforcement depends on existing required vars being present
- changed variables:
  - deferred provider vars removed over cleanup batches
  - canonical provider env surface retained
- removed variables:
  - Resend env
  - NowPayments env
  - Paystack env
- target environments affected:
  - preview
  - production

---

## Provider Impact
- [x] Provider change included

### Details
- billing: Stripe-only canonical path
- email: Mailgun-only canonical path
- AI: Groq + Cloudflare canonical path
- notes:
  - Resend removed
  - NowPayments removed
  - Paystack removed

---

## User-Facing Verification Plan
Post-deploy, verify:

- [ ] landing page loads
- [ ] login route loads
- [ ] auth callback completes correctly
- [ ] dashboard loads for authenticated user
- [ ] existing project opens
- [ ] save/load cycle works
- [ ] upgrade modal loads
- [ ] Stripe checkout route behaves as expected
- [ ] one Groq-backed flow behaves as expected
- [ ] one Cloudflare-backed flow behaves as expected
- [ ] no CSP violations appear on critical flows

---

## Rollback Plan
- rollback target: last known-good Vercel deployment
- rollback class: likely Class 1 (code) or Class 2 (config), depending on preview findings
- trigger conditions:
  - auth failure
  - dashboard/editor persistence failure
  - Stripe checkout failure
  - CSP breaking core flows
  - canonical AI route failure for intended release surface
- owner for rollback execution: TBC

Reference:
- `ROLLBACK.md`

---

## Known Risks
- preview may expose CSP/runtime-only issues not visible in repository validation
- instance-local rate limiting is a baseline guard, not a distributed quota system
- smoke coverage is meaningful but not exhaustive
- upload policy is intentionally narrow and may reject files some users expect to work

---

## Follow-Up Actions
- execute preview verification
- tighten CSP only after observing real runtime needs
- expand smoke coverage based on preview findings
- improve observability depth if preview reveals diagnosis gaps