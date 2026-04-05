# IMPLEMENTATION_PLAN

## Strategy
Do not add new features until system contracts are stable.

Execution is divided into ordered tracks with strict dependency constraints.

---

## Track 0 — Identity + Contract Lock (P0)

### Goals
- eliminate naming drift
- align schema with application behavior

### Tasks
1. Replace all `phoTextAI` references with `Photune`
2. Normalize metadata (title, OG, emails, workflow names)
3. Introduce canonical `projects` schema

### Output
- consistent product identity
- working persistence contract

### Blocking Dependencies
None

---

## Track 1 — Persistence Stabilization (P0)

### Goals
Make editor + dashboard persistence real and reproducible

### Tasks
1. Create `projects` table migration
2. Ensure:
   - insert
   - select (user-scoped)
   - update
   - delete
3. Validate editor load/save cycle
4. Add schema documentation

### Output
- deterministic project lifecycle

### Blocking Dependencies
Track 0

---

## Track 2 — Environment & Provider Reduction (P1)

### Goals
Reduce operational surface area

### Tasks
1. Select canonical providers:
   - Billing: Stripe
   - Email: Resend OR Mailgun (choose one)
   - AI: Groq + Cloudflare (explicit roles)
2. Remove or isolate:
   - Paystack (if not primary)
   - NowPayments (if not required)
3. Update `.env.example`
4. Add server-side env validation

### Output
- controlled dependency graph
- reduced failure surface

### Blocking Dependencies
Track 1

---

## Track 3 — Validation Gates (P0)

### Goals
Prevent silent breakage

### Tasks
1. Add scripts:
   - `typecheck`
   - `check` (lint + typecheck + build)
2. Introduce CI stages:
   - install
   - lint
   - typecheck
   - build
3. Fail pipeline on any error

### Output
- enforceable correctness baseline

### Blocking Dependencies
Track 1

---

## Track 4 — Editor Stability (P1)

### Goals
Ensure editor is production-usable

### Tasks
1. Validate Fabric canvas lifecycle
2. Validate OCR → canvas mapping
3. Fix background rehydration logic
4. Ensure deterministic save format

### Output
- stable editor behavior

### Blocking Dependencies
Track 1

---

## Track 5 — AI Integration Hardening (P1)

### Goals
Make AI predictable and bounded

### Tasks
1. Define AI routing:
   - rewrite → Groq
   - inpaint → Cloudflare
2. Normalize API responses
3. Add error handling + fallback
4. Log AI usage consistently

### Output
- deterministic AI layer

### Blocking Dependencies
Track 2

---

## Track 6 — Billing Finalization (P1)

### Goals
Make monetization production-safe

### Tasks
1. Finalize Stripe flows:
   - checkout
   - portal
   - webhook
2. Persist subscription state
3. Enforce feature gating

### Output
- consistent subscription model

### Blocking Dependencies
Track 2

---

## Track 7 — Security Hardening (P1)

### Goals
Close major security gaps

### Tasks
1. Add CSP headers
2. Add rate limiting for API routes
3. Validate uploads
4. Enforce strict webhook verification
5. Audit env exposure

### Output
- baseline production security

### Blocking Dependencies
Track 3

---

## Track 8 — Operational Readiness (P1)

### Goals
Make system deployable and maintainable

### Tasks
1. Create:
   - DEPLOYMENT.md
   - RUNBOOK.md
   - OBSERVABILITY.md
   - ROLLBACK.md
2. Add logging conventions
3. Add error boundaries

### Output
- production-ready posture

### Blocking Dependencies
Track 3

---

## Track 9 — Performance + UX Refinement (P2)

### Goals
Improve perceived quality

### Tasks
1. Optimize editor rendering
2. Reduce bundle size
3. Add loading states
4. Improve UX flows

### Output
- polished product experience

### Blocking Dependencies
Track 4, Track 5

