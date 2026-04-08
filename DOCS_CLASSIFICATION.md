# Documentation Classification — Photune

## Purpose

This document defines which files are authoritative, which are reference-only, and which are historical.

No engineering decision should rely on a document outside the **authoritative set**.

---

# 1. Authoritative Documents

These define the system. They must be correct at all times.

## Phase 0 — Kernel (Product Contract)

- README.md  
  → Entry point only. Must align with kernel but does not override it.

- PROJECT_BRIEF.md  
  → Defines product scope, boundaries, and identity.

- SUCCESS_CRITERIA.md  
  → Defines what "done" and "production-ready" mean.

- ARCHITECTURE.md  
  → Defines system structure and boundaries.

- ROADMAP.md  
  → Defines execution sequencing.

- DECISIONS.md  
  → Source of truth for all architectural/product decisions.

- RISKS.md  
  → Defines known risks and mitigation expectations.

---

## Phase 6 — Operational Authority

- DEPLOYMENT.md  
  → Canonical deployment process.

- RUNBOOK.md  
  → Operational procedures and incident handling.

- ROLLBACK.md  
  → Mandatory rollback procedures.

- SECURITY.md  
  → Security model and enforcement expectations.

---

## Enforcement Rule

If any authoritative documents conflict, the priority order is:

1. PROJECT_BRIEF.md
2. DECISIONS.md
3. ARCHITECTURE.md
4. SUCCESS_CRITERIA.md
5. Others

---

# 2. Supporting Reference Documents

These describe reality but do not define it.

They can be regenerated and should never override kernel decisions.

## Phase 1 — Audit

- REPO_AUDIT.md  
  → Snapshot of repository state

- SYSTEM_INVENTORY.md  
  → Enumerates components and systems

- ENVIRONMENT_MATRIX.md  
  → Defines environment variables and providers

- GAP_ANALYSIS.md  
  → Identifies differences between desired and actual state

---

## Additional Supporting Docs

- LOGGING_STANDARD.md  
  → Observability guidance

- PRE_DEPLOY_CHECKLIST.md  
  → Execution checklist (derived from authoritative docs)

- artifacts/provider-inventory.md  
  → Generated provider listing (must be regenerated when providers change)

- IMPLEMENTATION_PLAN.md  
  → High-level implementation planning

- WORKSTREAMS.md  
  → Workstream definitions

- MILESTONES.md  
  → Milestone tracking

- SCOPE.md  
  → System scope definition

- NON_GOALS.md  
  → Explicit non-goals

- TRUST_BOUNDARIES.md  
  → Trust boundary definitions

---

## Implementation Plans and Specs

The following are supporting reference only. They describe planned implementation but do not govern system behavior:

- AI_CLIENT_ARCHITECTURE.md
- AI_TASK_ADAPTERS.md
- AI_TASK_STATUS_PATTERN.md
- AI_UI_INTEGRATION_NOTES.md
- AI_UI_INTEGRATION_PLAN.md
- COLOR_SAMPLING_PLAN.md
- DASHBOARD_THUMBNAIL_STRATEGY.md
- EDITOR_COMPONENT_MAP.md
- EDITOR_EXPORT_MODE_PANEL_SPEC.md
- EDITOR_FINAL_UX_VALIDATION.md
- EDITOR_IMPLEMENTATION_PLAN.md
- EDITOR_INGESTION_FLOW_SPEC.md
- EDITOR_INGESTION_STATE_MACHINE.md
- EDITOR_LAYOUT_STATES.md
- EDITOR_MOBILE_FIRST_PLAN.md
- EDITOR_MODE_MIGRATION_MAP.md
- EDITOR_PANEL_PRIORITY.md
- EDITOR_REDESIGN_AUDIT.md
- EDITOR_REDESIGN_SPEC.md
- EDITOR_REFACTOR_SEQUENCE.md
- EDITOR_SECONDARY_PANEL_MAP.md
- EDITOR_SHELL_INVENTORY.md
- EDITOR_TEXT_ERASE_FIT.md
- EDITOR_TEXT_ERASE_PATCH_PLAN.md
- EDITOR_TEXT_ERASE_VALIDATION.md
- EDITOR_TOOL_FIT_PLAN.md
- EDITOR_UPLOAD_EXPORT_FIT.md
- EDITOR_UPLOAD_MODE_PANEL_SPEC.md
- EDITOR_UPLOAD_PROCESSING_UX.md
- EDITOR_VALIDATION_CHECKLIST.md
- ADD_TEXT_ACTION_PLAN.md
- EFFECT_MODE_PANEL_IMPLEMENTATION_PLAN.md
- HEAL_PIPELINE_SPEC.md
- LAYER_SYSTEM_SPEC.md
- TEXT_ENGINE_SPEC.md
- TEXT_STUDIO_CONTROLS_INTEGRATION.md
- TEXT_ENGINE_FONT_SUGGESTION_INTEGRATION.md
- EXPORT_PIPELINE_SPEC.md
- OCR_BOOTSTRAP_PLAN.md
- PRODUCTION_READINESS_REVIEW.md
- PRODUCTION_PROMOTION_CHECKLIST.md
- PREVIEW_VERIFICATION.md
- RELEASE_TEMPLATE.md
- UPLOAD_POLICY.md
- OBSERVABILITY.md

---

## Rule

Supporting docs must:

- reflect reality
- not introduce new decisions
- not redefine scope

---

# 3. Historical / Archive Documents

These must NOT influence current development.

## Candidates for Archive

The following documents contain outdated assumptions or superseded decisions:

- PROVIDER_REMOVAL_STRATEGY.md  
  → Superseded by ENVIRONMENT_MATRIX.md and DECISIONS.md

- PROVIDER_POLICY.md  
  → Superseded by current provider handling in ENVIRONMENT_MATRIX.md

- PROVIDER_QUARANTINE.md  
  → Historical record only; provider decisions now in ENVIRONMENT_MATRIX.md

---

## Archive Handling

Archived docs must be:

- moved to `/docs/archive/`
- clearly marked as non-authoritative
- never referenced in active workflows

---

# 4. Required Missing Documents

All Phase 0 kernel documents are present:

- SUCCESS_CRITERIA.md ✓

Kernel is complete.

---

# 5. Rules for Future Documents

Any new document must declare:

- classification: authoritative | supporting | historical
- owner (who maintains it)
- source of truth dependency

---

# 6. Anti-Drift Enforcement

Before any major change:

1. Check PROJECT_BRIEF.md
2. Check DECISIONS.md
3. Validate against ARCHITECTURE.md
4. Confirm SUCCESS_CRITERIA.md alignment

If conflict exists:
→ update authoritative docs FIRST
→ then implement

---

# 7. Invalid Patterns (Disallowed)

- Using GAP_ANALYSIS.md as a design document
- Making decisions outside DECISIONS.md
- Adding providers not reflected in ENVIRONMENT_MATRIX.md
- Implementing features not defined in PROJECT_BRIEF.md

---

# 8. Operational Discipline

Authoritative documents must:

- be reviewed before merge (for relevant changes)
- be updated alongside code changes
- never lag behind implementation

---