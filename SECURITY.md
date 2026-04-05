# SECURITY

## Purpose
This document defines the current security baseline, trust assumptions, and hardening backlog for Photune.

Photune is a browser-based AI image-text editing application with:
- Next.js App Router
- Supabase auth and persistence
- Stripe billing
- Mailgun transactional email
- Groq text AI
- Cloudflare image / worker-backed AI routes

Security work must preserve:
- user data integrity
- secret isolation
- provider trust boundaries
- owner-scoped access to persisted data
- rollback readiness when security-sensitive changes regress

---

## Security Principles

1. **Server-side authority over client claims**
   - the browser is not trusted for authorization, entitlements, or secret handling

2. **Least privilege**
   - only the minimum required data, keys, and permissions should be exposed to each layer

3. **Explicit trust boundaries**
   - every provider and runtime surface has a bounded role

4. **Fail closed where practical**
   - missing required server env/config should stop sensitive paths from operating

5. **Schema and access integrity are security concerns**
   - persistence drift is not only a correctness bug; it can become an access-control bug

6. **Deployment readiness requires security readiness**
   - insecurely configured production is not a valid production state

---

## Current Security Model

## Trusted / Higher-Trust Surfaces

### Next.js Server / Route Handlers
Trusted for:
- authorization checks
- provider-secret usage
- Stripe session creation
- webhook verification
- server-side persistence mutations
- provider mediation

### Supabase
Trusted for:
- authenticated identity source
- durable application data
- user/project/subscription persistence
- access model backing, subject to correct app/database policy

### Provider Secrets
Trusted only when:
- stored server-side
- not exposed to client bundles
- not logged
- scoped to required operations only

---

## Lower-Trust / Semi-Trusted Surfaces

### Browser Client
Allowed to:
- render UI
- run OCR/canvas interaction
- collect user input
- hold ephemeral state
- call trusted server routes

Not trusted for:
- storing secrets
- proving entitlement state
- proving project ownership
- directly mutating authoritative billing or persistence state without server checks

### User-Supplied Content
Includes:
- uploaded images
- text content
- canvas state
- edited/exported data

Treat as untrusted input until validated and safely handled.

---

## Canonical Trust Boundaries

## Boundary A — Client
The client may know:
- public URLs
- public Supabase values
- visible project data already authorized for the user
- non-secret UI configuration

The client must never receive:
- Stripe secret key
- Mailgun secret credentials
- Groq API key
- Cloudflare API token
- Supabase privileged credentials
- webhook secrets

## Boundary B — Application Server
The server is the enforcement boundary for:
- project ownership checks
- subscription/entitlement checks
- provider requests
- sensitive mutation authorization
- sensitive env validation

## Boundary C — Database / Auth
The data layer must uphold:
- durable state consistency
- user-scoped access assumptions
- alignment with checked-in schema/migrations

## Boundary D — External Providers
Providers are trusted only for their bounded function.

- Supabase: auth/data
- Stripe: billing
- Mailgun: delivery
- Groq: text inference
- Cloudflare: image/worker-backed inference

Providers are not trusted to define general application authorization beyond their role.

---

## Canonical Provider Security Posture

### Supabase
Security requirements:
- authenticated route/user assumptions must be validated server-side
- project reads/writes must remain owner-scoped
- schema/app contract drift must be treated as a security risk
- any future privileged keys must remain server-only

### Stripe
Security requirements:
- webhook verification is mandatory
- subscription state must not depend on client claims
- checkout and portal actions must use trusted server routes
- price IDs and billing flow must be environment-correct

### Mailgun
Security requirements:
- credentials remain server-side
- sender identity must be configured intentionally
- failures must not expose secrets or raw provider responses in logs

### Groq
Security requirements:
- text AI calls remain server-mediated unless deliberately and safely bounded
- prompts and responses must not leak secrets through logs or debugging output

### Cloudflare
Security requirements:
- tokens remain server-side
- route handlers must validate required env before attempting provider calls

---

## Canonical Sensitive Data Classes

## Class 1 — Public
Examples:
- marketing copy
- static assets intended for public access
- public route metadata

## Class 2 — User-Scoped Application Data
Examples:
- project metadata
- `canvas_data`
- uploaded asset references
- subscription/account state
- AI usage records

Requirements:
- owner-scoped access
- no cross-user leakage
- no trust in client-side identity claims alone

## Class 3 — Secrets / Sensitive Configuration
Examples:
- API keys
- webhook secrets
- provider tokens
- privileged service credentials

Requirements:
- server-only
- never committed
- never logged
- rotated if suspected exposed

---

## Environment and Secret Handling Rules

1. never hardcode secrets
2. never commit real secrets
3. only `NEXT_PUBLIC_*` values may be browser-exposed
4. required server env must be validated before sensitive use
5. `.env.example` defines shape only, not values
6. env drift between preview and production must be treated as a real security/correctness risk

Current repo direction already includes server env validation utilities; that baseline should be extended, not bypassed.

---

## Active Environment Enforcement

Canonical server paths fail fast when required environment variables are absent.

Active enforcement targets:
- Stripe routes (checkout, portal, webhook)
- Mailgun send path
- Groq route
- Cloudflare routes (inpaint, workers)

This reduces ambiguous downstream provider failures and turns missing
environment variables into explicit request-time errors.

---

## Authentication
- Supabase Auth is the canonical identity source
- protected routes must not rely on client-only guarding
- session/callback logic must remain server-correct

## Authorization
- project access must be checked against authenticated user identity
- sensitive actions must be server-authorized
- entitlements must be derived from trusted persisted/billing state, not UI assumptions

## Ownership
For persisted user content:
- reads must be owner-scoped
- writes must be owner-scoped
- deletes must be owner-scoped

If app code, schema, or policies weaken owner scoping, that is a security incident candidate.

---

## Current Security Baseline

The current repo baseline should include at minimum:
- route protection for authenticated surfaces
- owner-scoped project access assumptions
- provider policy to restrict deferred-provider spread
- validation gates before deploy
- rollback procedures for security-sensitive regressions

This is necessary but not sufficient for full production hardening.

## Current Security Header Baseline

Current enforced global browser-facing headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` with unnecessary browser capabilities disabled
- `Strict-Transport-Security`
- `Content-Security-Policy` (conservative baseline)

This CSP is intentionally conservative on first pass and should be tightened only after observing real runtime behavior in preview/production.

---

## Active Rate Limiting Baseline

Photune now applies a baseline request limiter on high-risk canonical routes:
- auth callback
- Stripe routes
- Groq route
- Cloudflare routes

This limiter is intentionally lightweight and instance-local.
It is a first-pass abuse-control measure, not a distributed global quota system.

## Active Upload Validation Baseline

Photune currently enforces a conservative upload policy for the active image ingestion path.

Current baseline:
- allowed MIME types: PNG, JPEG, WebP
- max size: 10 MB
- invalid uploads fail early with explicit user-safe errors

This baseline should be tightened or expanded only through explicit policy and validation updates.

---

## Current Security Gaps / Backlog

## 1. Content Security Policy
Status:
- incomplete / not fully documented as an enforced baseline

Needed:
- explicit CSP based on real asset, API, and provider origins
- validation that editor/runtime behavior still works under the policy

## 2. Rate Limiting / Abuse Control
Status:
- not yet established as a clear route-level baseline

Needed:
- controls on sensitive or costly endpoints, especially:
  - AI routes
  - billing routes
  - auth-sensitive routes if abuse risk justifies it

## 3. Upload Validation Policy
Status:
- not yet formalized as a documented standard

Needed:
- file type constraints
- file size constraints
- error-handling behavior for invalid uploads
- consistent validation between client and server where relevant

## 4. Security Header Review
Status:
- partial headers exist
- full hardened baseline is not yet defined

Needed:
- review current headers
- extend where appropriate
- ensure no conflict with app/runtime needs

## 5. Logging Hygiene
Status:
- observability exists only in limited form

Needed:
- no sensitive values in logs
- structured server logging for sensitive route failures
- safe incident diagnostics without secret leakage

## 6. Deferred Provider Surface
Status:
- deferred providers still exist in repo during transition

Needed:
- quarantine or remove unused deferred runtime paths
- prevent reintroduction into active shared/runtime code

## 7. Webhook Surface Review
Status:
- Stripe is canonical
- any non-canonical webhook path increases risk surface

Needed:
- verify active webhook paths
- remove or quarantine inactive/deferred provider webhook surfaces

---

## Security Review Triggers

A security review is required when introducing or modifying:

- auth/session flows
- protected route logic
- project ownership checks
- new database tables containing sensitive/user-scoped data
- new provider integrations
- new webhook endpoints
- new upload paths
- new server actions with privileged behavior
- new environment variables containing secrets
- middleware changes affecting access control

---

## Secure Change Rules

For medium/high-risk security-relevant changes:

1. classify the blast radius
2. prefer dry-run or staging validation where possible
3. patch minimally
4. define verification steps
5. define rollback steps
6. update docs if trust boundaries or operational assumptions changed

Do not merge security-sensitive changes without explicit verification criteria.

---

## Incident Indicators

Treat the following as potential security incidents until disproven:

- cross-user project access
- missing owner scoping on project reads/writes
- webhook verification failure or bypass
- secrets exposed to client bundle or logs
- unauthorized billing state mutation
- broken auth callback/session logic causing privilege confusion
- schema drift affecting authorization assumptions

---

## Minimum Verification for Security-Sensitive Changes

When touching auth, persistence, billing, or provider boundaries, verify at minimum:

1. `npm run check` passes
2. protected routes still require authenticated access
3. owner-scoped project access remains enforced
4. canonical provider paths still work
5. no new deferred-provider drift is introduced
6. rollback path is documented for the change

---

## Minimum Production Security Readiness

Photune should not be considered security-ready for broader production operation until all of the following are true:

- required server env validation is in place for active sensitive paths
- owner-scoped persistence checks are verified
- webhook verification is enforced for active billing paths
- deferred provider spread is controlled
- CSP/security headers are reviewed and intentionally configured
- upload validation policy is defined
- rollback procedure exists for security-sensitive regressions
- observability/logging is good enough to diagnose auth, billing, and persistence failures safely

---

## Security Ownership Expectations

Security is not a separate afterthought. It is jointly enforced through:
- code
- schema discipline
- provider discipline
- deployment procedure
- rollback readiness
- validation gates
- documentation

A green build without these controls is not a secure production state.

