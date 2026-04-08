# LAYER_SYSTEM_SPEC

## Goal
Implement a deterministic, semantic layer system for Photune.

## Principle
Layers are not just creation order.
They carry a functional role and a stable ordering policy.

## Layer Roles

### background
Purpose:
- raw uploaded image
- editor base image

Ordering:
- always bottom-most

### heal
Purpose:
- generated repair patches
- in-paint or corrective background fills

Ordering:
- above background
- below user content

### mask
Purpose:
- semantic masks
- hidden support geometry
- erase/isolation helpers

Ordering:
- above heal
- below visible user content
- usually hidden/non-exported unless explicitly enabled

### vector
Purpose:
- shapes
- logos
- generic user-added non-text objects

Ordering:
- above background/heal/mask
- below typography by default

### text
Purpose:
- primary editable text content
- most likely user-facing content

Ordering:
- highest default priority

## Canonical Ordering
background < heal < mask < vector < text

## Required behaviors
- list layers in UI from top-most to bottom-most
- click layer in panel selects object on canvas
- visibility toggle
- lock toggle
- move up / move down
- delete
- save state after every structural change

## Non-goals
Do not implement in this pass:
- nested recursive tree UI
- grouping UI
- OCR-driven semantic IDs
- batch layer operations
- cross-document layer presets