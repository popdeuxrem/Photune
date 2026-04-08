# EDITOR_INGESTION_STATE_MACHINE

## Purpose
Define the state machine for Photune editor ingestion.

## States

### `idle`
Meaning:
- no image loaded
- user has not selected a file yet

Visible UI:
- empty state
- upload CTA
- supported file types / size

Transitions:
- `idle` -> `selecting`

---

### `selecting`
Meaning:
- file picker is open or being triggered

Visible UI:
- optional transient state
- usually too short-lived to require large UI changes

Transitions:
- `selecting` -> `idle` if user cancels
- `selecting` -> `uploading` if file chosen

---

### `uploading`
Meaning:
- a valid file has been chosen
- file is being read / object URL created / initial ingest started

Visible UI:
- upload accepted indicator
- progress or spinner
- upload CTA disabled
- no ambiguous empty state

Transitions:
- `uploading` -> `processing`
- `uploading` -> `error`

---

### `processing`
Meaning:
- image is being prepared for the editor
- canvas/image/OCR/bootstrap work is happening

Visible UI:
- processing loader
- optional message such as:
  - "Preparing editor"
  - "Scanning image"
  - "Loading text regions"

Transitions:
- `processing` -> `ready`
- `processing` -> `error`

---

### `ready`
Meaning:
- canvas contains usable content
- core editor is interactive

Visible UI:
- image visible
- active modes available
- optional one-time usage hint

Transitions:
- `ready` -> `processing` if user replaces image
- `ready` -> `error` only if a runtime failure occurs

---

### `error`
Meaning:
- ingest or bootstrap failed

Visible UI:
- explicit error message
- retry CTA
- upload CTA available again

Transitions:
- `error` -> `idle`
- `error` -> `selecting`

---

## State Ownership

### Shell-owned state
This state machine should be owned by `EditorClient.tsx` or the editor shell layer.

### Tool panels
Tool panels consume the state but should not own the ingestion state machine.

### Canvas layer
Canvas receives the result of the pipeline but should not be the only source of ingestion truth.