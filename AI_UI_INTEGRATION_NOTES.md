# AI_UI_INTEGRATION_NOTES

## Text mode integration
Use `TextModePanel` with:
- `imageDataUrl`
- `onApplyFontSuggestion`

The panel remains usable even if AI fails.

## New-project title integration
Use `NewProjectTitleAssist` wherever project naming is handled for `/editor/new` or equivalent upload/new-project flow.

## Rules
- AI suggestions must remain optional
- user manual edits win
- fallback results must not block saving
