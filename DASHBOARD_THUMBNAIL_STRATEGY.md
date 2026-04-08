# DASHBOARD_THUMBNAIL_STRATEGY

## Purpose
Define how project thumbnails should be sourced, rendered, and degraded on the Photune dashboard.

This document exists to prevent dashboard preview behavior from becoming inconsistent across:
- grid view
- list view
- slow connections
- missing preview images
- uploaded images stored as data URLs
- future transformed or derived preview assets

---

## Current Thumbnail Source

### Current source of truth
Dashboard preview images currently come from:

- `project.original_image_url`

This may contain:
- a remote URL
- a durable data URL
- `null`

### Current usage
`ProjectCard` uses `original_image_url` as the preview image source.

---

## Current Constraints

### 1. Not all projects may have a preview
A project may exist with:
- no `original_image_url`
- incomplete media state
- older saved data

### 2. Data URL previews can be large
If `original_image_url` is a base64 data URL:
- it is durable
- but it can be large
- it may be expensive to render repeatedly in dense grids

### 3. Current dashboard must remain resilient
The dashboard must not fail or become unusable when:
- preview image is missing
- preview image is slow
- preview image fails to decode
- project data is partial

---

## Required Thumbnail Behavior

## 1. Primary Preview Rule
Use `project.original_image_url` if present.

## 2. Fallback Rule
If no valid preview exists:
- render a neutral placeholder
- do not show broken-image UI
- keep project open/delete actions available

## 3. Grid View Rule
Grid previews should:
- prioritize visual clarity
- crop consistently
- avoid layout shift
- maintain a fixed aspect ratio

## 4. List View Rule
List previews should:
- remain compact
- use smaller preview containers
- prioritize scanability over visual drama

---

## Placeholder Strategy

### Current recommendation
Use a simple static placeholder state:
- icon fallback
- neutral background
- no image decoding dependency

This is the safest current strategy.

### Placeholder requirements
The placeholder should:
- preserve layout size
- avoid CLS
- look intentional
- not imply failure unless there is a real error

---

## Error Behavior

If thumbnail loading fails:
- do not block dashboard render
- do not show a noisy error state per card
- fall back to the placeholder presentation

Optional future improvement:
- local per-card image error state

---

## Loading Behavior

### Current recommended baseline
Use card-level static containers within the dashboard skeleton.
Do not add per-image spinners unless necessary.

Reason:
- skeleton already covers initial loading state
- per-card image spinners add visual noise

---

## LQIP vs BlurHash Recommendation

## Recommended first step: LQIP
If thumbnail fidelity is improved later, use **LQIP first**.

### Why LQIP first
- simpler implementation path
- easier compatibility with current image URL model
- lower coordination cost than BlurHash
- better fit for current dashboard structure

### Why not BlurHash first
BlurHash adds:
- encoding pipeline requirements
- additional metadata storage
- more implementation complexity
- more coordination between upload/save/dashboard paths

BlurHash is reasonable later, but not as the first media enhancement.

---

## Future Thumbnail Architecture Options

### Option A — Current source only
Use `original_image_url` directly.

Pros:
- simplest
- no extra pipeline

Cons:
- may be large
- not optimized for dashboard density

### Option B — Derived thumbnail URL
Store a separate lightweight preview asset.

Pros:
- better dashboard performance
- lower render cost

Cons:
- requires asset generation/storage policy

### Option C — Stored LQIP + full preview
Store:
- low-quality preview
- full original preview

Pros:
- best perceived loading quality
- premium dashboard feel

Cons:
- requires additional generation/storage flow

---

## Recommended Current Policy

### Now
Use:
- `original_image_url` as the preview source
- placeholder fallback when missing
- no BlurHash yet
- no per-card complex loading state yet

### Next enhancement
Introduce:
- LQIP or lightweight derived thumbnail
only after:
- current dashboard behavior is validated
- preview image source policy is stable
- upload/save/reload path is fully reliable

---

## Implementation Guardrails

Any future thumbnail enhancement must define:
- source of preview asset
- fallback behavior
- failure behavior
- storage cost
- whether previews are durable
- whether previews are safe to cache
- whether previews are different from editor source images

---

## Success Criteria
The dashboard thumbnail system is acceptable when:
- missing images do not break cards
- dashboard layout remains stable
- previews are visually coherent in grid and list modes
- future image enhancements can be added without redesigning the dashboard again