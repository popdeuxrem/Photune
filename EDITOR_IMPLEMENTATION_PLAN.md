# EDITOR_IMPLEMENTATION_PLAN

## Goal
Refactor the Photune editor into a mobile-first, canvas-first workspace without breaking the existing editing route, save flow, or core tool access.

## Primary Rule
Do not redesign individual tools first.
Redesign the editor shell first.

## Refactor Strategy
Implement in this order:
1. shell layout
2. new project empty state
3. mobile tool navigation
4. contextual tool panel model
5. desktop/tablet adaptation
6. tool-by-tool fit into the new shell

---

## Phase 1 — Shell Extraction
### Goal
Separate the editor shell structure from tool content.

### Tasks
- identify current editor shell component(s)
- isolate:
  - top bar
  - left tool rail
  - canvas region
  - side panel
- define a single editor layout container

### Output
- shell components are explicit
- existing behavior preserved

### Constraint
No major visual redesign yet. This phase is structural.

---

## Phase 2 — New Project Empty State
### Goal
Make `/editor/new` understandable immediately.

### Tasks
- add explicit empty-state CTA:
  - upload image
  - supported file types
  - explanation that AI tools activate after content exists
- hide or disable irrelevant actions with explanation

### Output
- new user knows the first action immediately

### Constraint
Do not yet redesign all tool panels.

---

## Phase 3 — Mobile Navigation Model
### Goal
Replace persistent wide tool chrome on mobile.

### Tasks
- introduce bottom tool navigation for core modes
- introduce one active tool sheet/drawer at a time
- keep canvas visible while tool panel is open
- ensure dismiss/close behavior is clear

### Output
- mobile editor becomes usable and intentional

### Constraint
Canvas remains primary surface.

---

## Phase 4 — Top Bar Simplification
### Goal
Make critical actions obvious and compact.

### Tasks
- keep only:
  - back/home
  - project title
  - undo
  - redo
  - save
  - export
- move non-critical controls out of primary bar if needed

### Output
- better action hierarchy
- less mobile crowding

---

## Phase 5 — Contextual Tool Panels
### Goal
Show only the active mode's controls.

### Tasks
- define primary modes:
  - Upload
  - Text
  - Erase
  - Rewrite
  - Background
  - Layers
  - Export
- render only one tool context at a time
- use selection state to drive contextual actions

### Output
- reduced cognitive overload
- clearer task flow

---

## Phase 6 — Responsive Desktop/Tablet Adaptation
### Goal
Preserve a richer layout for larger screens without harming mobile.

### Tasks
- use left rail on larger viewports if appropriate
- keep contextual panel constrained
- ensure canvas remains dominant

### Output
- one coherent responsive editor architecture

---

## Phase 7 — Tool Fit and UX Polish
### Goal
Adapt individual tools to the new shell.

### Tasks
- verify each current tool can live inside the contextual panel model
- improve disabled states
- improve selection-based affordances
- improve export and save feedback

### Output
- tool UX is coherent within the new shell