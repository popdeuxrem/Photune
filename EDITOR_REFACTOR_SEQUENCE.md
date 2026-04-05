# EDITOR_REFACTOR_SEQUENCE

## Objective
Sequence the editor redesign so risk stays bounded and validation is possible after each step.

## Sequence

### Step 1 — Inventory Current Editor Components
- locate shell component
- locate top bar
- locate tool rail
- locate side panels
- locate empty/new state behavior

Deliverable:
- file map of current editor shell

Validation:
- current editor still builds unchanged

---

### Step 2 — Introduce Shell Wrapper
- create `EditorShell` abstraction
- move existing layout into wrapper without major visual changes

Validation:
- editor route still loads
- save/export still visible
- no tool regression from structure-only change

---

### Step 3 — Introduce Explicit Empty State
- detect no-image/new-project state
- show upload-first UI
- keep inactive tools explained

Validation:
- `/editor/new` shows clear first action
- image upload still works

---

### Step 4 — Add Mobile Mode Navigation
- add bottom nav for primary modes
- wire mode switching state
- do not yet remove desktop rail on larger screens

Validation:
- mobile editor navigation works
- canvas remains visible
- mode switching does not break tools

---

### Step 5 — Add Mobile Tool Sheet
- render active mode controls in one sheet/drawer
- ensure dismiss behavior works
- ensure only one panel is active

Validation:
- tool panel opens/closes correctly
- canvas remains usable
- no overlap blocks critical actions

---

### Step 6 — Simplify Top Bar
- reduce visible controls to primary actions
- preserve save/export/undo/redo behavior

Validation:
- top actions remain accessible
- no loss of critical functionality

---

### Step 7 — Desktop/Tablet Responsive Pass
- adapt shell for larger screens
- optionally retain left rail on wide screens
- keep one contextual tool panel model

Validation:
- mobile and desktop both remain usable
- canvas remains primary in both layouts

---

### Step 8 — Tool-by-Tool Fit
- adapt current tools to active mode panel model
- improve disabled state language
- improve action clarity

Validation:
- each tool still reachable
- no hidden critical actions
- save/export unaffected