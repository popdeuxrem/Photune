# EDITOR_UPLOAD_EXPORT_PATCH_PLAN

## Objective
Implement Upload and Export as the first two tool modes in the new shell with minimal behavior change.

---

## Upload Patch Sequence

### Step 1 — Identify current upload surfaces
Inventory:
- `EditorEmptyState`
- `BatchProcessorPanel.tsx`
- any `handleFiles` / file input refs in `EditorClient.tsx`
- upload validation helper

### Step 2 — Define one canonical upload trigger path
Target:
- one `openUploadPicker()` entrypoint
- one `handleFiles()` ingestion path
- one `validateImageUpload()` validation path

### Step 3 — Wire Upload mode to shell state
Target behavior:
- when `activeMode === 'upload'`, active panel shows upload-focused controls
- on mobile, Upload mode opens in tool sheet
- on desktop, Upload mode uses contextual panel

### Step 4 — Remove duplicate/conflicting upload UI
Do not delete logic blindly.
Instead:
- keep one visible upload surface per context
- reduce legacy duplicate entrypoints if they cause confusion

---

## Export Patch Sequence

### Step 1 — Identify current export surfaces
Inventory:
- top-bar export action
- any export modal/panel component
- export handlers/utilities

### Step 2 — Keep top-bar export as shortcut
Target behavior:
- top-bar export remains available
- activating it can open Export mode if appropriate

### Step 3 — Create Export mode panel
Target behavior:
- `activeMode === 'export'` shows export options in the panel/sheet
- export options are grouped and obvious
- export is not buried in unrelated controls

### Step 4 — Normalize export action ownership
Target:
- top bar triggers export mode or export action intentionally
- panel contains the detailed export choices

---

## Files Likely Involved
Expected candidates:
- `src/features/editor/components/EditorClient.tsx`
- `src/features/editor/components/EditorEmptyState.tsx`
- `src/features/editor/components/Toolbar/BatchProcessorPanel.tsx`
- `src/features/editor/components/Header.tsx`
- export-related panel/modal component(s)
- upload validation helper

---

## Non-Goals for This Batch
Do not:
- redesign text/erase/rewrite/background/layers yet
- rewrite canvas behavior
- change persistence flow
- introduce new upload formats
- redesign export internals beyond shell fit