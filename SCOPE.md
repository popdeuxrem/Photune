# SCOPE

## Canonical Product
Product name: **Photune**

Photune is a browser-based AI image-text editing studio that allows users to upload images, extract/edit text, apply AI-assisted modifications, persist projects, and export results.

## In-Scope Capabilities

### 1. Authentication and User Access
Photune includes authenticated user access backed by Supabase Auth.

In scope:
- sign up
- sign in
- sign out
- auth callback/session restoration
- route protection for authenticated areas

### 2. Project-Based Editing
Photune is project-centered.

In scope:
- create a project
- open an existing project
- save editor state to a project
- reload editor state from a project
- delete a project

Project persistence is a required system capability, not an optional enhancement.

### 3. Browser-Based Image/Text Editing
The primary editing experience is browser-resident.

In scope:
- upload an image
- OCR text extraction
- editable canvas/text region workflow
- reposition/edit text elements
- preserve background image context
- keyboard shortcuts and editor UX primitives

### 4. AI-Assisted Editing
Photune includes AI features that directly support the editing workflow.

In scope:
- text rewrite
- image/text-region inpainting or erase
- background-related AI operations already represented in repo architecture
- AI usage logging tied to user activity where supported

AI exists to support editing operations, not to become a general-purpose chat product.

### 5. Subscription and Billing
Photune may gate premium functionality behind paid plans.

In scope:
- subscription checkout
- billing portal/account management
- subscription status persistence
- plan-based access control

Billing scope must be narrowed to a canonical provider path during hardening.

### 6. Export
Users must be able to leave the system with a usable result.

In scope:
- export edited output
- support currently implemented output paths such as image and/or PDF

### 7. Deployment and Production Operation
Photune is intended to be deployable and operated as a product.

In scope:
- Vercel deployment
- environment variable discipline
- operational documentation
- rollback guidance
- security baseline
- validation gates

## MVP Boundary

The MVP includes only the minimum coherent product path:

1. user authenticates
2. user creates or opens a project
3. user uploads an image
4. OCR extracts editable text
5. user performs at least one manual edit
6. user performs at least one AI-assisted edit
7. user saves project state
8. user exports output
9. paid plan gating works for at least one premium feature

If any of the above fail, MVP is not complete.

## Production Boundary

Photune reaches production boundary only when all of the following are true:
- naming is consistent across app/docs/deployment copy
- project persistence schema matches app behavior
- auth flow is stable
- one canonical billing path is active and verified
- one canonical email/provider strategy is active and verified
- AI provider routing is explicit
- build/lint/typecheck gates exist
- deploy procedure is documented
- rollback procedure is documented
- security baseline is documented
- environment matrix is normalized

## Out-of-Scope Within Current Boundary
The following are not part of the current bounded product unless explicitly promoted later:
- collaboration/multi-user live editing
- marketplace/plugins/extensions
- fully offline editing
- native mobile apps
- long-running asynchronous media pipelines
- generalized content generation unrelated to editing
- agency/admin tenant control planes
- broad asset DAM functionality

## System Boundary Statement
Photune is an editing product with AI augmentation.

It is not currently a:
- design suite competitor across all creative workflows
- collaboration platform
- asset management platform
- workflow automation platform
- generalized multimodal generation hub

All future work must preserve this boundary unless a decision artifact expands it explicitly.

