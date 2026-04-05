# WORKSTREAMS

## Workstream 1 — Product & Identity
Owner: Product / Architecture

Responsibilities:
- naming consistency (Photune)
- scope enforcement
- roadmap control
- decision logging

---

## Workstream 2 — Frontend (Editor + UX)
Owner: Frontend

Responsibilities:
- canvas/editor stability
- OCR integration
- UI consistency
- performance tuning

Dependencies:
- persistence layer
- AI integration

---

## Workstream 3 — Backend (API + Logic)
Owner: Backend

Responsibilities:
- API routes
- AI proxying
- billing endpoints
- input validation

Dependencies:
- provider decisions
- env validation

---

## Workstream 4 — Persistence (Supabase)
Owner: Backend / Data

Responsibilities:
- schema definition
- migrations
- data integrity
- access control

Critical Task:
- implement `projects` table

---

## Workstream 5 — AI Integration
Owner: Backend

Responsibilities:
- provider routing
- prompt handling
- response normalization
- usage tracking

Dependencies:
- provider selection

---

## Workstream 6 — Payments
Owner: Backend

Responsibilities:
- Stripe integration
- subscription lifecycle
- webhook processing
- entitlement enforcement

Dependencies:
- provider reduction

---

## Workstream 7 — DevOps / CI
Owner: DevOps

Responsibilities:
- CI pipeline
- validation gates
- environment discipline
- deployment automation

---

## Workstream 8 — Security
Owner: Security / Backend

Responsibilities:
- headers (CSP, etc.)
- rate limiting
- webhook verification
- secret handling

---

## Workstream 9 — Observability
Owner: DevOps

Responsibilities:
- logging
- monitoring
- debugging support
- incident readiness

---

## Coordination Rules

1. No workstream expands scope independently
2. All changes must pass validation gates
3. Schema changes must precede dependent frontend/backend work
4. Provider decisions must precede integration work
5. Deployment changes require rollback definition

