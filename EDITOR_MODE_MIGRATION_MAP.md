# EDITOR_MODE_MIGRATION_MAP

## Purpose
Map each target editor mode to its current implementation surface and migration target.

---

## Upload
### Current likely surface
- `BatchProcessorPanel.tsx`
- upload handlers in editor shell/client
- upload validation helper

### Target surface
- `EditorEmptyState`
- upload mode panel content
- shared upload entrypoint

### Migration notes
- unify empty-state upload and in-editor upload
- avoid duplicate upload logic

---

## Text
### Current likely surface
- text-related panel/component(s) under `Panels/*`
- selection-dependent canvas actions

### Target surface
- contextual Text mode panel

### Migration notes
- show only text-relevant controls in Text mode
- avoid exposing text controls as persistent clutter

---

## Erase
### Current likely surface
- erase controls in one or more existing panels

### Target surface
- contextual Erase mode panel

### Migration notes
- keep configuration local to Erase mode
- avoid mixing with unrelated AI/background controls

---

## Rewrite
### Current likely surface
- AI/text rewrite panel(s) and route triggers

### Target surface
- contextual Rewrite mode panel

### Migration notes
- explain disabled state when no text/selection exists
- keep request/response flow intact

---

## Background
### Current likely surface
- background or inpaint-related controls

### Target surface
- contextual Background mode panel

### Migration notes
- only show meaningful controls once image content exists

---

## Layers
### Current likely surface
- layer/object selection controls if present

### Target surface
- contextual Layers mode panel

### Migration notes
- keep it compact
- preserve object awareness

---

## Export
### Current likely surface
- top-bar action and/or export panel/modal

### Target surface
- top-bar trigger + contextual Export mode panel/sheet

### Migration notes
- export must remain easy to reach
- avoid burying export in clutter