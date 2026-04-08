# GAP_ANALYSIS

## Objective
Identify the remaining deltas between the current repository state and a production-capable Photune system, using the verified audit rather than stale historical assumptions.

## Summary
Photune is no longer missing its basic kernel, route structure, persistence contract, or validation baseline. Those foundations now exist in the repository.

The remaining work is concentrated in four areas:
- drift reduction
- deeper validation
- operational hardening
- deliberate removal or quarantine of inactive legacy surfaces

This means the highest-value work is **controlled reconciliation and hardening**, not broad re-architecture.

## Gap 1 — Documentation Drift Remains a Live Risk
### Evidence
The repository contains a large number of design, planning, provider, and operational documents. Earlier documents reflected historical states that are no longer fully accurate.

Examples of past drift already observed during this project:
- schema/docs disagreeing about `projects`
- payment provider scope changing over time
- identity drift between `phoTextAI` and `Photune`

### Impact
- implementers can follow stale instructions
- future patches may reintroduce removed providers or outdated assumptions
- kernel and repo reality can diverge again

### Required Fix
- keep Phase 0 and Phase 1 docs as the authoritative baseline
- grep and normalize older docs that still encode outdated runtime assumptions
- add a lightweight documentation review gate for provider/persistence changes

Priority: **P0**

---

## Gap 2 — Automated Validation Is Still Shallow
### Evidence
The repository now has:
- `lint`
- `typecheck`
- `build`
- targeted smoke checks

What is still absent:
- unit tests
- route/integration tests
- editor interaction regression tests
- end-to-end auth/persistence/export tests

### Impact
- current validation catches static and some structural regressions, but not deeper behavioral failures
- editor regressions can ship if they still typecheck/build
- billing/auth/persistence breakage may remain undetected until manual testing

### Required Fix
Add layered validation in this order:
1. unit coverage for critical pure helpers
2. integration tests for route handlers and server actions
3. end-to-end happy-path coverage for auth, save/load, and export
4. regression coverage for provider gating and tier behavior

Priority: **P0**

---

## Gap 3 — Distributed Abuse Controls Are Not Yet Production-Hardened
### Evidence
Verified controls exist for:
- upload validation
- in-memory rate limiting
- CSP/security headers

Current limitation:
- rate limiting is implemented in memory and therefore is instance-local

### Impact
- limits do not reliably hold across horizontally scaled/serverless instances
- abuse resistance is weaker under real traffic or distributed attack patterns
- API cost exposure remains higher than necessary for AI and billing surfaces

### Required Fix
- replace or augment in-memory rate limiting with a shared/distributed store
- apply route-specific policies for AI, auth, and billing paths
- document operational thresholds and failure behavior

Priority: **P1**

---

## Gap 4 — Schema Breadth Exceeds Active Runtime Scope
### Evidence
Active billing runtime surface is Stripe-only.

However `supabase/schema.sql` still contains tables for broader payment history, including:
- `payment_references`
- `crypto_payments`

### Impact
- schema suggests broader provider support than the active app surface actually uses
- future contributors may assume deferred providers are still supported
- operational and support expectations can become ambiguous

### Required Fix
Choose one of two paths and document it explicitly:
1. keep legacy/deferred tables but mark them as inactive/quarantined schema surface, or
2. remove them in a controlled migration if they are no longer strategically needed

Priority: **P1**

---

## Gap 5 — Editor Reliability Is Not Yet Objectively Proven
### Evidence
The editor surface is substantial and modular, with panels for upload, text, layers, rewrite, erase, effects, background, and export.

What is not yet proven in this audit:
- stable behavior across representative image sizes and aspect ratios
- regression-free save/load round trips for complex canvas state
- export fidelity against canvas state
- mobile/editor usability beyond current implementation intent

### Impact
- production confidence in the editor remains lower than the code volume suggests
- serialization, selection, or export regressions may escape static validation
- “works locally” risk remains high for the most important product surface

### Required Fix
Define and automate editor validation around:
- canvas serialization round-trip
- text object fidelity
- image background rehydration
- layer order stability
- export parity for supported formats
- representative browser/device smoke checks

Priority: **P0**

---

## Gap 6 — Operational Readiness Exists in Docs More Than in Verified Exercises
### Evidence
Operational artifacts are present:
- `DEPLOYMENT.md`
- `RUNBOOK.md`
- `ROLLBACK.md`
- `OBSERVABILITY.md`
- `SECURITY.md`

What has not been verified by this audit:
- dry-run deploy from clean state
- rollback rehearsal
- incident drill
- alert routing
- telemetry sink configuration

### Impact
- the repo appears operationally mature on paper, but exercised readiness is unknown
- response quality during real incidents is unproven

### Required Fix
- run and record a deployment rehearsal
- run and record a rollback rehearsal
- define minimum production telemetry signals and alert receivers
- convert paper readiness into demonstrated readiness

Priority: **P1**

---

## Gap 7 — AI Routing Policy Is Still Broader Than the Validation Story
### Evidence
Verified AI surfaces include:
- Groq route
- Cloudflare inpaint route
- Cloudflare workers route
- additional shared AI helpers/caching modules

What remains under-defined at production level:
- canonical task-to-provider mapping for every AI feature
- fallback behavior per operation
- usage accounting completeness across all AI operations
- provider outage behavior at UX level

### Impact
- cost, latency, and failure modes are harder to reason about
- AI regressions may not be detected systematically
- feature behavior may differ depending on which route/helper path is invoked

### Required Fix
Create a single AI routing matrix that defines:
- task
- provider
- sync/async behavior
- user-visible failure behavior
- metering path
- retry policy

Priority: **P1**

---

## Gap 8 — React Strict Mode Is Still Disabled
### Evidence
`next.config.mjs` sets:
- `reactStrictMode: false`

### Impact
- reduced signal for side-effect and lifecycle hazards
- hidden client/editor fragility can persist longer

### Required Fix
- document the exact reason Strict Mode remains disabled
- isolate offending surfaces
- re-enable once editor/client effects are robust enough

Priority: **P2**

---

## Gap 9 — Product Tier / Entitlement Behavior Needs Regression Coverage
### Evidence
Tier logic exists for:
- watermark behavior
- AI credits
- batch processing
- brand kit
- priority support
- enterprise custom branding

What is not yet proven:
- all entitlements are enforced consistently in UI and server-side flows
- downgrade/upgrade transitions behave safely
- billing state and feature state remain synchronized

### Impact
- monetization bugs can affect revenue, support cost, or user trust
- discrepancies between UI promises and actual enforcement can persist unnoticed

### Required Fix
- add regression tests for tier enforcement
- verify Stripe webhook-to-subscription synchronization path end to end
- define expected downgrade/expired subscription behavior

Priority: **P1**

---

## Gap 10 — Older Planning Artifacts Can Re-Introduce Solved Problems
### Evidence
The repository contains a very large set of planning and spec documents for editor, AI, provider, and UX work.

### Impact
- solved issues can be reopened accidentally
- outdated constraints can influence new implementation work
- change discipline weakens when historical docs are not clearly marked active vs archival

### Required Fix
Classify non-kernel docs into:
- active authoritative
- supporting reference
- historical/archive

Priority: **P1**

## Recommended Execution Order

### Track 1 — Protect the Baseline
1. keep kernel + audit docs synchronized
2. mark active vs historical planning docs
3. preserve `projects` persistence contract as a protected surface

### Track 2 — Deepen Validation
1. add unit tests for pure helpers
2. add route/server-action integration tests
3. add end-to-end flows for auth, save/load, export, and billing tier enforcement
4. add editor serialization/export regression checks

### Track 3 — Harden Runtime Security and Abuse Controls
1. move rate limiting to a distributed store or edge-backed shared control
2. define route-specific abuse budgets
3. verify upload controls against real route usage

### Track 4 — Reduce Inactive Surface Area
1. classify legacy payment schema/doc surfaces as quarantined or remove them
2. keep active provider set explicit
3. collapse AI routing policy into one authoritative matrix

### Track 5 — Exercise Operations
1. rehearse deploy from clean state
2. rehearse rollback
3. verify telemetry and alerts
4. record outcomes in operational docs

## Phase 1 Audit Conclusion
The repo no longer needs a broad foundational reset. It needs disciplined convergence.

The next engineering moves should be minimal-change, evidence-based, and validation-heavy:
- prove the editor and persistence paths
- harden provider and entitlement behavior
- reduce inactive surface area
- convert documented operations into exercised operations
