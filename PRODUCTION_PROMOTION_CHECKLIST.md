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

- [x] Product name remains `Photune`
- [x] Commit SHA to promote is known
- [x] Branch/source of promotion is known
- [ ] Release owner is assigned
- [ ] Production verifier is assigned

**Record:**
- Commit SHA: d563793
- Release owner: TBC
- Production verifier: TBC

---

## 2. Repository Validation Gate

```bash
npm run check
```

- [x] npm run lint passed
- [x] npm run typecheck passed
- [x] npm run build passed
- [x] npm run smoke passed
- [x] npm run check passed

---

## 3. Preview Verification Gate

Reference: PREVIEW_VERIFICATION.md

### Passed (public routes)
- [x] Public surface passed
- [x] Login route passed
- [x] Protected routes redirect correctly
- [x] CSP fully configured

### Requires Auth (pending human testing)
- [ ] Auth callback passed
- [ ] Dashboard passed
- [ ] Editor open passed
- [ ] Save/load cycle passed
- [x] Upload validation verified (code)
- [ ] Stripe checkout passed
- [ ] Groq flow passed
- [ ] Cloudflare flow passed

**Preview result: CONDITIONAL PASS**

---

## 4. Environment Readiness

### Core
- [x] NEXT_PUBLIC_SUPABASE_URL - in CSP
- [x] NEXT_PUBLIC_SUPABASE_ANON_KEY - in CSP
- [x] NEXT_PUBLIC_SITE_URL - in CSP

### Stripe
- [x] STRIPE_SECRET_KEY - in CSP
- [x] NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY - in CSP
- [x] STRIPE_WEBHOOK_SECRET - configured

### Mailgun
- [x] MAILGUN_API_KEY - in CSP
- [x] MAILGUN_DOMAIN - in CSP
- [x] MAILGUN_FROM_EMAIL - in CSP

### Groq
- [x] GROQ_API_KEY - in CSP

### Cloudflare
- [x] CLOUDFLARE_ACCOUNT_ID - in CSP
- [x] CLOUDFLARE_API_TOKEN - in CSP
- [x] No removed/deferred provider env assumptions remain

---

## 5. Schema / Persistence Readiness

- [x] Checked-in schema matches deployed app contract
- [x] No undocumented manual DB change required
- [x] projects contract is intact
- [x] No pending migration step missing

---

## 6. Security Readiness

- [x] CSP baseline deployed and verified
- [x] Security headers present (CSP, strict-transport-security, etc.)
- [x] Env enforcement active on canonical provider routes
- [x] Rate limiting active on high-risk routes
- [x] Upload validation active (PNG/JPEG/WebP, 10MB max)
- [x] No critical security regression known from code

---

## 7. Logging / Diagnostics Readiness

- [x] Logs available for production diagnosis
- [x] Critical server paths instrumented
- [ ] Production verifier knows where to inspect logs
- [x] No known secret-logging regression

---

## 8. Rollback Readiness

- [x] Last known-good deployment identified
- [x] Rollback class understood
- [ ] Rollback executor known

**Rollback target:** Previous Vercel deployment before d563793

---

## 9. Release Record Completeness

Reference: RELEASE_TEMPLATE.md

- [x] Release summary filled
- [x] Risk classification filled (Medium)
- [x] Validation results recorded
- [x] Environment impact recorded
- [x] Provider impact recorded
- [x] Rollback plan referenced
- [x] Known risks recorded

---

## 10. Final Promotion Decision

**GO** requires:
- repository validation is green ✓
- preview verification PASS (conditional - needs auth testing)
- production environment is correct ✓
- schema compatibility is confirmed ✓
- rollback target is known ✓
- release owner approves promotion

**NO-GO** if:
- auth flow uncertainty remains
- dashboard/project persistence uncertainty remains
- Stripe checkout uncertainty remains
- intended AI route uncertainty remains
- CSP breaks critical flows
- production env uncertainty remains
- rollback target is unclear

### Status: CONDITIONAL PASS (waiting on authenticated testing)

---

## Next Action Required

Human testing with authenticated account needed to complete:
1. Dashboard load verification
2. Editor save/reload cycle
3. Stripe checkout flow
4. Groq flow execution
5. Cloudflare flow execution

Once these pass → PRODUCTION GO