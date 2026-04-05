# PROVIDER_REMOVAL_STRATEGY

## Purpose
This file defines how deferred providers are removed from Photune safely.

Deferred providers:
- Paystack
- NowPayments
- Resend

## Rules
1. Do not delete provider code blindly.
2. Inventory first.
3. Remove shared/runtime references before route/library deletion.
4. Keep changes small and validation-backed.
5. After each batch, rerun:
   - `npm run smoke:providers`
   - `npm run check`

## Removal Order

### Batch 1 — Documentation / metadata / env guidance
- tighten decisions
- tighten environment comments
- tighten quarantine docs

### Batch 2 — Shared UI/runtime spread
- remove deferred provider references from shared components and active route surfaces

### Batch 3 — Inactive route/lib quarantine
- isolate deferred provider route trees and shared libs

### Batch 4 — Dependency cleanup
- remove package dependencies only after runtime references are proven gone

## Required Evidence Before Destructive Removal
- provider inventory output
- grep path list
- validation before change
- validation after change