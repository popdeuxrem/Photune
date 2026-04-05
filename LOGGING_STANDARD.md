# LOGGING_STANDARD

## Purpose
This document defines the minimum logging standard for Photune.

Logging exists to improve:
- incident diagnosis
- deploy verification
- provider failure isolation
- auth/persistence/billing debugging
- rollback confidence

Logging does not exist to dump arbitrary state.

---

## Scope
This standard applies to:
- Next.js route handlers
- server-side library modules
- provider integration boundaries
- persistence boundaries
- high-value client-side error surfaces where server logs are insufficient

This standard does not justify logging secrets, raw sensitive payloads, or redundant noise.

---

## Core Principles

1. **Log at boundaries**
   - auth
   - persistence
   - billing
   - email
   - AI provider calls
   - deployment-critical routes

2. **Prefer structured logs**
   - use stable fields
   - make search and filtering possible

3. **Log state transitions and failures**
   - not every internal variable
   - not every render cycle

4. **Do not leak secrets**
   - ever

5. **Make logs actionable**
   - each log should help answer:
     - what failed?
     - where?
     - for which operation?
     - against which provider or route?
     - what is the next diagnostic step?

6. **Avoid duplication**
   - the same error should not be logged at every layer unless each layer adds distinct context

---

## Canonical Log Fields

Preferred log shape for server-side events:

```ts
type LogEvent = {
  event: string;
  level: 'info' | 'warn' | 'error';
  surface: 'auth' | 'dashboard' | 'editor' | 'persistence' | 'billing' | 'email' | 'ai' | 'deployment';
  route?: string;
  provider?: 'supabase' | 'stripe' | 'mailgun' | 'groq' | 'cloudflare';
  projectId?: string;
  userId?: string;
  operation?: string;
  statusCode?: number;
  message?: string;
  errorName?: string;
  errorMessage?: string;
};

Not every field is required.
Include only fields that materially improve diagnosis.

⸻

Allowed Logging Content

Generally acceptable:
	•	event name
	•	route name
	•	provider name
	•	project id
	•	user id when necessary for diagnosis
	•	operation name
	•	safe error class/message
	•	HTTP status code
	•	coarse result state (success, failure, verified, blocked)

Use restraint with user identifiers.
Do not log more identity/context than needed.

⸻

Forbidden Logging Content

Never log:
	•	API keys
	•	webhook secrets
	•	auth tokens
	•	cookies
	•	raw authorization headers
	•	provider secret values
	•	full payment payloads
	•	full uploaded file contents
	•	raw canvas_data
	•	full provider response bodies unless explicitly redacted and justified
	•	sensitive PII beyond what is operationally necessary

Bad example:

console.error('stripe failed', process.env.STRIPE_SECRET_KEY, req.headers.authorization);


⸻

Event Naming Rules

Event names must be:
	•	explicit
	•	stable
	•	action-oriented

Use this pattern where practical:

<surface>_<operation>_<result>

Examples:
	•	auth_callback_start
	•	auth_callback_success
	•	auth_callback_failure
	•	project_load_start
	•	project_load_success
	•	project_load_failure
	•	project_save_start
	•	project_save_success
	•	project_save_failure
	•	stripe_checkout_start
	•	stripe_checkout_success
	•	stripe_checkout_failure
	•	stripe_webhook_received
	•	stripe_webhook_verified
	•	stripe_webhook_failure
	•	mailgun_send_start
	•	mailgun_send_success
	•	mailgun_send_failure
	•	groq_request_start
	•	groq_request_success
	•	groq_request_failure
	•	cloudflare_request_start
	•	cloudflare_request_success
	•	cloudflare_request_failure

Avoid vague event names like:
	•	error
	•	failed
	•	problem
	•	something_broke

⸻

Log Level Rules

info

Use for:
	•	significant lifecycle steps
	•	successful boundary transitions
	•	deployment verification-relevant operations

Examples:
	•	successful auth callback
	•	successful project load
	•	checkout session created
	•	webhook verified

warn

Use for:
	•	recoverable issues
	•	degraded but non-fatal conditions
	•	suspicious states that did not yet break the user flow

Examples:
	•	missing optional provider data
	•	unexpected fallback path triggered
	•	provider returned incomplete but non-fatal response

error

Use for:
	•	failed user-facing operations
	•	failed provider calls
	•	failed persistence operations
	•	failed authorization/authentication boundaries
	•	unexpected exceptions

Examples:
	•	project load failed
	•	checkout route failed
	•	webhook verification failed
	•	provider request failed

⸻

Placement Rules

1. Route Handlers

Log:
	•	operation start for important routes
	•	success/failure outcome
	•	provider failure
	•	validation or authorization failure where relevant

Do not log:
	•	every intermediate variable
	•	duplicated framework noise

2. Persistence Boundaries

Log:
	•	failed reads/writes on critical entities
	•	notable success for high-value operations when useful
	•	contract failures involving projects or subscriptions

3. Provider Boundaries

Log:
	•	provider call start
	•	provider call success
	•	provider call failure
	•	verification result for webhook-like flows

4. Client-Side Logging

Keep minimal.

Allowed:
	•	high-value UI error boundaries
	•	explicit user-flow failures not visible server-side

Do not use client logs as the primary observability strategy for server problems.

⸻

Priority Instrumentation Targets

The next routes/modules that should follow this standard are:
	1.	auth callback route
	2.	dashboard project load path
	3.	editor project load/save path
	4.	Stripe checkout route
	5.	Stripe webhook route
	6.	Mailgun send path
	7.	Groq route handlers
	8.	Cloudflare route handlers

These surfaces map directly to current production-critical boundaries.

⸻

Example Patterns

Good: project load failure

console.error({
  event: 'project_load_failure',
  level: 'error',
  surface: 'persistence',
  route: '/editor/[projectId]',
  projectId,
  userId,
  operation: 'project_load',
  errorName: error instanceof Error ? error.name : 'UnknownError',
  errorMessage: error instanceof Error ? error.message : String(error),
});

Good: webhook verified

console.info({
  event: 'stripe_webhook_verified',
  level: 'info',
  surface: 'billing',
  route: '/api/stripe/webhook',
  provider: 'stripe',
  operation: 'webhook_verify',
});

Bad: noisy and unsafe

console.error('billing broke', error, req.headers, process.env.STRIPE_SECRET_KEY);


⸻

Logging by Surface

Auth

Minimum events:
	•	callback start
	•	callback success
	•	callback failure
	•	session refresh failure

Minimum useful fields:
	•	route
	•	operation
	•	userId where safely available
	•	error summary

Persistence

Minimum events:
	•	project load success/failure
	•	project save success/failure
	•	subscription persistence failure

Minimum useful fields:
	•	projectId
	•	userId
	•	operation
	•	error summary

Billing

Minimum events:
	•	checkout start/success/failure
	•	portal failure if relevant
	•	webhook received
	•	webhook verified
	•	webhook failure

Minimum useful fields:
	•	provider
	•	route
	•	operation
	•	status code or error summary

Email

Minimum events:
	•	send start
	•	send success
	•	send failure

Do not log full message bodies unless explicitly redacted and operationally justified.

AI

Minimum events:
	•	request start
	•	request success
	•	request failure

Useful fields:
	•	provider
	•	operation type
	•	coarse route/action
	•	failure reason

Do not log full prompts/responses by default if they may contain user content.

⸻

Redaction Rules

When logging error context:
	•	prefer error name/message
	•	omit secrets
	•	omit raw provider credentials
	•	omit raw request bodies unless explicitly sanitized
	•	omit full user content payloads by default

If additional detail is needed during a targeted debug session:
	•	add temporary, scoped diagnostics
	•	remove or reduce them after the incident
	•	never promote emergency verbose logging into the permanent baseline without review

⸻

Verification Rules for New Logging

When adding logging to a route/module, verify:
	1.	the intended event is emitted
	2.	the log shape follows this standard
	3.	no secrets appear in output
	4.	duplicate logs are avoided
	5.	the log improves diagnosis of a real failure mode

A logging change is incomplete if it adds noise without improving diagnosis.

⸻

Adoption Rules

When instrumenting an existing route:
	1.	add start/success/failure logs only at meaningful boundaries
	2.	use stable event names
	3.	keep fields consistent with this document
	4.	verify locally with the affected flow
	5.	document any deviations if truly necessary

⸻

Near-Term Adoption Plan
	1.	instrument auth callback
	2.	instrument dashboard project load
	3.	instrument editor save/load
	4.	instrument Stripe checkout
	5.	instrument Stripe webhook
	6.	instrument Mailgun send
	7.	instrument Groq and Cloudflare route handlers

This order matches Photune’s highest-value operational boundaries.

