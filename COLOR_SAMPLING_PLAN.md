# COLOR_SAMPLING_PLAN

## Goal
Add a bounded color-sampling utility for text objects.

## Scope
- sample image pixels around a target point
- compute an average RGB color
- expose a helper that returns a hex color
- use it when creating new text objects
- allow later reuse for selected-text refresh

## Non-goals
- OCR-aware regional sampling
- luminance-based contrast correction
- palette clustering
- background healing integration

## Success criteria
- new text objects receive a sampled fill color when possible
- fallback color remains deterministic if sampling fails
- no regression in upload/save/reload/export