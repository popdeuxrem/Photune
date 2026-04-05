# EDITOR_EXPORT_MODE_PANEL_SPEC

## Goal
Define how Export mode should behave inside the new editor shell.

## Responsibilities
Export mode panel should:
- present export as a clear completion step
- expose the canonical export action owned by `EditorClient.tsx` or current export owner
- avoid burying export behind unrelated controls

## Access Model
Export must remain available through:
- top-bar shortcut
- Export mode in mode navigation

The top bar is the shortcut.
The Export mode panel is the detailed workspace.

## Required Panel Content
- export heading
- concise explanation of what export will do
- available export actions/options already supported by the app
- clear primary export CTA

## Required States
### 1. Export available
- user can trigger export normally

### 2. Export unavailable
- clear explanation if export depends on image/canvas content and none exists

## Non-Goals
This panel does not invent new export formats, rewrite export internals, or change save/persistence behavior.