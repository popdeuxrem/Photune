# TRUST_BOUNDARIES

## Purpose
This document defines the trust boundaries for Photune so that implementation can separate:
- trusted server operations
- semi-trusted browser operations
- third-party service dependencies
- stateful external systems

## Boundary Map

### Boundary A — User Browser
The browser is a partially trusted execution environment.

Allowed responsibilities:
- render UI
- accept user input
- display project/editor state
- run OCR and canvas manipulation where implemented
- initiate API calls
- hold ephemeral client state
- use public environment variables only

Not trusted for:
- secret storage
- payment authority
- subscription truth
- server-side authorization decisions
- authoritative project ownership checks

Implication:
All sensitive authorization and provider-secret operations must remain server-side.

## Boundary B — Next.js Server / Route Handlers
The server is the control plane for trusted application actions.

Trusted responsibilities:
- enforce authenticated access for protected operations
- verify project ownership before mutating persisted data
- call external AI providers using secret credentials
- initiate billing sessions
- verify webhooks
- apply subscription state changes
- validate server-side input before persistence or provider calls

This boundary is the canonical enforcement point for:
- secrets
- authorization
- provider mediation
- billing state transitions

## Boundary C — Supabase
Supabase is the primary trusted managed data/auth platform.

Trusted uses:
- auth/session identity
- durable application data
- subscription state storage
- AI usage logging
- project persistence
- user-scoped data retrieval

Constraints:
- app behavior must match checked-in schema/migrations
- row ownership enforcement must exist through app logic and/or database policy
- schema drift is not acceptable

## Boundary D — External AI Providers
External AI services are not fully trusted.

They are trusted only for:
- performing requested model inference

They are not trusted for:
- authorization
- identity
- billing truth
- persistent application state

Rules:
- secrets remain server-side
- requests should be bounded to required payloads only
- responses must be treated as untrusted data until validated/sanitized for application use
- provider selection must be explicit, not accidental

## Boundary E — Billing Providers
Billing providers are trusted for payment processing, but not for full application state by themselves.

Trusted uses:
- payment collection
- checkout/portal flows
- payment event emission

Not trusted for:
- sole source of user entitlement without local persistence
- direct client-side entitlement changes

Rules:
- webhook verification is mandatory
- local subscription state must be persisted
- one canonical billing authority path should exist in MVP/production

## Boundary F — Email Provider
Email provider is trusted only for message delivery.

Not trusted for:
- authentication truth
- billing truth
- application state truth

Rules:
- one canonical provider should be selected
- required env variables must be documented
- delivery failures must not silently break core auth/billing flows

## Data Classification by Boundary

### Public Data
May exist in browser/client:
- marketing copy
- public metadata
- non-sensitive UI state
- public asset URLs where intended

### User-Scoped Sensitive Data
Must be access-controlled:
- project content
- canvas data
- uploaded asset references
- subscription/account state
- AI usage records

### Secret Data
Must never reach the browser:
- provider API keys
- webhook secrets
- privileged service credentials
- internal signing material

## Responsibility Split

### Client Responsibilities
- interaction
- presentation
- local editing state
- OCR/canvas execution where implemented
- sending explicit user actions to server

### Server Responsibilities
- auth enforcement
- persistence validation
- provider orchestration
- billing session creation
- webhook verification
- entitlement updates
- audit-worthy state transitions

### Database Responsibilities
- durable state
- queryable ownership-linked records
- billing/usage/project records
- consistency with migration history

## Primary Trust Risks

### 1. Project Ownership Drift
Risk:
The client may reference arbitrary project identifiers.

Control:
Server/database must enforce owner-scoped access to projects.

### 2. Secret Leakage
Risk:
Client code or env handling could expose provider secrets.

Control:
Only `NEXT_PUBLIC_*` values may be browser-exposed. All provider secrets must remain server-only.

### 3. Webhook Forgery
Risk:
Billing or crypto callbacks may be spoofed.

Control:
Every webhook path must implement proper signature verification before mutating state.

### 4. Schema Drift
Risk:
App code uses persistence contracts not reflected in checked-in schema.

Control:
No production claim is valid until schema and application contract match.

### 5. Provider Sprawl
Risk:
Too many active providers create undefined failover and ownership semantics.

Control:
Select canonical providers and demote others until explicitly needed.

## Trust-Boundary Rules for Future Features
Any new feature that introduces:
- new secrets
- new third-party services
- new background jobs
- new multi-user access patterns
- new persistent data classes

must update this file before implementation is considered complete.

