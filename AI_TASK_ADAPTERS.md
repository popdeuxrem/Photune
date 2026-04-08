# AI_TASK_ADAPTERS

## Goal
Keep UI panels thin by moving common AI task wiring into dedicated hooks.

## Current adapters
- useAIRewriteTask
- useAIFontDetectionTask
- useAIProjectTitleTask

## What adapters own
- calling the AI client
- fallback detection
- task state wiring
- reset behavior

## What panels own
- input controls
- rendering
- applying results to editor state

## Rule
Panels should not reimplement fallback detection for the same AI task repeatedly.
