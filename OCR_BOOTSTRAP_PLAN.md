# OCR_BOOTSTRAP_PLAN

## Goal
Define how OCR/bootstrap should fit into the ingestion pipeline.

## Principle
OCR/bootstrap is part of editor readiness, but it should not make the product feel frozen or ambiguous.

## Recommended model

### Option A — Blocking bootstrap
Use only if OCR/text region detection is required before editing can begin.

Flow:
- upload
- processing
- OCR/bootstrap
- ready

Risk:
- slower time to first interaction

### Option B — Deferred bootstrap
Preferred unless OCR is strictly required for initial editor usability.

Flow:
- upload
- processing
- editor ready
- OCR/bootstrap continues in background
- text-related features become richer when OCR finishes

Benefit:
- faster perceived readiness
- lower first-run friction

## Recommended for Photune
Use **deferred bootstrap** unless current product architecture requires OCR before any useful editing is possible.

## Required OCR states
- `not_started`
- `running`
- `complete`
- `failed`

## UI guidance
If OCR is deferred:
- editor can become ready first
- text/rewrite features may show:
  - `Scanning image text...`
  - or a disabled explanation until OCR completes

If OCR fails:
- image editing should still work where possible
- failure should degrade text/AI assistance, not destroy the whole session