# EDITOR_TEXT_ERASE_FIT

## Goal
Fit Text and Erase into the new editor shell as first-class active modes.

The new shell requires:
- one active mode at a time
- mobile sheet presentation on small screens
- contextual panel presentation on larger screens
- shell-owned mode state
- reduced clutter and clearer task focus

---

## Text Mode

### Desired behavior
Text mode should:
- expose only text-relevant controls
- feel useful both when no text is selected and when text is selected
- avoid showing unrelated AI/background/export controls in the same panel

### Required states

#### 1. No text selected
- show concise guidance
- show available text entry actions
- do not appear broken

#### 2. Text selected
- surface current text controls clearly
- prioritize common text actions

### Fit rule
Text mode is the contextual home for text editing.

---

## Erase Mode

### Desired behavior
Erase mode should:
- expose erase-related controls only
- clearly communicate what can be erased
- keep configuration focused

### Required states

#### 1. No usable target
- explain what the user needs to do first

#### 2. Erase-ready state
- show current erase controls/settings

### Fit rule
Erase mode should not compete with text/background/export controls.

---

## Batch Success Criteria
- Text mode appears as first-class mode
- Erase mode appears as first-class mode
- current text/erase behavior preserved
- mobile sheet and desktop panel coherent
- `npm run check` stays green