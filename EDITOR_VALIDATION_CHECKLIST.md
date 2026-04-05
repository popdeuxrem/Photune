# EDITOR_VALIDATION_CHECKLIST

## Purpose
This checklist validates the editor redesign as it is implemented.

## Core Route Validation
- [ ] `/editor/new` loads
- [ ] existing `/editor/[projectId]` loads
- [ ] no critical console/runtime errors appear

## New Project State
- [ ] clear upload CTA visible
- [ ] supported file types communicated
- [ ] inactive tools are explained rather than appearing broken

## Canvas Priority
- [ ] canvas is the dominant surface on mobile
- [ ] canvas remains visible when tool panel is open
- [ ] editor chrome does not consume majority width on mobile

## Navigation
- [ ] mode switching is obvious
- [ ] only one tool context is open at a time
- [ ] top bar keeps critical actions accessible
- [ ] save and export remain reachable

## Editing Flow
- [ ] upload works
- [ ] object/text selection still works
- [ ] save works
- [ ] reload restores state
- [ ] export still works

## Mobile Quality
- [ ] controls are tappable
- [ ] no accidental overlay blocks main actions
- [ ] bottom nav / tool sheet interaction feels intentional

## Regression Checks
- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] `npm run smoke`
- [ ] `npm run check`