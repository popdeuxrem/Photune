# AI_UI_INTEGRATION_PLAN

## Goal
Connect existing AI task adapters to real editor/dashboard flows.

## Scope
1. Text mode:
   - allow font suggestion from image data
   - surface task state using the shared AI task-status model

2. New project flow:
   - allow title suggestion from uploaded image data
   - keep manual naming as the primary fallback

## Constraints
- do not block upload/editor readiness on AI
- do not require AI success for core flows
- do not overwrite user-entered names automatically after manual edits
- keep fallback behavior explicit and safe

## Success criteria
- Text mode can trigger font suggestion
- New-project flow can trigger title suggestion
- AI failures do not block editing or saving
- validation remains green
