# Photune — Implementation Plan

## Purpose

This document defines the dependency-ordered execution plan that converts the current repository into a production-capable system.

This document is **authoritative**.

---

## Planning Principles

1. Minimal-change patches before broad rewrites.
2. Existing working flows are stabilized before new features are added.
3. Persistence, auth, and trust boundaries are treated as hard dependencies.
4. AI remains augmentative and must not block the core editor.
5. Validation gates must exist before production promotion.
6. Every medium/high-risk change requires rollback and verification.

---

## Current Verified Baseline

The repository already contains the following foundations:

- Next.js App Router application
- Supabase authentication and persistence paths
- dashboard and editor routes
- Fabric.js-based editor surface
- OCR dependency via `tesseract.js`
- AI routes and client/task integration direction
- Stripe billing routes
- export utilities
- CI workflow and smoke scripts
- operational documents

The execution plan therefore focuses on **stabilization, reconciliation, and production-hardening**, not greenfield design.

---

## Dependency Model

Execution is ordered by hard dependency, not by team preference.

### Hard dependency chain

1. Product/kernel authority
2. Auth and persistence integrity
3. Editor state contract
4. Export determinism
5. AI boundary hardening
6. Billing and entitlement enforcement
7. Security and observability
8. Deployment and rollback verification

No downstream track is considered complete if an upstream dependency remains undefined or unstable.

---

## Phase Plan

## Phase 3A — Contract and Surface Reconciliation

### Objective
Align implementation work to the current authoritative documents and verified repository reality.

### Scope
- reconcile execution docs with `PROJECT_BRIEF.md`, `SCOPE.md`, `NON_GOALS.md`, and `TRUST_BOUNDARIES.md`
- quarantine or archive stale planning/spec documents that conflict with current provider, persistence, or product direction
- confirm active provider set remains:
  - Supabase
  - Stripe
  - Mailgun
  - Groq
  - Cloudflare

### Deliverables
- normalized planning docs
- explicit archive/deprecation list
- no conflicting root-level execution guidance

### Exit Criteria
- authoritative docs do not conflict with active implementation plan
- stale provider or pre-persistence assumptions are classified and isolated

### Risk
Low

---

## Phase 3B — Auth and Persistence Stabilization

### Objective
Make authenticated project lifecycle deterministic and regression-resistant.

### Scope
- verify dashboard → project list path
- verify editor → project load path
- verify create/save/update/delete behavior against current `projects` contract
- verify ownership isolation through Supabase RLS assumptions and code paths
- normalize server-side validation around project mutations
- document project payload contract and migration sensitivity

### Deliverables
- stable project lifecycle
- verified save/load/delete path
- explicit project serialization contract

### Exit Criteria
- authenticated user can create, save, reopen, and delete their own projects
- unauthorized project access paths are rejected
- project mutations do not rely on client-trusted ownership fields

### Risk
High

### Rollback Requirement
All schema or persistence-surface changes must be reversible via migration rollback or git revert.

---

## Phase 3C — Editor State and Interaction Hardening

### Objective
Stabilize the editor as the primary product surface.

### Scope
- verify Fabric.js initialization and teardown behavior
- verify object selection/edit/manipulation flows
- reconcile current editor panels with actual feature ownership
- stabilize text creation, text editing, text effects, layer ordering, and ingestion flows
- ensure client-side state serializes deterministically into `canvas_data`
- reduce editor drift between local state and persisted state

### Deliverables
- deterministic editor state contract
- stable object manipulation flows
- panel ownership aligned to current UI architecture

### Exit Criteria
- project reopened from persistence renders materially equivalent editor state
- text/layer/effect changes survive save + reload
- editor does not rely on undocumented implicit state

### Risk
High

### Rollback Requirement
Patch incrementally; avoid broad editor rewrites without preserving the current working path.

---

## Phase 3D — Export Determinism and Asset Output

### Objective
Ensure exports are consistent with the persisted and visible editor state.

### Scope
- verify current export modes and format support
- confirm output parity for implemented formats
- reconcile export controls with watermark/tier behavior
- ensure export path is not dependent on unstable hidden canvas state
- document supported and unsupported export guarantees

### Deliverables
- explicit export contract
- stable format support matrix
- export verification procedure

### Exit Criteria
- supported export formats complete successfully from authenticated editor flows
- export output reflects current canvas state within documented tolerances
- free/pro gating is consistent with code paths

### Risk
Medium

---

## Phase 3E — AI Integration Boundary Hardening

### Objective
Keep AI useful, bounded, and non-blocking to the core editor.

### Scope
- classify current AI entry points by function and provider
- normalize request/response contracts for active AI routes
- ensure AI failures degrade gracefully without breaking upload/edit/save/export
- separate experimental AI UI paths from production-required editor behavior
- define what user confirmation is required before AI output mutates persistent state

### Deliverables
- AI capability matrix
- normalized route contracts
- fallback/error-handling rules

### Exit Criteria
- core editor remains usable when AI calls fail
- AI outputs are treated as untrusted until accepted by the user
- active provider responsibilities are documented and enforced

### Risk
Medium

---

## Phase 3F — Billing, Entitlements, and Commercial Integrity

### Objective
Make the subscription surface consistent with the active Stripe implementation.

### Scope
- verify checkout, portal, and webhook flows
- verify subscription state persistence path
- verify entitlement checks affecting watermark/export/AI usage/batch behavior
- ensure deferred payment providers do not participate in active runtime paths
- reconcile pricing-tier documentation with actual enforcement logic

### Deliverables
- verified Stripe lifecycle
- entitlement map
- deferred-provider quarantine confirmation

### Exit Criteria
- Stripe is the only active billing path for production promotion
- entitlements are enforced consistently in server/client paths that depend on them
- webhook behavior has explicit verification steps and rollback path

### Risk
High

---

## Phase 3G — Security, Validation, and Observability Hardening

### Objective
Raise the repo from "working" to "operationally defensible."

### Scope
- enforce route-level auth and input validation expectations
- verify webhook verification paths
- verify upload validation and size/type limits
- verify current rate-limiting posture and document known limits
- standardize structured logging at key boundaries:
  - auth
  - persistence
  - AI
  - billing
  - export
- reconcile security docs with actual code posture

### Deliverables
- hardened validation posture
- observability touchpoints
- explicit known security gaps and mitigation plan

### Exit Criteria
- critical routes have defined validation and authorization expectations
- logs are sufficient to diagnose save/export/billing/AI failures
- known security gaps are documented and prioritized rather than implicit

### Risk
High

---

## Phase 3H — Deployment, Promotion, and Rollback Readiness

### Objective
Make local validation, deployment, and rollback reproducible.

### Scope
- verify `npm run lint`, `npm run typecheck`, `npm run build`, `npm run smoke`, and `npm run check`
- reconcile deployment instructions with Vercel and current environment surface
- verify rollback instructions align with schema and provider realities
- define promotion gate for production candidate status

### Deliverables
- validated release gate
- reproducible promotion checklist
- rollback-safe deployment path

### Exit Criteria
- validation commands are current and documented
- deployment instructions match repo reality
- rollback path exists for code, config, and schema-impacting changes

### Risk
Medium

---

## Workstream Sequencing Rules

The following sequencing is mandatory:

1. **Auth/Persistence** before editor persistence hardening
2. **Editor state contract** before export determinism claims
3. **Provider and route contract clarity** before AI/billing hardening
4. **Validation and observability** before production promotion
5. **Rollback documentation** before any medium/high-risk deployment change

---

## Validation Gates

Every execution phase must define objective validation.

### Standard command gate
```bash
npm run lint
npm run typecheck
npm run build
npm run smoke
npm run check
```

### Minimum regression checks by domain
- auth: protected route behavior and identity propagation
- persistence: create/save/load/delete project lifecycle
- editor: reopen persisted canvas and confirm state integrity
- export: generate supported outputs from current editor state
- AI: route failure does not break editor baseline
- billing: webhook and entitlement paths behave deterministically

If validation is not run, the result is **not verified**.

---

## Definition of Execution Complete

Phase 3 execution planning is complete when:

- all workstreams are dependency-ordered
- milestone exits are objective
- risk is explicit
- validation is mandatory
- no execution plan assumes a greenfield rewrite