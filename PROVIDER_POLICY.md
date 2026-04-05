# PROVIDER_POLICY

## Canonical Providers

### Billing
- Primary: Stripe

### Email
- Primary: Mailgun

### AI
- Text: Groq
- Image / worker-backed operations: Cloudflare

## Deferred Providers
These may still exist in the repository during transition, but they are not approved for expansion:
- Paystack
- NowPayments
- Resend

## Policy
1. No new runtime usage of deferred providers may be introduced.
2. Deferred providers must not spread to new app routes, shared runtime modules, or feature code.
3. Existing deferred code may remain temporarily only until explicitly removed or quarantined.
4. CI should fail if deferred providers appear in disallowed runtime locations.

## Allowed Runtime Surface
Approved runtime provider references:
- `stripe`
- `mailgun`
- `groq`
- `cloudflare`

## Enforcement Intent
This file governs validation, not just documentation.
Any new provider usage must update:
- `DECISIONS.md`
- `ENVIRONMENT_MATRIX.md`
- this file
- smoke tests / CI gates

