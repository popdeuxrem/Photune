# RISKS

## R-001: Naming Inconsistency (HIGH)
Multiple product identities across repo.
Impact: branding, deployment, payments, SEO.

## R-002: Schema Mismatch (HIGH)
README vs actual Supabase schema diverge.
Impact: broken persistence.

## R-003: Validation Gaps (HIGH)
No test/typecheck gates.
Impact: silent breakage.

## R-004: Service Sprawl (HIGH)
Multiple AI, payment, email providers.
Impact: complexity, failure modes.

## R-005: Security Gaps (MEDIUM)
Partial headers, unclear secret handling.
Impact: vulnerability exposure.

## R-006: Deployment Ambiguity (MEDIUM)
No runbook or environment matrix.
Impact: inconsistent deployments.

