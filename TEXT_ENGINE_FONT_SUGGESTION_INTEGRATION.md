# TEXT_ENGINE_FONT_SUGGESTION_INTEGRATION

## Goal
Apply AI-detected font suggestions to the currently selected Fabric text object.

## Scope
- read current active object from editor store
- allow TextModePanel to call into EditorClient
- only apply to text-capable Fabric objects
- persist changes through saveState()

## Non-goals
- full variable font support
- OCR-driven font matching
- font preloading orchestration
- text color/spacing inference

## Success criteria
- Suggest font runs from Text mode
- selected text object receives family + weight
- canvas rerenders immediately
- state is persisted with saveState()
