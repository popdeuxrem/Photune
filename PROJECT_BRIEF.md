# Photune — Project Brief

## 1. Product Identity

**Product:** Photune  
**Repository:** `popdeuxrem/Photune`

Photune is a browser-based image and text editing studio built around editable canvas workflows, OCR-assisted text reconstruction, AI-assisted transformations, project persistence, and authenticated user workspaces.

Photune is the successor direction to the earlier `photext.shop` concept. The defining shift is from primarily ephemeral text replacement toward a **stateful editor** with saved projects, layered manipulation, export controls, and account-bound persistence.

---

## 2. Product Definition

Photune is designed to let a user:

- upload an image into a browser-based editor
- detect or reconstruct text regions
- create and manipulate editable text objects on a Fabric.js canvas
- apply styling, effects, and layer ordering
- use AI-assisted operations where enabled
- save and reopen projects through Supabase-backed persistence
- export finished work to standard output formats

Photune is not a generic design suite. It is an editing system centered on **image/text modification workflows** with persistence and controlled AI augmentation.

---

## 3. Verified Repository Reality

The current repository verifies the following product capabilities and infrastructure:

### 3.1 Runtime and Core Stack
- Next.js `14.2.3` with App Router
- React `18`
- TypeScript
- Tailwind CSS + Radix UI
- Fabric.js `5.3.0` for editor canvas behavior
- Zustand for editor/application state
- Supabase for authentication and persistence
- Tesseract.js for OCR
- Stripe for subscription/billing flows
- Mailgun for transactional email
- Groq and Cloudflare-backed AI routes in the application surface

### 3.2 Application Surfaces Present in the Repo
- authentication pages
- dashboard page
- editor page with authenticated project loading
- AI API routes
- Stripe checkout / portal / webhook routes
- Supabase schema and project migration
- export utilities
- logging and operational documentation

### 3.3 Persistence Model Verified
The repository contains a `projects` table with:
- `id`
- `user_id`
- `name`
- `canvas_data`
- `original_image_url`
- `created_at`
- `updated_at`

The repository also contains row-level security for project ownership and server actions for saving, loading, listing, and deleting projects.

---

## 4. Mission

Photune’s mission is to provide a production-capable, browser-native editing environment for modifying image text and related visual content without requiring a desktop design application.

The system must prioritize:

- deterministic editing behavior
- non-destructive project persistence
- authenticated ownership of saved work
- practical exportability
- optional AI augmentation rather than AI dependency

---

## 5. Core Capabilities

## 5.1 Authenticated Workspaces
Photune supports account-bound usage through Supabase authentication and protected project access.

Current verified surfaces include:
- login
- signup
- authenticated dashboard access
- authenticated editor access

## 5.2 Project Persistence
Photune persists project state through Supabase-backed storage of canvas JSON and source image references.

Current verified behaviors include:
- create/save project records
- load existing projects by ID
- list user projects in dashboard
- delete user-owned projects

## 5.3 Canvas-Based Editing
Photune uses a Fabric.js canvas as the primary editing surface.

Current verified editor capabilities include:
- image ingestion into the editor
- text object creation
- text styling controls
- effect controls
- layer controls
- object selection/manipulation infrastructure
- export integration

## 5.4 OCR-Assisted Text Editing
Photune includes OCR infrastructure via `tesseract.js` to support text-aware editing flows.

Current verified direction:
- OCR engine exists in the repository
- OCR is part of the editor architecture
- OCR-assisted reconstruction is a first-class product concern

## 5.5 AI-Assisted Operations
Photune includes AI integration points for text and image workflows.

Current verified integration points include:
- Groq-backed text route
- Cloudflare-backed AI routes
- Puter-based client helpers present in the codebase
- inpaint/background-related editor flows and panels

AI is an augmentation layer, not the core editor contract.

## 5.6 Export
Photune includes export utilities for:
- PNG
- JPEG
- WEBP
- SVG
- PDF

The free/pro subscription model also affects export behavior through watermark gating present in the codebase.

## 5.7 Subscription and Commercial Surface
Photune includes a freemium subscription model in the current repository.

Verified current commercial structure:
- `free`
- `pro`
- `enterprise`

Verified current gated concepts include:
- watermark behavior
- AI credit limits
- batch processing entitlement
- brand kit entitlement
- priority support entitlement

---

## 6. Product Boundaries

## 6.1 In Scope
The current product scope includes:

- browser-based image/text editing
- account-bound project persistence
- OCR-assisted text workflows
- text creation and text styling
- layer management
- export workflows
- subscription-aware gating
- AI-assisted rewrite / inpaint / related augmentation flows
- dashboard-based project retrieval and management

## 6.2 Out of Scope
The following are not part of the current required product contract unless explicitly added and verified later:

- real-time collaboration
- shared multiplayer editing
- offline-first editing guarantees
- native mobile apps
- plugin ecosystem
- general-purpose brush/painting workflow
- marketplace/social platform behavior
- unconstrained provider sprawl beyond the documented active stack

---

## 7. Non-Goals

Photune is not intended to be:

- a full Photoshop/Figma replacement
- a social content platform
- a general raster illustration tool
- an AI-only black box that removes user control
- a multi-provider payment experiment in production

The editor must remain useful even when AI features are unavailable or disabled.

---

## 8. MVP Boundary

Photune MVP is the smallest product state that is both usable and structurally aligned with the current repository.

MVP requires all of the following:

### 8.1 Access and Identity
- user can sign up and log in
- protected routes enforce authentication appropriately

### 8.2 Project Lifecycle
- user can create a project
- user can save project state
- user can reopen a saved project
- user can view saved projects in dashboard
- user can delete a project they own

### 8.3 Editor Core
- user can upload an image
- editor initializes a working canvas
- user can add/edit text objects
- user can adjust key text presentation controls
- user can manipulate object/layer ordering

### 8.4 OCR and AI
- OCR path is available for text-aware workflows
- at least one AI-assisted text path and one AI-assisted image path are wired through the app surface
- AI failure does not make the core editor unusable

### 8.5 Export
- user can export final output in at least the currently implemented standard formats supported by the app
- subscription-aware export behavior is consistent with current tier logic

### 8.6 Data Protection
- users cannot read or mutate other users’ projects through the normal application path
- project persistence uses authenticated ownership controls via Supabase RLS

---

## 9. Production Boundary

Photune is considered production-capable only when the following are true:

### 9.1 Functional Reliability
- authenticated project save/load/delete flows are verified end to end
- editor initialization is stable for supported image inputs
- export succeeds consistently for supported formats
- subscription-aware gating behaves consistently with stored user tier

### 9.2 Persistence Safety
- project schema is treated as a compatibility surface
- project saves do not silently corrupt `canvas_data`
- migration path for persistence is explicit and reversible

### 9.3 Security
- Supabase row-level security is active and verified for user-owned records
- secrets remain server-side
- server routes enforce authentication and reject unauthorized access
- upload validation and abuse controls remain in place

### 9.4 Operational Readiness
- application lint, typecheck, build, and smoke commands pass
- environment requirements are documented
- deployment path is documented
- rollback path is documented
- logging exists for key operational surfaces

### 9.5 Provider Discipline
- active providers are explicitly documented
- deferred providers are quarantined or removed from live paths
- no undocumented provider is required for core operation

---

## 10. Technical Constraints

The current product must respect these constraints:

### 10.1 Browser-First Editing
The editing experience is browser-native and canvas-driven. The client is responsible for significant UI and rendering behavior.

### 10.2 Supabase as System of Record
Supabase is the primary persistence and authentication boundary for:
- users
- projects
- subscriptions
- related product data currently modeled in schema

### 10.3 AI is Optional to Core Editing
AI can enhance editing flows, but the editor cannot require AI availability for baseline project manipulation, save/load, and export.

### 10.4 Deterministic Project State
Saved project data must be treated as a durable product surface. Changes to project serialization are high-risk and require explicit review.

### 10.5 Controlled Commercial Surface
The canonical active billing provider is Stripe. Legacy or deferred payment/provider references are not grounds to broaden production scope.

---

## 11. Primary Users

Photune is currently best aligned to:

### Primary
- creators editing text inside existing images
- operators producing lightweight branded visuals
- users who need persistent browser-based editing rather than one-shot AI generation

### Secondary
- small teams or solo operators managing repeatable text/image modifications
- users who need OCR + manual correction rather than fully automated design generation

---

## 12. Product Principles

All implementation phases must preserve these principles:

- persistence over ephemerality
- deterministic behavior over magic
- user control over opaque automation
- minimal provider sprawl
- exportable output over locked-in workflows
- authenticated ownership over anonymous state leakage

---

## 13. Explicit Unknowns

The following are **not** asserted as product facts until separately verified:

- exact autosave frequency or autosave durability guarantees
- hard project-count quotas per tier
- guaranteed mobile-editor completeness
- production SLOs
- long-running asynchronous AI job guarantees beyond the current code surface
- backward-compatibility strategy for all historical canvas payloads

These must be defined in later artifacts rather than assumed here.

---

## 14. Change Discipline

Any future change that materially affects one or more of the following must be recorded in `DECISIONS.md` and evaluated for rollback impact:

- project schema or serialization
- auth boundary
- persistence model
- export behavior
- provider set
- subscription entitlements
- AI dependency level
- trust boundary between client and server

Changes that threaten determinism, persistence safety, or user data isolation are **high-risk by default**.

