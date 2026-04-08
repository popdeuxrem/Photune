#!/usr/bin/env bash
set -euo pipefail

grep -n "handleApplyFontSuggestion" src/features/editor/components/EditorClient.tsx
sed -n '90,115p' src/features/editor/components/EditorClient.tsx

npm run typecheck
npm run lint
npm run build
npm run smoke
npm run check
