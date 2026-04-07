# EDITOR_LAYERS_SECONDARY_FIT

## Goal
Fit Layers mode and any remaining secondary editor panels into the shell-owned active mode model.

---

## Layers Mode

### Desired behavior
Layers mode should:
- present object/layer-related controls only
- help user understand current object context
- avoid mixing export/upload/AI/text controls
- remain compact for mobile sheet

### Required states

#### 1. No content
- explain layer controls need content first

#### 2. No object selection
- explain what to select for layer actions

#### 3. Object available
- show layer/object controls

---

## Secondary Panels

### Goal
Classify remaining panels outside active mode model:
1. Migrate into existing primary mode
2. Keep as contextual subsection
3. Remove if obsolete

---

## Success Criteria
- Layers is first-class mode
- remaining panels classified
- no legacy catch-all dominates
- `npm run check` green