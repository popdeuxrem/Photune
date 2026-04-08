# TEXT_EFFECTS_SPEC

## Goal
Introduce first-class, non-destructive text effects for Photune.

These effects must:
- apply to editable text objects
- persist through save/reload
- remain exportable
- avoid rasterizing text during normal editing

## Scope

### Phase 1
Support these text-object effect properties:
- fill
- stroke
- strokeWidth
- opacity
- shadowColor
- shadowBlur
- shadowOffsetX
- shadowOffsetY

### Phase 2
Support these if the current Fabric/runtime path proves stable:
- blend/composite mode
- batch style application across selected text objects

### Deferred
- perspective warp
- mask-based occlusion
- AI heal-under-text
- procedural texture matching
- workerized live effect rendering

## Principle
Effects are object state, not DOM presentation state.

If an effect is not serialized into the editor document model, it is not a real effect.

## Supported Object Types
Phase 1 applies only to:
- i-text
- text
- textbox

## Canonical Effect Model

### Fill
- property: `fill`
- type: string color
- default: `#111111`

### Stroke
- property: `stroke`
- type: string color
- default: transparent / unset

### Stroke width
- property: `strokeWidth`
- type: number
- default: `0`

### Opacity
- property: `opacity`
- type: number
- range: `0` to `1`
- default: `1`

### Shadow
Use Fabric shadow state:
- `color`
- `blur`
- `offsetX`
- `offsetY`

Default:
- no shadow

## Persistence Contract

### Save
Effects must be part of canvas/object JSON so they survive save.

### Reload
Effects must restore exactly on:
- project reload
- editor reopen
- dashboard reopen to editor

### Export
Effects must appear in exported output exactly as shown on canvas.

## UI Contract

### Effect mode behavior
If no text object is selected:
- show an informational state
- do not show destructive disabled clutter

If a text object is selected:
- show current effect values
- allow direct editing
- update canvas immediately
- persist through `saveState()`

## Initial Control Set

### Color
- fill color input
- stroke color input

### Numeric controls
- stroke width
- opacity
- shadow blur
- shadow offset X
- shadow offset Y

### Shadow color
- shadow color input

## Guardrails
- do not apply text effects to non-text objects in this pass
- do not silently coerce missing state into destructive values
- do not flatten text into the background during editing
- do not block editing if an effect field is unset

## Success Criteria
- selected text object can receive fill/stroke/shadow/opacity changes
- changes render immediately on canvas
- changes survive save/reload
- changes appear in export
- validation remains green