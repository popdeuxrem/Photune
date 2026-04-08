# M2 — Editor Serialization and Load/Save Hardening

## Objective

Stabilize the editor persistence contract so saved project payloads can be loaded, validated, and evolved without corrupting user work.

## Scope

This slice covers:

- canvas serialization normalization
- canvas deserialization guards
- malformed payload containment
- backward-safe project loading
- explicit editor-side hydration boundaries

This slice does NOT cover:

- new AI features
- new export formats
- collaboration
- billing changes

## Required Outcomes

1. Saved canvas payloads have a defined normalization path.
2. Editor load path rejects or safely contains malformed project data.
3. New project and existing project hydration paths are explicitly separated.
4. Save/load behavior is deterministic for supported project payloads.
5. Serialization changes are documented as a compatibility surface.

## Validation Gates

- npm run lint
- npm run typecheck
- npm run build
- npm run smoke

## Target Files

Expected likely touch points:

- src/features/editor/**
- src/shared/store/**
- src/shared/lib/persistence/**
- PROJECT_BRIEF.md
- DECISIONS.md
- ARCHITECTURE.md

## Risks

- breaking older saved project payloads
- partial hydration causing editor instability
- silent canvas corruption during deserialize

## Rollback Rule

If load/save determinism regresses, revert the entire M2 patch set before further feature work.