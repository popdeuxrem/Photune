# EDITOR_TOOL_FIT_PLAN

## Goal
Fit existing editor tools into the new shell model without rewriting all tool logic at once.

The new shell model expects:
- one active mode at a time
- mobile sheet / drawer for active mode
- compact desktop mode rail
- contextual panel content
- canvas-first interaction

This plan defines the order and rules for adapting current tools.

---

## Refactor Rule
For each tool mode:

1. identify current panel/component ownership
2. isolate which controls belong to that mode
3. move or wrap those controls into the active-mode panel model
4. preserve existing behavior where possible
5. validate before moving to the next mode

Do not refactor multiple major tool behaviors in one pass unless required.

---

## Priority Order

### Batch 1 — Core first-run flow
- Upload
- Export

Reason:
- upload is the first-run path
- export is a core completion path
- both are high-value and easy to verify

### Batch 2 — Core editing flow
- Text
- Erase

Reason:
- these are central editing actions
- they define whether the shell feels coherent for real use

### Batch 3 — AI-assisted flow
- Rewrite
- Background

Reason:
- these depend on existing content and more contextual UI

### Batch 4 — Structural/editor-management flow
- Layers
- any remaining secondary panels

Reason:
- these are important, but not the first-run success path

---

## Mode Fit Rules

### Upload
Must support:
- empty-state upload CTA
- contextual upload access when project already has content
- supported file type messaging
- clear error states

### Export
Must support:
- top-bar access
- contextual export panel or sheet
- clear format/action choices
- success/failure feedback

### Text
Must support:
- obvious entry into text-related actions
- contextual activation when selection exists
- reduced clutter when no text is selected

### Erase
Must support:
- obvious action naming
- contextual settings in one panel
- no conflict with unrelated tool controls

### Rewrite
Must support:
- clear preconditions
- disabled explanation when unavailable
- text-selection-aware behavior

### Background
Must support:
- clear image/content dependency
- contextual controls only

### Layers
Must support:
- object/layer context
- compact panel presentation
- not over-dominating mobile space

---

## Validation Strategy
After each mode batch:
- `/editor/new` still works
- existing project still opens
- save/load still works
- active mode panel opens correctly
- mobile and desktop both remain usable
- `npm run check` remains green