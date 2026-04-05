# EDITOR_UPLOAD_MODE_PANEL_SPEC

## Goal
Define how Upload mode should behave inside the new editor shell.

## Responsibilities
Upload mode panel should:
- expose the canonical upload trigger owned by `EditorClient.tsx`
- show supported file types
- show size limit
- explain replacement behavior when content already exists
- avoid owning its own separate file input if shell ownership already exists

## Required States

### 1. New Project / No Content
The panel should:
- reinforce the upload-first action
- show: PNG, JPEG, WebP, 10 MB max

### 2. Existing Project / Has Content
The panel should:
- allow replacing or re-importing intentionally
- explain that uploading a new image may replace or reset the working context

## Required Actions
- primary CTA: `Upload image`
- optional secondary text: supported types, max size, replacement note

## Non-Goals
This panel does not own validation policy, file input state, or file parsing logic. Those remain shell-owned.