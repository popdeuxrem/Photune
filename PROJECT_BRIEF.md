# PROJECT BRIEF

## Canonical Identity
Product Name: Photun  
Repository Name: Photune (legacy spelling retained for repo continuity)  
Domain Target: photun.app (pending confirmation)

Photun is the evolution of photext.shop into a production-grade AI image-text editing studio.

## Product Definition
Photun is a browser-based editing environment that enables:
- OCR extraction from images
- Direct canvas-based editing
- AI-powered rewrite, erase, and background manipulation
- Project persistence and retrieval
- Export (image/PDF)

## Core Capabilities
- Upload → OCR → Editable canvas
- AI rewrite (text regions)
- AI erase/inpaint
- Background manipulation
- Save/load projects (Supabase)
- Export output
- Authentication + subscription gating

## Non-Goals (Current Phase)
- Real-time collaboration
- Offline-first support
- Native mobile apps
- Plugin ecosystem

## Target Users
- Designers editing text-heavy images
- Social media creators
- Lightweight marketing workflows

## Constraints
- Browser-first execution (no heavy server rendering of images)
- Stateless API routes where possible
- Supabase as primary persistence/auth layer
- Vercel deployment

