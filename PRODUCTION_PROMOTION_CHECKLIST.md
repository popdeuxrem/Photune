# PRODUCTION_PROMOTION_CHECKLIST

## Purpose
This checklist governs the final decision to promote Photune from preview to production.

Production promotion is allowed only after:
- repository validation is green
- preview verification is complete
- required environments are correct
- rollback is understood
- release ownership is explicit

---

## 1. Release Identity

- [ ] Product name remains `Photune`
- [ ] Commit SHA to promote is known
- [ ] Branch/source of promotion is known
- [ ] Release owner is assigned
- [ ] Production verifier is assigned

Record:
- Commit SHA: 38f0961640e047f4ae64d4b1ab0b677cbcd12bf6
- Release owner:
- Production verifier:

---

## 2. Repository Validation Gate

Confirm the exact candidate being promoted still passes validation.

Required command:

```bash
npm ci --legacy-peer-deps
npm run check
```

- [ ] npm run lint passed
- [ ] npm run typecheck passed
- [ ] npm run build passed
- [ ] npm run smoke passed
- [ ] npm run check passed

If any item fails, promotion is blocked.

---

## 3. Preview Verification Gate

Reference:
- PREVIEW_VERIFICATION.md

Promotion requires a PASS preview outcome.

- [ ] Public surface passed
- [ ] Login route passed
- [ ] Auth callback passed
- [ ] Dashboard passed
- [ ] Editor open passed
- [ ] Save/load cycle passed
- [ ] Upload validation behaved correctly
- [ ] Stripe checkout initiation passed
- [ ] One Groq-backed flow passed
- [ ] One Cloudflare-backed flow passed
- [ ] No critical CSP regressions observed
- [ ] No unexpected rate-limit regressions observed

Preview result:
- [ ] PASS
- [ ] CONDITIONAL PASS
- [ ] FAIL

Production promotion is blocked on:
- FAIL
- unresolved CONDITIONAL PASS with unclear impact

---

## 4. Environment Readiness

Confirm production environment is correct and complete.

### Core
- [ ] NEXT_PUBLIC_SUPABASE_URL
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] NEXT_PUBLIC_SITE_URL

### Stripe
- [ ] STRIPE_SECRET_KEY
- [ ] NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- [ ] STRIPE_WEBHOOK_SECRET
- [ ] Stripe price IDs are correct

### Mailgun
- [ ] MAILGUN_API_KEY
- [ ] MAILGUN_DOMAIN
- [ ] MAILGUN_FROM_EMAIL

### Groq
- [ ] GROQ_API_KEY

### Cloudflare
- [ ] CLOUDFLARE_ACCOUNT_ID
- [ ] CLOUDFLARE_API_TOKEN
- [ ] No removed/deferred provider env assumptions remain
- [ ] Production callback/return URLs are correct

If any production env value is uncertain, promotion is blocked.

---

## 5. Schema / Persistence Readiness

- [ ] Checked-in schema matches deployed app contract
- [ ] No undocumented manual DB change is required
- [ ] projects contract is intact
- [ ] No pending migration step is missing from release execution

If schema compatibility is uncertain, promotion is blocked.

---

## 6. Security Readiness

- [ ] CSP baseline deployed and preview-tested
- [ ] Security headers are present
- [ ] Env enforcement is active on canonical provider routes
- [ ] Rate limiting is active on canonical high-risk routes
- [ ] Upload validation is active on current ingestion path
- [ ] No critical security regression is known from preview

Reference:
- SECURITY.md

---

## 7. Logging / Diagnostics Readiness

- [ ] Logs are available for production diagnosis
- [ ] Critical server paths are instrumented
- [ ] Production verifier knows where to inspect logs
- [ ] No known secret-logging regression exists

Reference:
- OBSERVABILITY.md

---

## 8. Rollback Readiness

- [ ] Last known-good deployment is identified
- [ ] Rollback class is understood
- [ ] Rollback executor is known
- [ ] ROLLBACK.md has been reviewed for this release
- [ ] Production rollback trigger conditions are clear

Rollback target:
- Last known-good deployment:
- Rollback owner:

Promotion is blocked if rollback target is unknown.

---

## 9. Release Record Completeness

Reference:
- RELEASE_TEMPLATE.md

- [ ] Release summary is filled
- [ ] Risk classification is filled
- [ ] Validation results are recorded
- [ ] Environment impact is recorded
- [ ] Provider impact is recorded
- [ ] Rollback plan is recorded
- [ ] Known risks are recorded

---

## 10. Final Promotion Decision

**GO** only if all are true:
- repository validation is green
- preview verification is PASS
- production environment is correct
- schema compatibility is confirmed
- rollback target is known
- release owner approves promotion

**NO-GO** if any are true:
- auth flow uncertainty remains
- dashboard/project persistence uncertainty remains
- Stripe checkout uncertainty remains
- intended AI route uncertainty remains
- CSP breaks critical flows
- production env uncertainty remains
- rollback target is unclear

### Final decision:
- [ ] GO
- [ ] NO-GO

Decision timestamp:
Decision by:

---

## 11. Immediate Post-Promotion Verification

After production promotion, verify immediately:
- [ ] / loads
- [ ] /login loads
- [ ] authenticated /dashboard loads
- [ ] existing project opens
- [ ] one save/load cycle works
- [ ] upgrade modal opens
- [ ] Stripe checkout initiation works
- [ ] one Groq flow works
- [ ] one Cloudflare flow works
- [ ] no critical CSP violations appear
- [ ] no immediate unexpected 429 behavior appears

If any critical item fails, evaluate rollback immediately.