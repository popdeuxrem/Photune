#!/usr/bin/env bash
set -euo pipefail

python3 - <<'PY'
from pathlib import Path

path = Path("src/features/editor/components/EditorClient.tsx")
text = path.read_text()

old = """  const handleApplyFontSuggestion = useCallback(
    (input: { family: string; weight: string }) => {
      if (!fabricCanvas || !activeObject) return;

      const isTextObject =
        activeObject.type === 'i-text' ||
        activeObject.type === 'text' ||
        activeObject.type === 'textbox';

      if (!isTextObject) return;

      activeObject.set({
        fontFamily: input.family,
        fontWeight: input.weight,
      });

      fabricCanvas.renderAll();
      saveState();
    },
    [activeObject, fabricCanvas, saveState]
  );
"""

new = """  const handleApplyFontSuggestion = useCallback(
    (input: { family: string; weight: string }) => {
      if (!fabricCanvas || !activeObject) return;

      const isTextObject =
        activeObject.type === 'i-text' ||
        activeObject.type === 'text' ||
        activeObject.type === 'textbox';

      if (!isTextObject) return;

      const textObject = activeObject as fabric.IText | fabric.Text | fabric.Textbox;
      textObject.set('fontFamily', input.family);
      textObject.set('fontWeight', input.weight);

      fabricCanvas.renderAll();
      saveState();
    },
    [activeObject, fabricCanvas, saveState]
  );
"""

if old not in text:
    raise SystemExit("expected handleApplyFontSuggestion block not found")

path.write_text(text.replace(old, new, 1))
PY
