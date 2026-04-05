#!/usr/bin/env bash
set -euo pipefail

echo '=== Deferred provider runtime references under src/ ==='
grep -RIn --exclude-dir=node_modules --exclude-dir=.next \
  -e 'paystack' -e 'PAYSTACK_' \
  -e 'nowpayments' -e 'NOWPAYMENTS_' \
  -e 'resend' -e 'RESEND_' \
  src || true

echo
echo '=== Deferred provider references outside src/ ==='
grep -RIn --exclude-dir=node_modules --exclude-dir=.next \
  -e 'paystack' -e 'PAYSTACK_' \
  -e 'nowpayments' -e 'NOWPAYMENTS_' \
  -e 'resend' -e 'RESEND_' \
  .env.example package.json .github/workflows *.md 2>/dev/null || true