# Photune — Milestones

## Purpose

This document defines the milestone ladder from current repository state to production candidate.

This document is **authoritative**.

---

## Milestone Rules

- A milestone is complete only when its exit criteria are objectively verified.
- "Implemented" is not enough; validation must exist.
- Upstream milestone failure blocks downstream promotion.
- If validation was not run, milestone status is **not verified**.

---

## M0 — Documentation and Boundary Lock

### Objective
Stop scope and architecture drift before deeper implementation work continues.

### Required Outcomes
- Phase 0 kernel is authoritative
- Phase 1 audit artifacts reflect current repo reality
- root-level planning/spec docs are classified
- Phase 2 boundary docs exist and are authoritative
- execution planning docs are dependency-ordered

### Exit Criteria
- `PROJECT_BRIEF.md`, `SCOPE.md`, `NON_GOALS.md`, `TRUST_BOUNDARIES.md`, `IMPLEMENTATION_PLAN.md`, `WORKSTREAMS.md`, and `MILESTONES.md` exist and do not conflict
- stale design/spec documents are classified or queued for archive

### Verification
- documentation reconciliation review
- no unresolved contradiction in authoritative docs

### Risk
Low

---

## M1 — Authenticated Persistence Baseline

### Objective
Make user/project lifecycle reliable enough to support all editor work.

### Required Outcomes
- authenticated routes behave consistently
- project CRUD works through the intended app paths
- dashboard reflects user-scoped project data
- persistence contract is explicit

### Exit Criteria
- authenticated user can create, save, load, list, and delete their own projects
- project access is isolated by ownership controls
- project mutation paths do not trust client-supplied ownership information

### Verification
- `npm run lint`
- `npm run typecheck`
- targeted manual or scripted verification of project lifecycle
- review of RLS and mutation path assumptions

### Risk
High

---

## M2 — Editor Serialization Stability

### Objective
Ensure the editor can safely persist and rehydrate material state.

### Required Outcomes
- Fabric.js lifecycle is stable
- text/layer/effect changes survive save + reload
- ingestion and rehydration paths are not materially divergent

### Exit Criteria
- representative projects reopen without material state corruption
- editor panels do not produce undocumented serialization side effects
- known serialization limitations are documented

### Verification
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- representative save/reload regression checks

### Risk
High

---

## M3 — Export Integrity Baseline

### Objective
Ensure supported exports are operationally trustworthy.

### Required Outcomes
- export modes are aligned to current UI
- supported formats are documented and exercised
- export results are consistent with tier behavior

### Exit Criteria
- representative projects export successfully in supported formats
- watermark/tier rules are consistent with current entitlement logic
- export failures are surfaced predictably

### Verification
- `npm run build`
- export smoke/regression checks using representative projects
- manual parity check between editor state and output for supported formats

### Risk
Medium

---

## M4 — AI and OCR Containment

### Objective
Keep OCR and AI useful without making them a reliability hazard.

### Required Outcomes
- OCR path is mapped to current editor behavior
- active AI routes are classified and normalized
- AI failure paths are non-blocking to core editor flows

### Exit Criteria
- upload/edit/save/export remain usable when AI routes fail or are unavailable
- AI-generated changes require explicit user application before persistence
- provider responsibilities are documented

### Verification
- `npm run lint`
- `npm run typecheck`
- route-level failure-path checks
- editor fallback behavior checks with AI unavailable

### Risk
Medium

---

## M5 — Billing and Entitlement Integrity

### Objective
Make the commercial layer consistent, enforceable, and contained.

### Required Outcomes
- Stripe checkout, portal, and webhook paths are coherent
- entitlement logic matches active plans
- deferred payment providers are not part of the active production path

### Exit Criteria
- Stripe is the only active billing provider in production scope
- entitlement-gated features behave consistently with stored subscription state
- webhook verification path is documented and tested

### Verification
- `npm run smoke`
- targeted Stripe/webhook path validation
- code/config review against environment matrix

### Risk
High

---

## M6 — Security and Observability Baseline

### Objective
Raise the app to a diagnosable and defensible production posture.

### Required Outcomes
- trust boundary expectations are reflected in routes
- upload and webhook surfaces are protected
- structured logging exists for critical flows
- known security gaps are explicit and prioritized

### Exit Criteria
- critical external boundaries have documented validation rules
- operational logs or deterministic diagnostics exist for save/export/AI/billing failures
- security docs align with real code posture

### Verification
- `npm run lint`
- `npm run typecheck`
- targeted route and boundary review
- logging/diagnostic checks on critical flows

### Risk
High

---

## M7 — Release Candidate Readiness

### Objective
Make promotion, deployment, and rollback reproducible.

### Required Outcomes
- validation commands are current
- CI reflects real release gates
- deployment docs match active environment surface
- rollback exists for code, config, and schema-impacting changes

### Exit Criteria
- `npm run check` passes
- CI uses meaningful validation stages
- deploy and rollback procedures are documented against current architecture
- no unresolved critical issue remains in upstream milestones

### Verification
- `npm run check`
- CI workflow review
- deployment and rollback walkthrough against docs

### Risk
Medium

---

## M8 — Production Candidate

### Objective
Declare the repository ready for controlled production promotion.

### Required Outcomes
- M0 through M7 are complete or have explicit accepted exceptions
- no unresolved critical issue undermines auth, persistence, export, billing, or trust boundaries
- release posture is operationally supportable

### Exit Criteria
- production promotion checklist is satisfied
- accepted exceptions are explicitly logged in `DECISIONS.md` or `RISKS.md`
- repository is deployable, testable, observable, and rollback-safe within documented constraints

### Verification
- aggregate milestone review
- `npm run check`
- release gate signoff against authoritative docs

### Risk
Medium

---

## Promotion Rule

The repository must not be described as production-ready solely because the app runs locally.

Production candidate status requires:
- verified validation
- explicit rollback
- bounded providers
- documented trust handling
- stable authenticated persistence
- deterministic export behavior