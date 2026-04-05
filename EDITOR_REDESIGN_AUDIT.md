# EDITOR_REDESIGN_AUDIT

## Purpose
This document audits the current Photune editor UX and identifies the design/system issues that must be corrected before a production-quality editor release.

## Current Observed State
Verified from mobile preview:
- editor route loads successfully
- editor shell is functional enough to render
- layout is not production-quality on mobile
- canvas is visually under-prioritized
- tool panels consume excessive width
- top bar is dense and unclear
- primary workflow is not obvious for a new project

## Major Defects

### 1. Canvas Is Not the Primary Surface
The editing canvas does not dominate the viewport.
Large side-panel chrome competes with or obscures the work area.

Impact:
- poor first impression
- reduced editing confidence
- weak task focus

### 2. Mobile Layout Is Desktop-First
The current shell appears adapted from a desktop mental model rather than designed for mobile constraints.

Impact:
- cramped controls
- poor reachability
- wasted viewport
- weak interaction clarity

### 3. New Project State Is Ambiguous
The user lands in a partially active tool environment without a strong "start here" path.

Impact:
- confusing first-run experience
- unclear prerequisite for AI actions
- hidden upload/import priority

### 4. Action Hierarchy Is Weak
Top-level actions compete with each other visually.
Important tasks are not clearly separated from secondary tool controls.

Impact:
- reduced usability
- slower onboarding
- more accidental exploration than guided workflow

### 5. Tool Architecture Is Overexposed
Too many tool categories are visible simultaneously.

Impact:
- cognitive overload
- poor mode clarity
- low signal-to-noise ratio

## Redesign Priorities

1. canvas-first layout
2. mobile-first interaction model
3. explicit first-run/upload state
4. single-active-tool-panel model
5. clearer action hierarchy
6. bottom-sheet / drawer tool patterns on mobile