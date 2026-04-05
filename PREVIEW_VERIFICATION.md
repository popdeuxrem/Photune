# PREVIEW_VERIFICATION

## Purpose
This document defines the exact preview verification pass for Photune before any production promotion.

Preview is not considered successful because the build deployed.
Preview is successful only when the critical flows below behave correctly.

---

## Preconditions

Before starting preview verification:

- [ ] `npm run check` passed on the release candidate
- [ ] preview deployment completed successfully
- [ ] required preview environment variables are present
- [ ] release owner knows the commit SHA under test
- [ ] rollback target is identifiable

---

## Verification Order

Run checks in this exact order to reduce ambiguity.

### 1. Public Surface
Verify:
- [ ] `/` loads successfully
- [ ] branding/copy reflects `Photune`
- [ ] no obvious broken assets/styles
- [ ] browser console shows no immediate fatal errors

Record:
- pass/fail
- screenshot or note if branding/assets are wrong

---

### 2. Login Route
Verify:
- [ ] `/login` loads
- [ ] page is styled/rendered correctly
- [ ] no CSP or console errors block interaction

Record:
- pass/fail
- any network or console errors

---

### 3. Auth Callback Flow
Verify:
- [ ] authentication callback completes
- [ ] authenticated user reaches intended post-login surface
- [ ] protected routes no longer redirect unexpectedly after login

Record:
- pass/fail
- observed redirect path
- any auth callback errors/logs

---

### 4. Dashboard
Verify:
- [ ] authenticated `/dashboard` loads
- [ ] project list appears
- [ ] no unexpected empty/error state for known-good account
- [ ] browser console shows no critical errors

Record:
- pass/fail
- whether projects loaded
- any visible/logged persistence issues

---

### 5. Editor Open
Verify using an existing known-good project:

- [ ] `/editor/[projectId]` loads
- [ ] image/canvas context appears
- [ ] no immediate crash or blank critical surface
- [ ] no CSP/network/provider errors block load

Record:
- pass/fail
- project id used
- load behavior
- any errors

---

### 6. Save / Load Cycle
Verify:
- [ ] make a safe edit
- [ ] save completes
- [ ] reload/reopen preserves the saved state

Record:
- pass/fail
- whether persistence round-trip succeeded
- any server/log errors

---

### 7. Upload Validation
Verify:
- [ ] PNG upload succeeds
- [ ] JPEG upload succeeds
- [ ] WebP upload succeeds
- [ ] unsupported type is rejected early
- [ ] oversized file is rejected early

Record:
- pass/fail for each case
- user-visible error behavior

---

### 8. Billing Entry
Verify:
- [ ] upgrade modal opens
- [ ] Stripe checkout initiation succeeds
- [ ] redirect behavior is correct
- [ ] no deferred provider references appear in active UI

Record:
- pass/fail
- route behavior
- any Stripe or CSP issues

---

### 9. Groq Flow
Verify one intended Groq-backed user flow.

Examples:
- text rewrite
- text generation support flow

Check:
- [ ] request succeeds
- [ ] response is usable
- [ ] no env/provider errors appear

Record:
- pass/fail
- route/feature tested
- any provider/log errors

---

### 10. Cloudflare Flow
Verify one intended Cloudflare-backed user flow.

Examples:
- image inpaint
- worker-backed image route

Check:
- [ ] request succeeds
- [ ] response is usable
- [ ] no env/provider errors appear

Record:
- pass/fail
- route/feature tested
- any provider/log errors

---

### 11. CSP and Browser Security Check
On the flows above, inspect browser console and network behavior.

Verify:
- [ ] no unexpected CSP violations on critical flows
- [ ] no blocked required scripts/connections/images/frames
- [ ] Stripe flow is not broken by CSP
- [ ] editor flow is not broken by CSP

Record:
- pass/fail
- exact blocked origin/directive if any failure appears

---

### 12. Rate Limiting Sanity
Verify normal use does not trigger false-positive rate limiting.

Check:
- [ ] ordinary interaction does not produce unexpected `429`
- [ ] no critical normal flow is blocked under typical usage

Record:
- pass/fail
- affected route if any false positive occurs

---

## Preview Outcome Decision

### PASS
Preview is considered successful if:
- auth works
- dashboard works
- editor open/save/load works
- Stripe entry works
- one Groq flow works
- one Cloudflare flow works
- no critical CSP/runtime regression blocks intended flows

### CONDITIONAL PASS
Allowed only if:
- issue is minor
- issue is documented
- production impact is clearly low
- rollback path remains clear

### FAIL
Preview fails if any of the following occur:
- auth callback failure
- dashboard/project persistence failure
- editor load/save failure
- Stripe checkout failure
- critical CSP breakage
- canonical AI route failure for intended release surface
- repeated unexpected `429` on normal usage

---

## Evidence to Capture

For each failed or suspicious check, capture:
- timestamp
- route/feature
- screenshot if UI-visible
- browser console error
- network error
- relevant server/provider log note
- classification: code / config / CSP / provider / persistence

---

## Exit Rule

Do not promote to production until:
- preview status is PASS
- findings are recorded
- rollback target is known
- release owner explicitly approves promotion