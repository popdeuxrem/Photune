# DECISIONS

## D-001: Canonical Naming
- Product: Photun
- Repo: Photune (unchanged)
- Remove "phoTextAI" usage going forward

## D-002: Deployment Platform
- Primary: Vercel
- No multi-platform deployment in MVP

## D-003: Database
- Supabase PostgreSQL is the single source of truth

## D-004: Auth
- Supabase Auth (SSR via @supabase/ssr)

## D-005: AI Providers
- Primary: Groq (text)
- Secondary: Cloudflare AI (image/background)
- No uncontrolled multi-provider sprawl

## D-006: Payments
- Canonical current billing provider: Stripe
- NowPayments has been removed (Batch 3)
- Paystack has been removed (Batch 4)
- Any future reactivation requires an explicit decision update plus validation and rollback coverage

## D-007: Email Provider
- Canonical current provider: Mailgun
- Resend has been removed from the active dependency/env surface
- Any future email provider change requires an explicit decision update
- Rationale: Mailgun already backs the current implementation path, so standardizing on it is the lowest-risk stabilization step

## D-010: Deferred Provider Policy
- Deferred providers may remain in quarantined code during transition, but they are not part of the active production path
- Deferred providers must not spread into shared active UI, route handlers, or provider orchestration
- Removal must be inventory-backed and performed in small batches

