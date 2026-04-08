# TEXT_STUDIO_CONTROLS_INTEGRATION

## Goal
Turn Text mode into a real editing surface for the currently selected Fabric text object.

## Scope
- font size
- text alignment
- tracking (charSpacing)
- line height

## Rules
- only apply updates to text-capable Fabric objects
- rerender canvas immediately
- persist via saveState()
- keep controls disabled or informational when no text object is selected

## Success criteria
- selecting a text object exposes editable controls
- updates apply live on canvas
- save/reload flow remains intact
