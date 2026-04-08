# EFFECT_MODE_PANEL_IMPLEMENTATION_PLAN

## Goal
Add a first-class Effect mode panel for text objects.

## Files to update
- `src/features/editor/components/Panels/EffectModePanel.tsx`
- `src/features/editor/components/EditorClient.tsx`

## Optional supporting utility
- `src/features/editor/lib/text-effects.ts`

## Panel responsibilities
- read selected text effect values
- allow editing of those values
- call a single `onUpdateTextEffects(...)` callback
- stay text-only for this pass

## EditorClient responsibilities
- derive current selected text effect values
- expose `handleUpdateTextEffects(...)`
- rerender + `saveState()`
- pass state into `EffectModePanel`

## Data contract

### Selected text effect state

{
fill: string;
stroke: string;
strokeWidth: number;
opacity: number;
shadowColor: string;
shadowBlur: number;
shadowOffsetX: number;
shadowOffsetY: number;
}

## Update contract
`onUpdateTextEffects(input: Partial<SelectedTextEffects>)`

## Behavior
- if selected object is not text: informational empty state
- if selected object is text: full controls available
- every apply updates the live object and saves state

## Success criteria
- Effect mode becomes a real editor surface
- no broad text-engine rewrite required
- no canvas architecture changes required