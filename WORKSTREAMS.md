# Photune — Workstreams

## Purpose

This document defines the active delivery workstreams for Photune, including scope, dependencies, and acceptance criteria.

This document is **authoritative**.

---

## Workstream Map

Photune execution is divided into eight controlled workstreams:

1. Kernel and Governance
2. Auth and Persistence
3. Editor and Canvas
4. OCR and AI Integration
5. Export and Output Integrity
6. Billing and Entitlements
7. Security and Observability
8. Release and Operations

Each workstream exists to reduce blast radius and preserve dependency order.

---

## WS-01 — Kernel and Governance

### Objective
Keep product, architectural, and operational decisions authoritative and synchronized with implementation.

### Scope
- maintain kernel docs
- maintain boundary docs
- classify planning/spec docs
- log architectural decisions
- prevent stale documents from driving implementation

### Inputs
- `PROJECT_BRIEF.md`
- `ARCHITECTURE.md`
- `DECISIONS.md`
- `RISKS.md`
- Phase 1 and 1.5 reconciliation outputs

### Outputs
- current authoritative documentation set
- explicit archive/supersession handling

### Dependencies
None

### Acceptance
- no unresolved contradiction across authoritative docs
- new implementation-impacting decisions are logged in `DECISIONS.md`

---

## WS-02 — Auth and Persistence

### Objective
Stabilize the user/project data model and authenticated project lifecycle.

### Scope
- Supabase auth integration
- project CRUD paths
- project ownership checks
- dashboard project listing
- server-side mutation validation
- migration discipline for `projects` and related tables

### Inputs
- `supabase/schema.sql`
- migration files
- dashboard and editor server paths

### Outputs
- deterministic project lifecycle
- persistence contract documentation

### Dependencies
- WS-01

### Acceptance
- authenticated user can create, save, load, list, and delete their own projects
- cross-user access is rejected by design and verification
- persistence behavior is documented and testable

### Risk
High

---

## WS-03 — Editor and Canvas

### Objective
Make the editor stable, serializable, and safe to evolve.

### Scope
- Fabric.js lifecycle
- text creation/editing flows
- effects and layer controls
- upload/ingestion interactions
- panel ownership and mode transitions
- canvas serialization and rehydration

### Inputs
- editor components and feature modules
- current panel specs and editor planning notes
- persistence contract from WS-02

### Outputs
- stable editor behavior
- deterministic `canvas_data` contract
- validated reload equivalence

### Dependencies
- WS-02

### Acceptance
- save → reload preserves material editor state
- panel interactions do not corrupt serialization
- editor teardown/re-init does not produce state drift or crashes

### Risk
High

---

## WS-04 — OCR and AI Integration

### Objective
Bound OCR and AI functionality so it enhances, but does not destabilize, the editor.

### Scope
- OCR initiation and result mapping
- AI route classification and provider ownership
- task/result normalization
- user confirmation model for AI-driven changes
- graceful degradation when providers fail

### Inputs
- OCR dependencies and routes
- AI routes, client helpers, adapters, and status patterns
- trust boundary rules

### Outputs
- AI capability matrix
- normalized AI/OCR contract
- non-blocking failure behavior

### Dependencies
- WS-03 for editor integration
- WS-07 for trust/validation requirements

### Acceptance
- OCR and AI failure do not break baseline edit/save/export flows
- AI output is treated as untrusted until applied by the user
- provider roles are explicit and non-overlapping where practical

### Risk
Medium

---

## WS-05 — Export and Output Integrity

### Objective
Guarantee that supported outputs are faithful to the editor state and tier policy.

### Scope
- export mode UX
- export format implementations
- watermark/tier enforcement during export
- PDF/SVG/image output verification
- export-time failure handling

### Inputs
- editor serialization contract
- current export utilities and controls
- entitlement rules from WS-06

### Outputs
- supported export matrix
- deterministic export verification procedure

### Dependencies
- WS-03
- WS-06 where export is tier-gated

### Acceptance
- supported formats export successfully from representative projects
- output policy matches active subscription logic
- export behavior is documented and reproducible

### Risk
Medium

---

## WS-06 — Billing and Entitlements

### Objective
Keep the commercial model consistent with the active Stripe-based implementation.

### Scope
- Stripe checkout
- customer portal
- webhook handling
- subscription state persistence
- entitlement enforcement for gated features
- quarantine of deferred payment providers

### Inputs
- Stripe routes and env validation
- user/subscription schema paths
- pricing and gating code

### Outputs
- verified Stripe lifecycle
- entitlement map by plan
- deferred-provider quarantine confirmation

### Dependencies
- WS-02
- WS-07 for webhook and secret-handling controls

### Acceptance
- Stripe is the only production billing path
- webhook path is validated and documented
- gated features behave consistently with stored subscription state

### Risk
High

---

## WS-07 — Security and Observability

### Objective
Make the product diagnosable and defensible under production conditions.

### Scope
- route auth/authorization enforcement
- schema/input validation posture
- webhook verification
- upload restrictions
- rate limiting posture
- logging standards and event coverage
- security documentation reconciliation

### Inputs
- `TRUST_BOUNDARIES.md`
- `SECURITY.md`
- `LOGGING_STANDARD.md`
- route handlers and shared server libraries

### Outputs
- explicit validation and protection rules
- logging coverage for critical user journeys
- known-gap register with mitigation priority

### Dependencies
- WS-01
- informs WS-02, WS-04, WS-05, WS-06, WS-08

### Acceptance
- critical routes have documented trust handling
- operational failures can be diagnosed from logs or reproducible validation
- known security gaps are explicit, not implicit

### Risk
High

---

## WS-08 — Release and Operations

### Objective
Make build, deploy, rollback, and promotion repeatable.

### Scope
- validation command discipline
- CI alignment
- environment matrix enforcement
- deployment documentation
- rollback procedures
- production promotion gate

### Inputs
- package scripts
- CI workflow
- deployment docs
- environment matrix
- outputs from all previous workstreams

### Outputs
- reproducible release process
- promotion checklist
- rollback-safe deployment path

### Dependencies
- WS-02 through WS-07 must be sufficiently stable

### Acceptance
- `npm run check` is current and meaningful
- deployment docs match real environment requirements
- rollback exists for code/config/schema-impacting changes

### Risk
Medium

---

## Coordination Rules

1. WS-01 governs scope and document authority.
2. WS-02 must precede any claim of durable editor/project behavior.
3. WS-03 must stabilize serialization before WS-05 can claim deterministic export.
4. WS-07 must review any new external boundary introduced by WS-04 or WS-06.
5. WS-08 cannot promote a release candidate while any upstream high-risk workstream lacks rollback and verification.
6. No workstream may widen provider scope without an explicit `DECISIONS.md` entry.

---

## Cross-Workstream Verification Standard

Each workstream must provide:

- exact changed files
- explicit assumptions
- risk level
- deterministic commands
- verification steps
- rollback path

If any of these are missing, the workstream is not ready for production promotion.