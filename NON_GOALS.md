# NON_GOALS

## Purpose
This file defines what Photune is explicitly **not** attempting to build in the current product cycle.

These exclusions prevent uncontrolled expansion and reduce architectural drift.

## Non-Goal 1 — Real-Time Collaborative Editing
Photune is not currently a real-time collaborative editor.

Excluded:
- shared cursors
- live multiplayer editing
- operational transform / CRDT systems
- document presence systems
- multi-user locking semantics

Reason:
The current repo is structured for single-user project editing and does not show collaboration primitives.

## Non-Goal 2 — Native Mobile Applications
Photune is not currently building:
- iOS native app
- Android native app
- desktop packaged clients

Reason:
The current architecture is browser-first and deployment-first on Vercel.

## Non-Goal 3 — Offline-First Operation
Photune is not currently targeting:
- offline sync
- local-first reconciliation
- disconnected persistence guarantees

Reason:
Auth, persistence, billing, and AI features depend on online services.

## Non-Goal 4 — Broad Digital Asset Management
Photune is not a full DAM platform.

Excluded:
- advanced folder taxonomies
- enterprise asset governance
- approval pipelines
- rights management
- large-scale media library administration

Reason:
Project persistence is in scope; enterprise asset governance is not.

## Non-Goal 5 — General-Purpose AI Chat Product
Photune is not a generalized assistant/chat interface.

Excluded:
- open-ended conversational product positioning
- general knowledge chatbot behavior
- unrelated text generation workflows

Reason:
AI features are bounded to editing operations.

## Non-Goal 6 — Multi-Provider Everything by Default
Photune is not trying to maximize provider count.

Excluded unless justified:
- parallel long-term support for multiple billing rails
- parallel email systems without explicit fallback policy
- uncontrolled AI provider fan-out

Reason:
Current repo maturity does not support broad provider sprawl safely.

## Non-Goal 7 — Marketplace / Plugin Ecosystem
Photune is not currently building:
- app marketplace
- third-party plugin runtime
- public extension APIs
- user-installed integrations at scale

Reason:
Core editing, persistence, and production hardening are higher priority.

## Non-Goal 8 — Enterprise Admin Plane
Photune is not currently building:
- org administration
- seat management
- RBAC control center
- audit portal
- enterprise compliance console

Reason:
No current repo evidence supports this as an immediate product boundary.

## Non-Goal 9 — Long-Running Background Job Platform
Photune is not currently a queue-centric media pipeline product.

Excluded:
- distributed render farm
- retry-orchestrated batch image pipeline
- asynchronous job scheduler as primary architecture

Reason:
Current app shape is request/response and browser-interactive.

## Non-Goal 10 — Unlimited Scope from photext.shop Evolution
Photune being an evolution of photext.shop does not mean all adjacent ideas are in scope.

Explicitly excluded unless later promoted:
- social scheduling
- campaign management
- team review systems
- agency workflow orchestration
- multi-product suite expansion

## Promotion Rule
A current non-goal can only enter scope if all of the following exist:
1. a decision entry in `DECISIONS.md`
2. a scope update in `SCOPE.md`
3. a trust-boundary review in `TRUST_BOUNDARIES.md`
4. validation gates for the new capability
5. operational ownership for the new capability

