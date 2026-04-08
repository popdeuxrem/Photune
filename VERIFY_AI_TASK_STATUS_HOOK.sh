#!/usr/bin/env bash
set -euo pipefail

sed -n '1,220p' src/shared/hooks/use-ai-task.ts
echo '---'
sed -n '1,220p' src/shared/components/ai-task-status.tsx
echo '---'
sed -n '1,200p' AI_TASK_STATUS_PATTERN.md
echo '---'
sed -n '1,320p' src/features/editor/components/Panels/RewriteModePanel.tsx

npm run lint
npm run typecheck
npm run build
npm run smoke
npm run check
