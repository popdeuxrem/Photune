# EXPORT_PIPELINE_SPEC

## Goal
Define a bounded export pipeline for Photune.

## Near-term scope
- export current canvas reliably
- PNG / JPG / WebP
- user-visible progress state
- non-blocking UI behavior where possible

## Deferred scope
- worker-based flattening
- EXIF reinjection
- Display P3 profile work
- multi-resolution render manager
- 4x upscale defaults for every export

## Rule
Export must remain predictable before it becomes advanced.