#!/usr/bin/env bash
set -euo pipefail

python3 - <<'PY'
from pathlib import Path

path = Path("src/features/editor/components/EditorClient.tsx")
text = path.read_text()

old = """      const textObject = activeObject as fabric.IText | fabric.Text | fabric.Textbox;
      textObject.set('fontFamily', input.family);
      textObject.set('fontWeight', input.weight);

      fabricCanvas.renderAll();
      saveState();
"""

new = """      const textObject = activeObject as fabric.IText | fabric.Text | fabric.Textbox;
      textObject.fontFamily = input.family;
      textObject.fontWeight = input.weight;

      fabricCanvas.renderAll();
      saveState();
"""

if old not in text:
    raise SystemExit("expected textObject.set block not found")

path.write_text(text.replace(old, new, 1))
PY
