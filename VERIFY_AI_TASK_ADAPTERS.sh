#!/usr/bin/env bash
set -euo pipefail

sed -n '1,220p' src/shared/hooks/use-ai-rewrite-task.ts
echo '---'
sed -n '1,220p' src/shared/hooks/use-ai-font-detection-task.ts
echo '---'
sed -n '1,220p' src/shared/hooks/use-ai-project-title-task.ts
echo '---'
sed -n '1,320p' src/features/editor/components/Panels/RewriteModePanel.tsx
echo '---'
sed -n '1,200p' AI_TASK_ADAPTERS.md

npm run lint
npm run typecheck
npm run build
npm run smoke
npm run check
