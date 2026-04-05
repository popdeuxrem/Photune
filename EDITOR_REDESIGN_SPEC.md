# EDITOR_REDESIGN_SPEC

## Goal
Redesign the Photune editor into a production-quality, mobile-first editing workspace.

## Design Principles
- canvas first
- one active tool context at a time
- progressive disclosure
- strong primary action hierarchy
- fast first-run comprehension
- mobile ergonomics before desktop density

## Target Layout Model

### Mobile
- top bar: back, project title, undo/redo, save/export
- main area: dominant canvas
- bottom tool nav: compact icons for primary modes
- active tool panel: bottom sheet or slide-over panel
- contextual CTA when no image exists

### Tablet/Desktop
- top bar: project + global actions
- left rail: tool mode selection
- center: canvas
- right/context panel: active tool settings only

## Core Modes
- Upload
- Text
- Erase
- Rewrite
- Background
- Layers
- Export

Only one mode panel may be active at a time.

## New Project State
The initial state must show:
- upload image CTA
- supported file types
- concise explanation that AI/editor tools activate after content exists

## Disabled States
If no image/text selection exists:
- AI actions should explain why they are unavailable
- disabled controls should not look broken

## Success Criteria
- user can understand the first action within 3 seconds
- canvas occupies the majority of viewport
- tool switching is obvious
- save/export remains accessible
- mobile usage feels intentional, not compressed