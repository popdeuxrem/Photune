# EDITOR_INGESTION_FLOW_SPEC

## Goal
Define the first-run ingestion pipeline for Photune so image upload transitions the user through a clear, production-quality workflow.

The current editor shell is not enough by itself.
Photune needs an explicit ingestion pipeline that communicates:
- file accepted
- file processing in progress
- editor preparation in progress
- OCR/bootstrap state
- ready-for-editing state
- failure state

---

## Target User Flow

### Step 1 — Idle
The user sees:
- upload-first empty state
- supported types
- size limit
- clear CTA

### Step 2 — Selecting
The system opens the file picker.

### Step 3 — Uploading / Ingesting
After a file is selected:
- the UI should immediately acknowledge the file
- the upload CTA should transition into a progress or processing state
- conflicting controls should be temporarily disabled

### Step 4 — Processing
The system prepares the editor state:
- decode image
- initialize canvas placement
- load image into runtime state
- prepare OCR/bootstrap if applicable

### Step 5 — Ready
The editor transitions into the active editing state:
- canvas visible
- image present
- editing modes enabled
- optional first-use guidance visible

### Step 6 — Failed
If ingestion fails:
- explicit message shown
- user can retry
- system does not silently remain in an ambiguous empty state

---

## Product Requirement
Photune must never leave the user unsure whether:
- the file picker worked
- the file was accepted
- the image is still loading
- the editor is processing
- the system is broken

---

## Required Pipeline States
- `idle`
- `selecting`
- `uploading`
- `processing`
- `ready`
- `error`

These states should be represented in shell-owned UI state.

---

## Success Criteria
After image selection:
1. acceptance is visible immediately
2. progress/processing state is visible
3. canvas does not appear half-initialized
4. editor only becomes interactive when ready
5. OCR/bootstrap is either complete or safely deferred
6. failure is explicit and recoverable