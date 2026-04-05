#!/usr/bin/env bash
set -euo pipefail

# Optional installer for Kilo CLI.
# This script intentionally does NOT run automatically during devcontainer bootstrap.
# Reason: external npm/global install + postinstall network dependency can fail independently of repo setup.

if ! command -v npm >/dev/null 2>&1; then
  echo "error: npm is not installed or not on PATH" >&2
  exit 1
fi

if ! command -v node >/dev/null 2>&1; then
  echo "error: node is not installed or not on PATH" >&2
  exit 1
fi

echo "Node: $(node -v)"
echo "npm:  $(npm -v)"

# Install/update globally using the official package name documented by Kilo.
npm install -g @kilocode/cli

if command -v kilo >/dev/null 2>&1; then
  echo "kilo installed: $(kilo --version || true)"
else
  echo "error: install completed but 'kilo' is not on PATH" >&2
  exit 1
fi

cat <<'EOM'

Kilo CLI installed.

Next steps:
1. Run: kilo
2. Authenticate with your Kilo account or configure provider env/config.
3. Project-level config can live in ./opencode.json per current Kilo CLI docs.

EOM
