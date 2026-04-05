#!/usr/bin/env bash
set -euo pipefail

echo '=== paystack ==='
grep -RIn --exclude-dir=node_modules --exclude-dir=.next -e 'paystack' -e 'PAYSTACK_' src .env.example package.json || true
echo

echo '=== nowpayments ==='
grep -RIn --exclude-dir=node_modules --exclude-dir=.next -e 'nowpayments' -e 'NOWPAYMENTS_' src .env.example package.json || true
echo

echo '=== resend ==='
grep -RIn --exclude-dir=node_modules --exclude-dir=.next -e 'resend' -e 'RESEND_' src .env.example package.json || true
echo

echo '=== stripe ==='
grep -RIn --exclude-dir=node_modules --exclude-dir=.next -e 'stripe' -e 'STRIPE_' src .env.example package.json || true
echo

echo '=== mailgun ==='
grep -RIn --exclude-dir=node_modules --exclude-dir=.next -e 'mailgun' -e 'MAILGUN_' src .env.example package.json || true
