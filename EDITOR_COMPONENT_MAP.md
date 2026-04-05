# EDITOR_COMPONENT_MAP

## Purpose
Map the current editor into refactorable UI regions.

## Target Shell Regions

### 1. EditorShell
Responsibilities:
- overall layout
- responsive viewport structure
- mode selection state
- panel open/close state

### 2. EditorTopBar
Responsibilities:
- project title
- back/home
- undo/redo
- save
- export

### 3. EditorCanvasRegion
Responsibilities:
- canvas visibility
- dominant work surface
- empty/new state fallback when no image exists

### 4. EditorModeNav
Responsibilities:
- primary mode switching
- mobile bottom nav
- desktop left rail equivalent

### 5. EditorToolPanel
Responsibilities:
- active tool controls only
- contextual/drawer/sheet rendering
- close/dismiss behavior

### 6. EditorEmptyState
Responsibilities:
- upload CTA
- supported file types
- explanation of inactive tools before content exists

---

## Expected State Model

### Global UI State
- activeMode
- isToolPanelOpen
- hasImage
- selectedObjectType
- canUndo
- canRedo
- isSaving
- canExport

### Suggested Modes
- upload
- text
- erase
- rewrite
- background
- layers
- export

---

## Current Refactor Rule
Existing editor logic should remain intact where possible.
The shell should wrap and reorganize current tools before tools are rewritten.