# EDITOR_UPLOAD_PROCESSING_UX

## Goal
Define the visible UI for the ingestion pipeline.

## 1. Idle State
Visible:
- upload-first card
- supported formats
- max size
- concise explanation of what happens next

CTA:
- `Upload image`

---

## 2. Uploading State
Visible:
- accepted file acknowledgement
- spinner or progress bar
- concise label:
  - `Uploading image`
  - or `Preparing image`

Behavior:
- disable duplicate upload taps
- do not show the same empty-state CTA unchanged

---

## 3. Processing State
Visible:
- full-canvas or center-stage processing screen
- short message, examples:
  - `Preparing editor...`
  - `Scanning image...`
  - `Loading text regions...`

Behavior:
- editor chrome should remain stable
- tools should not appear fully active yet
- avoid exposing half-ready canvas state

---

## 4. Ready State
Visible:
- image on canvas
- active tool modes available
- optional short instructional overlay

Suggested first-use guidance:
- `Tap text to edit`
- `Use Upload to replace image`
- `Use Export when ready`

---

## 5. Error State
Visible:
- explicit error box
- retry CTA
- explanation in user-safe language

Examples:
- `Upload failed. Please try again.`
- `This image could not be processed.`
- `The editor is still initializing. Please retry.`

---

## UX Rules

### Rule 1
Do not leave the user in the old empty state after a valid file is accepted.

### Rule 2
Do not show a half-initialized editor without explanation.

### Rule 3
Do not activate advanced tools before the image is actually ready.

### Rule 4
Use short, deterministic status language.
Avoid vague messages.