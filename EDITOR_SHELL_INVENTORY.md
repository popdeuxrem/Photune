# EDITOR_SHELL_INVENTORY

## Purpose
This document inventories the current Photune editor shell implementation before refactor work begins.

---

## 1. Route Entry

### Editor route files
```
src/app/(main)/editor/[projectId]/page.tsx
src/features/editor/components/EditorClient.tsx
```

### Current route entrypoint
- **File**: `src/app/(main)/editor/[projectId]/page.tsx`
- **Notes**: Server component that renders `EditorClient` with project data

---

## 2. Main Editor Shell Entry

### Current shell component
- **File**: `src/features/editor/components/EditorClient.tsx`
- **Why this is the shell entry**: Contains the full editor layout (Header, Sidebar, Canvas, JobStatusPanel)

### Immediate child regions
- **top bar**: `src/features/editor/components/Header.tsx`
- **mode nav / tool rail**: `src/features/editor/components/Toolbar/Sidebar.tsx`
- **canvas region**: `src/features/editor/components/Canvas.tsx`
- **side panel / tool panel**: `src/features/editor/components/Toolbar/Panels/*`
- **empty state**: Implied in `BatchProcessorPanel` (upload input)
- **save/export surface**: `Header.tsx` + `ExportModal.tsx`

---

## 3. Top Bar Inventory

### Candidate files
- `src/features/editor/components/Header.tsx`

### Current responsibilities
- project title display
- navigation back to dashboard
- undo/redo buttons
- save button
- export modal
- theme toggle

### Problems observed
- Dense on mobile
- All controls visible simultaneously
- No mobile-specific optimizations

---

## 4. Tool Navigation Inventory

### Candidate files
- `src/features/editor/components/Toolbar/Sidebar.tsx`

### Current responsibilities
- Tabs-based navigation: AI, Remove, Effects, Stamps, Brand, Batch, Info
- Persistent left rail (w-80 width)
- Tool switching via Radix Tabs

### Problems observed
- Persistent wide sidebar on mobile consumes majority of viewport
- All 7 tabs visible simultaneously
- Desktop-first mental model

---

## 5. Tool Panel Inventory

### Candidate files
- `src/features/editor/components/Toolbar/Panels/AiToolsPanel.tsx`
- `src/features/editor/components/Toolbar/RemovePanel.tsx`
- `src/features/editor/components/Toolbar/Panels/EffectsPanel.tsx`
- `src/features/editor/components/Toolbar/StampPanel.tsx`
- `src/features/editor/components/Toolbar/BrandKitPanel.tsx`
- `src/features/editor/components/Toolbar/BatchProcessorPanel.tsx`
- `src/features/editor/components/Toolbar/InfoPanel.tsx`
- `src/features/editor/components/TextProperties.tsx`

### Current responsibilities
- Active tool controls
- AI rewrite/background/text tools
- Erase/remove tools
- Image effects
- Stamps/shapes
- Brand kit
- Batch processing/upload
- Project info

### Problems observed
- Multiple panels always rendered in DOM
- No contextual-only rendering
- Selection-based `TextProperties` nested in sidebar

---

## 6. Canvas Region Inventory

### Candidate files
- `src/features/editor/components/Canvas.tsx`

### Current responsibilities
- Fabric.js canvas initialization
- Selection event handling
- Object:added/modified/removed events
- Delete shortcut handling
- Duplicate shortcut handling

### Problems observed
- Canvas container has shadow/border styling baked in
- Not dominant in mobile viewport

---

## 7. Empty / New Project State

### Candidate files
- `src/features/editor/components/Toolbar/BatchProcessorPanel.tsx`

### Current behavior
- `/editor/new` shows full editor with sidebar
- Upload input exists in BatchProcessorPanel
- No explicit "no image" empty state
- Canvas renders empty until image uploaded

### Problems observed
- New project lands in active tool environment
- No clear first-action path
- Tools appear enabled without content

---

## 8. Upload Ingestion Path

### Candidate files
- `src/shared/lib/security/upload-validation.ts`
- `src/features/editor/components/Toolbar/BatchProcessorPanel.tsx`

### Current path
- file input location: `BatchProcessorPanel.tsx` line 131
- validation helper: `upload-validation.ts`
- preview/loading path: `handleFiles` function
- where uploaded image enters editor state: Fabric canvas `BackgroundImage`

---

## 9. Persistence / Save Path

### Candidate files
- `src/features/editor/lib/actions.ts`
- `src/features/editor/components/Header.tsx`

### Current save path
- save trigger: `Header.tsx` handleSave + Ctrl+S via custom event
- save handler: `actions.ts` saveProject function
- load handler: `EditorClient.tsx` useEffect with loadFromJSON
- project hydration path: Server component passes `initialProjectData` to client

---

## 10. State Ownership Map

### Shell-level state (EditorClient.tsx)
- keyboard shortcuts (handleKeyDown)
- initial data loading
- keyboard event listeners

### Canvas-level state (useAppStore.ts)
- `fabricCanvas`: Fabric.js canvas instance
- `activeObject`: currently selected object
- `history`/`historyIndex`: undo/redo stack
- `jobs`: AI processing job queue

### Tool-level state
- Individual panels manage their own local state
- `TextProperties.tsx` reads from store

### Persistence/network state
- `actions.ts`: Supabase project read/write

---

## 11. Refactor Mapping to Target Regions

### EditorShell
- **current file(s)**: `EditorClient.tsx`
- **migration notes**: Wrapper for entire editor; needs responsive refactor

### EditorTopBar
- **current file(s)**: `Header.tsx`
- **migration notes**: Needs simplification for mobile; keep save/export/undo/redo

### EditorCanvasRegion
- **current file(s)**: `Canvas.tsx`
- **migration notes**: Container styling needs to move to shell; canvas should dominate

### EditorModeNav
- **current file(s)**: `Sidebar.tsx`
- **migration notes**: Needs mobile bottom nav conversion; 7 tabs → icon nav

### EditorToolPanel
- **current file(s)**: All `Panels/*` components
- **migration notes**: Need contextual-only rendering; one panel at a time

### EditorEmptyState
- **current file(s)**: `BatchProcessorPanel.tsx` (partial)
- **migration notes**: Needs explicit empty state for `/editor/new`

---

## 12. Immediate Refactor Candidates

### Safe extraction candidates
- `Header.tsx` - can be simplified in place
- `Canvas.tsx` - container styling can move to shell
- `Sidebar.tsx` - can become conditional based on viewport

### High-risk files
- `EditorClient.tsx` - contains keyboard shortcuts + layout
- `actions.ts` - save/persistence logic
- `useAppStore.ts` - undo/redo state management

### Files that should not be rewritten first
- Individual tool panels (AiToolsPanel, EffectsPanel, etc.)
- These should be adapted to new shell after shell is refactored

---

## 13. Decision Before Refactor

Complete this inventory before:
- [x] Introducing EditorShell abstraction
- [x] Understanding current shell structure
- [ ] Mapping state ownership
- [ ] Identifying empty state gap

Next step: Shell extraction phase begins after this inventory is acknowledged.