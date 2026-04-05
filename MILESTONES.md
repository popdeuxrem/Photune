# MILESTONES

## M1 — Contract Stabilization (P0)
Completion Criteria:
- product name unified as Photune
- `projects` table exists and is used by app
- dashboard loads projects successfully
- editor loads/saves project state

---

## M2 — Validation Baseline (P0)
Completion Criteria:
- `npm run check` exists
- CI fails on lint/type errors
- build passes deterministically

---

## M3 — Provider Simplification (P1)
Completion Criteria:
- one billing provider active
- one email provider active
- AI routing explicitly defined
- `.env.example` matches code usage

---

## M4 — Core Product Stability (P1)
Completion Criteria:
- editor stable across reloads
- OCR mapping consistent
- AI rewrite + inpaint functional
- no runtime crashes

---

## M5 — Monetization Ready (P1)
Completion Criteria:
- Stripe checkout works
- webhook verified
- subscription state persisted
- feature gating enforced

---

## M6 — Security Baseline (P1)
Completion Criteria:
- CSP active
- API rate limiting active
- webhook validation enforced everywhere
- no secrets exposed client-side

---

## M7 — Operational Readiness (P1)
Completion Criteria:
- deploy procedure documented
- rollback procedure documented
- environment matrix enforced
- logs available for debugging

---

## M8 — Production Candidate (P2)
Completion Criteria:
- all P0 and P1 milestones complete
- no known critical bugs
- deploy + rollback verified

