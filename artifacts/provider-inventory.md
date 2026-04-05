# PROVIDER INVENTORY

## Generated
2026-04-05T01:34:54Z

## Paystack
src/app/api/payments/paystack/checkout/route.ts:3:import { createPaystackCheckout, handleSuccessfulPayment } from '@/shared/lib/paystack';
src/app/api/payments/paystack/checkout/route.ts:30:      provider: 'paystack',
src/app/api/payments/paystack/webhook/route.ts:3:import { verifyTransaction, handleSuccessfulPayment } from '@/shared/lib/paystack';
src/app/api/payments/paystack/webhook/route.ts:9:  // const signature = req.headers.get('x-paystack-signature');
src/shared/lib/paystack.ts:8:const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
src/shared/lib/paystack.ts:9:const PAYSTACK_BASE_URL = 'https://api.paystack.co';
src/shared/lib/paystack.ts:34:  if (!PAYSTACK_SECRET_KEY) {
src/shared/lib/paystack.ts:41:  const customerRes = await fetch(`${PAYSTACK_BASE_URL}/customer`, {
src/shared/lib/paystack.ts:60:  const checkoutRes = await fetch(`${PAYSTACK_BASE_URL}/checkout`, {
src/shared/lib/paystack.ts:63:      'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
src/shared/lib/paystack.ts:98:  if (!PAYSTACK_SECRET_KEY) {
src/shared/lib/paystack.ts:102:  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
src/shared/lib/paystack.ts:105:      'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
src/shared/lib/paystack.ts:131:  if (!PAYSTACK_SECRET_KEY) {
src/shared/lib/paystack.ts:136:    `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
src/shared/lib/paystack.ts:139:        'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
.env.example:40:PAYSTACK_SECRET_KEY=
.env.example:41:PAYSTACK_PUBLIC_KEY=

## NowPayments
src/app/api/payments/crypto/checkout/route.ts:3:import { createCryptoInvoice, getSupportedCurrencies, getTierPrice } from '@/shared/lib/nowpayments';
src/app/api/payments/crypto/checkout/route.ts:31:      provider: 'nowpayments',
src/app/api/payments/crypto/webhook/route.ts:2:import { handleCryptoWebhook } from '@/shared/lib/nowpayments';
src/app/api/payments/crypto/webhook/route.ts:9:  // const hmac = req.headers.get('x-nowpayments-sig');
src/shared/lib/nowpayments.ts:8:const NOWPAYMENTS_API_KEY = process.env.NOWPAYMENTS_API_KEY;
src/shared/lib/nowpayments.ts:9:const NOWPAYMENTS_IPN_SECRET = process.env.NOWPAYMENTS_IPN_SECRET;
src/shared/lib/nowpayments.ts:10:const NOWPAYMENTS_BASE_URL = 'https://api.nowpayments.io/v1';
src/shared/lib/nowpayments.ts:34:  if (!NOWPAYMENTS_API_KEY) {
src/shared/lib/nowpayments.ts:39:    `${NOWPAYMENTS_BASE_URL}/estimate?amount=${amountUSD}&currency_from=usd&currency_to=${currency}`,
src/shared/lib/nowpayments.ts:42:        'x-api-key': NOWPAYMENTS_API_KEY!,
src/shared/lib/nowpayments.ts:67:  if (!NOWPAYMENTS_API_KEY) {
src/shared/lib/nowpayments.ts:76:  const response = await fetch(`${NOWPAYMENTS_BASE_URL}/invoice`, {
src/shared/lib/nowpayments.ts:79:      'x-api-key': NOWPAYMENTS_API_KEY!,
src/shared/lib/nowpayments.ts:115:  if (!NOWPAYMENTS_API_KEY) {
src/shared/lib/nowpayments.ts:120:    `${NOWPAYMENTS_BASE_URL}/payment/${paymentId}`,
src/shared/lib/nowpayments.ts:123:        'x-api-key': NOWPAYMENTS_API_KEY!,
.env.example:44:NOWPAYMENTS_API_KEY=
.env.example:45:NOWPAYMENTS_IPN_SECRET=

## Resend
.env.example:59:RESEND_API_KEY=
.env.example:60:RESEND_FROM_EMAIL=
package.json:42:    "resend": "^6.8.0",
