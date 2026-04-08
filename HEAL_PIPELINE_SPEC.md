# HEAL_PIPELINE_SPEC

## Goal
Define a non-destructive heal/in-paint pipeline for removing or relocating content.

## Principle
Do not implement destructive "erase".
Implement heal as a pipeline with snapshot discipline.

## Required stages
1. select target object
2. derive mask
3. capture pre-heal snapshot
4. invoke in-paint service
5. insert heal layer
6. remove or hide original object
7. save state

## Constraints
- must support undo
- must not mutate the only source image irreversibly
- must fail clearly
- must not block the entire editor if heal fails

## Deferred items
- dilation padding
- crop-based inference
- grain matching
- patch stitching
- background blending metrics