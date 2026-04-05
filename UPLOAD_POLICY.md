# UPLOAD_POLICY

## Purpose
This document defines the current file upload policy for Photune.

Photune currently supports image-based editing workflows. Upload validation exists to:
- reduce malformed input risk
- control resource usage
- make user-facing failures deterministic
- avoid ambiguous downstream parser/editor errors

---

## Current Allowed File Types

Allowed MIME types:
- `image/png`
- `image/jpeg`
- `image/webp`

Allowed file extensions:
- `.png`
- `.jpg`
- `.jpeg`
- `.webp`

---

## Currently Rejected File Types

Rejected by default:
- `image/svg+xml`
- `application/pdf`
- GIF
- HEIC/HEIF
- arbitrary binary files
- empty files
- files without a recognizable allowed MIME type

These may be added later only through an explicit decision and validation update.

---

## Maximum File Size

Current maximum:
- `10 MB`

Rationale:
- conservative first-pass limit
- protects editor/browser memory profile
- limits accidental oversized uploads

---

## Validation Rules

A file upload must fail if:
1. no file is provided
2. file size is `0`
3. file size exceeds `10 MB`
4. MIME type is not in the allowed list
5. extension does not match the allowed set when extension-based checks are used

Validation should occur as early as possible in the active ingestion path.

---

## Error Categories

User-safe validation failures:
- missing file
- empty file
- unsupported type
- file too large

Errors should be explicit and deterministic.

---

## Logging Rules

Upload validation failures may log:
- event name
- route or surface
- file type
- file size
- safe error category

Do not log:
- raw file contents
- full image payloads
- arbitrary user content blobs

---

## Future Expansion Rule

Any change to:
- allowed MIME types
- max size
- upload transport
- server-side file processing

must update:
- this document
- relevant validation code
- verification steps
- security documentation if trust boundaries change