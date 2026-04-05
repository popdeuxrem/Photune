# ARCHITECTURE

## System Overview

Client (Next.js App Router)
- Routes: src/app
- Features: src/features
- Shared: src/shared

Server
- API routes (Next.js)
- Supabase (DB + Auth)
- External AI providers

## Data Flow

User → Upload Image  
→ OCR (client: Tesseract.js)  
→ Canvas (Fabric.js)  
→ Edit / AI operations  
→ Save to Supabase  
→ Reload / Export  

## Persistence Layer

Supabase Tables (expected):
- users (auth)
- projects (REQUIRED, currently missing)
- user_subscriptions
- ai_usage_logs

## External Services

- Supabase (auth + db)
- Groq (text AI)
- Cloudflare AI (image ops)
- Stripe (payments)
- Resend (email)

## Trust Boundaries

Client:
- UI rendering
- OCR
- Canvas editing

Server:
- AI calls
- Payment handling
- Data persistence

## Known Architectural Gaps

- Missing `projects` table alignment
- Undefined AI routing layer
- No clear abstraction for providers
- No rate limiting layer

