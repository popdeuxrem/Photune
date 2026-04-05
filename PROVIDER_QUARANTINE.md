# PROVIDER_QUARANTINE

## Purpose
This file tracks deferred provider surfaces that still exist in the repository but are not part of the active production path.

## Canonical Active Providers
- Stripe
- Mailgun
- Groq
- Cloudflare

## Deferred Providers
- (none remaining - all removed)

## Quarantine Rules
1. Deferred providers must not spread into new runtime paths.
2. Deferred providers must not be referenced from shared active UI without explicit justification.
3. Deferred provider routes/libs should be isolated until removed.
4. Removal must be inventory-backed, not assumption-backed.

## Removal Status

### Paystack
- Status: removed in Batch 4
- Removal basis:
  - runtime surfaces (`src/app/api/payments/paystack/`, `src/shared/lib/paystack.ts`) deleted
  - no shared UI references existed
- Follow-up:
  - keep inventory checks in place to prevent reintroduction

### NowPayments
- Status: removed in Batch 3
- Removal basis:
  - runtime surfaces (`src/app/api/payments/crypto/`, `src/shared/lib/nowpayments.ts`) deleted
  - shared UI reference neutralized in Batch 2
- Follow-up:
  - keep inventory checks in place to prevent reintroduction

### Resend
- Status: removed in Batch 1
- Removal basis:
  - no runtime references under `src/`
  - dependency/env surface only
- Follow-up:
  - keep inventory checks in place to prevent reintroduction

## Required Workflow
1. inventory reference
2. classify as active/dead/transitional
3. quarantine shared/runtime references
4. rerun validation
5. remove dead surfaces in small batches