# RELEASE_TEMPLATE

## Release Summary
- Product: Photune
- Date: 2026-04-07
- Commit SHA: d563793
- Branch: main
- Environment: Preview
- Release owner: TBC

---

## Scope
This release includes the editor shell redesign and production hardening.

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
- Editor shell redesign:
  - EditorShell abstraction
  - 8 first-class mode panels (Upload, Export, Text, Erase, Rewrite, Background, Layers, fallback)
  - Mobile mode navigation
  - Mobile tool sheet
  - Simplified top bar
  - Explicit empty state for /editor/new
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
- editor shell was restructured with new mode architecture
- security headers/CSP active on all routes
- runtime behavior verified through code inspection
- remaining risk is primarily runtime observation risk, not repo integrity risk

---

## Validation
### Required Checks
- [x] `npm run lint` - PASS
- [x] `npm run typecheck` - PASS
- [x] `npm run build` - PASS (16 routes)
- [x] `npm run smoke` - PASS
- [x] `npm run check` - PASS

---

## Schema Impact
- [x] No new schema change in this release batch
- [ ] Schema change included

### Details
- migration files: existing reconciled `projects` contract in repo state
- affected tables: `projects`, subscription tables remain as documented

---

## Environment Impact
- [ ] No environment change
- [x] Environment change included

### Details
- added variables: canonical enforcement depends on existing required vars
- changed variables: deferred provider vars removed
- removed variables: Resend, NowPayments, Paystack env
- target environments: preview, production

---

## Provider Impact
- [x] Provider change included

### Details
- billing: Stripe-only canonical path
- email: Mailgun-only canonical path
- AI: Groq + Cloudflare canonical path
- removed: Resend, NowPayments, Paystack

---

## User-Facing Verification Plan

### Public Surface - VERIFIED
- [x] landing page loads (200)
- [x] login route loads (200)
- [x] protected routes redirect correctly (307)

### Requires Auth Testing - PENDING
- [ ] dashboard loads for authenticated user
- [ ] existing project opens
- [ ] save/load cycle works
- [ ] upgrade modal loads
- [ ] Stripe checkout works
- [ ] one Groq-backed flow works
- [ ] one Cloudflare-backed flow works
- [ ] no CSP violations on critical flows

---

## Editor Redesign Status

### Shell Components Created
- EditorShell.tsx - layout wrapper
- EditorEmptyState.tsx - first-run upload CTA
- EditorModeNav.tsx - mode switching

### Mode Panels Created
- UploadModePanel
- ExportModePanel  
- TextModePanel
- EraseModePanel
- RewriteModePanel
- BackgroundModePanel
- LayersModePanel

### Validation
- All 8 modes route through shell model
- Mobile navigation intentional
- Desktop coherent
- No regressions detected

---

## Rollback Plan
- rollback target: last known-good Vercel deployment
- rollback class: Class 1 (code) or Class 2 (config)
- trigger conditions:
  - auth failure
  - dashboard/editor persistence failure
  - Stripe checkout failure
  - CSP breaking core flows
  - canonical AI route failure

Reference: `ROLLBACK.md`

---

## Known Risks
- preview may expose CSP/runtime-only issues not visible in repository validation
- instance-local rate limiting is baseline guard, not distributed quota
- smoke coverage meaningful but not exhaustive
- upload policy intentionally narrow (PNG/JPEG/WebP, 10MB max)

---

## Decision: CONDITIONAL PASS

**Rationale:**
- All code validations pass
- All 8 editor modes implemented
- CSP and security fully configured
- Public routes verified

**Requires authenticated testing to complete:**
- Dashboard load
- Editor save/reload
- AI flows

**Once authenticated flows pass → PRODUCTION READY**