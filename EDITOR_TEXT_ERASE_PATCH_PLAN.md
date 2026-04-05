# EDITOR_TEXT_ERASE_PATCH_PLAN

## Objective
Adapt existing Text and Erase controls into the shell-owned active mode model.

---

## Step 1 — Inventory existing Text/Erase surfaces
Identify:
- current text-related panel/component(s)
- current erase-related panel/component(s)
- any selection-dependent UI

Likely candidates:
- `Panels/*`
- `Toolbar/*`
- `TextProperties.tsx`
- `RemovePanel.tsx`

---

## Step 2 — Define thin mode panels
Create:
- `TextModePanel`
- `EraseModePanel`

These panels should:
- receive callbacks/state as props
- remain presentation-oriented
- avoid owning canvas logic

---

## Step 3 — Route Text/Erase through `activeMode`
In `EditorClient.tsx`:
- `activeMode === 'text'` → `TextModePanel`
- `activeMode === 'erase'` → `EraseModePanel`

---

## Step 4 — Keep underlying behavior intact
Do not rewrite:
- text object creation/edit internals
- erase engine internals
- Fabric/canvas behavior
- save/load behavior

---

## Files Likely Involved
- `src/features/editor/components/EditorClient.tsx`
- `src/features/editor/components/Panels/*`
- `src/features/editor/components/TextProperties.tsx`
- `src/features/editor/components/Toolbar/RemovePanel.tsx`

---

## Non-Goals
Do not:
- redesign Rewrite mode yet
- redesign Background mode yet
- rewrite selection engine