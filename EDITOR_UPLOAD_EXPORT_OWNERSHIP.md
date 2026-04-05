# EDITOR_UPLOAD_EXPORT_OWNERSHIP

## Purpose
This document defines shell-level ownership for Upload and Export in the Photune editor.

## Canonical Ownership

### Upload
Owner: `EditorClient.tsx`

Responsibilities:
- own the canonical hidden file input
- own the canonical upload trigger (`openUploadPicker`)
- own the canonical validated ingestion path (`handleFiles`)
- expose upload triggers to:
  - `EditorEmptyState`
  - Upload mode panel
  - any top-level upload action

**Current State:**
- ✓ `fileInputRef` centralized
- ✓ `handleUploadClick` trigger
- ✓ `handleFileChange` with validation
- ✓ Hidden file input in shell
- ✓ EditorEmptyState wired to shell

### Export
Owner: `EditorClient.tsx`

Responsibilities:
- own the canonical export trigger (`handleExport`)
- expose export action to:
  - `Header.tsx` top-bar shortcut
  - Export mode panel/sheet
- keep export action intent centralized even if detailed export UI lives elsewhere

**Current State:**
- Export flow via ExportModal in Header
- Export mode in EditorModeNav targets shell state

## Rule
UI components may trigger Upload/Export.
Shell owns Upload/Export entrypoints.

## Non-Goal
This step does not rewrite:
- upload validation policy
- export internals
- file generation logic
- canvas serialization logic