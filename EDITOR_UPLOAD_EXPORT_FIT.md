# EDITOR_UPLOAD_EXPORT_FIT

## Goal
Fit Upload and Export into the new editor shell so they work cleanly across:
- `/editor/new`
- existing projects
- mobile mode nav + tool sheet
- desktop contextual panel

---

## Upload Mode

### Desired behavior
Upload must be available in two contexts:

#### 1. New project / empty state
- prominent upload CTA
- clear supported file types
- upload opens file picker immediately
- invalid files fail early and clearly

#### 2. Existing project / active editor
- Upload mode remains available from the mode nav
- user can replace or add source image intentionally
- upload controls are shown in the active panel, not scattered across unrelated UI

### Current implementation risks
- upload logic may be duplicated between empty state and batch processor panel
- upload entry may still be tied too closely to legacy panel placement
- mobile users may not understand where upload lives after initial import

### Fit rule
There must be one canonical upload entry handler, with multiple UI triggers.

---

## Export Mode

### Desired behavior
Export must remain obvious and reliable in the new shell.

#### 1. Primary access
- export action remains reachable from the top bar

#### 2. Mode access
- Export mode in the mode nav opens export options in the active tool panel/sheet

### Current implementation risks
- export may exist only as a top-bar action without panel integration
- export controls may not map cleanly into the one-active-mode model

### Fit rule
Top-bar export is a shortcut.
Export mode is the full export workspace.

---

## Batch 1 Success Criteria
- `/editor/new` gives a clear upload-first flow
- upload mode works from mode nav
- upload uses one canonical validation/handler path
- export is still reachable from top bar
- export mode opens a clear export panel/sheet
- mobile and desktop both remain coherent
- `npm run check` stays green