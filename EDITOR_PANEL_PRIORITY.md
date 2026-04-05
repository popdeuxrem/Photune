# EDITOR_PANEL_PRIORITY

## Objective
Define which editor panels should be adapted first inside the new shell.

## Priority 1 — Upload
Why:
- first-run success path
- directly tied to `/editor/new`
- already partially identified in current implementation

Success condition:
- user can clearly upload and start editing without confusion

---

## Priority 2 — Export
Why:
- core completion path
- should remain obvious in top-bar + panel model

Success condition:
- export remains visible, simple, and reliable

---

## Priority 3 — Text
Why:
- central editing mode
- likely one of the most-used workflows

Success condition:
- text actions feel contextual, not cluttered

---

## Priority 4 — Erase
Why:
- high-value editing action
- should map well into one active-mode panel

Success condition:
- erase configuration is self-contained and clear

---

## Priority 5 — Rewrite
Why:
- important AI-assisted flow
- needs clear preconditions and disabled-state messaging

Success condition:
- rewrite feels intentional and discoverable

---

## Priority 6 — Background
Why:
- useful but content-dependent
- should not dominate first-run UI

Success condition:
- background controls appear only when meaningful

---

## Priority 7 — Layers
Why:
- structurally important, but not first-run critical

Success condition:
- layers/object controls remain accessible without crowding the editor