Here is the comprehensive, upgraded README.md reflecting the Hybrid AI Pipeline and the smart features we’ve integrated.

📸 phoTextAI - Smart AI Image Editor
phoTextAI is a high-performance, open-source image-text editor that bridges the gap between static images and editable design. Using a hybrid "Edge + Client" AI architecture, it extracts text, identifies typography, and generates context-aware content—all while remaining 100% free to operate.

✨ Features
Instant Client-Side OCR: Uses Tesseract.js (WASM) to extract text directly in the browser with bounding-box accuracy.
AI Font Matching: Automatically analyzes the typography of an image area and matches it to the closest Google Font category (Serif, Sans, Handwriting, etc.).
Hybrid AI Pipeline:
Puter.js (Vision/LLM): Free-tier vision for font classification and LLM for content rewriting.
Cloudflare Workers AI: Edge-based translation and high-resolution image generation (SDXL).
Text-to-Image Backgrounds: Generate brand-new backgrounds for your projects using Stable Diffusion XL via Cloudflare.
Professional Canvas: Built on Fabric.js with support for layering, object snapping, undo/redo history, and high-res exports.
Persistence: Secure authentication and project saving via Supabase.
🛠️ Tech Stack
Framework: Next.js 14 (App Router)
Canvas Engine: Fabric.js
State Management: Zustand (with Persisted History)
OCR: Tesseract.js (WASM)
AI Services: Puter.js (Vision) + Cloudflare Workers AI (SDXL/Translation)
Database/Auth: Supabase (PostgreSQL + GoTrue)
UI/UX: Tailwind CSS + Radix UI (shadcn/ui)
🚀 Getting Started

1. Prerequisite Setup

Supabase
Create a project at supabase.com.
Run the following in the SQL Editor:
code
SQL

download

content_copy

expand_less
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT DEFAULT 'Untitled Project',
  canvas_data JSONB,
  original_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own projects" ON projects FOR ALL USING (auth.uid() = user_id);
Cloudflare Workers AI
Get your Account ID and API Token (with Workers AI: Edit permissions) from the Cloudflare Dashboard.
2. Environment Variables
Create a .env.local file:

code
Env

download

content_copy

expand_less
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Cloudflare (Server-side)
CLOUDFLARE_ACCOUNT_ID=your_id
CLOUDFLARE_API_TOKEN=your_token

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
3. Installation
code
Bash

download

content_copy

expand_less
# Install system dependencies (Linux/Ubuntu/Codespaces)
sudo apt-get update && sudo apt-get install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

# Install dependencies
npm install --legacy-peer-deps

# Run
npm run dev
🏗️ Architecture
code
Text

download

content_copy

expand_less
[IMAGE UPLOAD] ──► [TESSERACT.JS OCR] ──► [FABRIC.JS CANVAS]
                          │                     │
                          ▼                     ▼
               [PUTER.JS VISION MATCH]  [CLOUDFLARE SDXL]
               (Font Identification)    (Background Gen)
Client-Side Compute: OCR and Canvas rendering happen on the user's CPU/GPU to ensure zero latency and $0 operational cost.
Hybrid AI Edge:
Puter.js handles Vision-based font classification.
Cloudflare Workers handles heavy-duty generative tasks (SDXL) and localized translation.
☁️ Deployment

GitHub Codespaces
This repository is pre-configured with a .devcontainer to automatically install the Linux headers required for the Fabric.js/Canvas engine.

Open in Codespaces.
Add your .env variables to Codespace Secrets.
Restart and run npm run dev.
Vercel
Connect your repo.
Ensure environment variables are set in the Vercel dashboard.
Deploy.
📜 License
Distributed under the MIT License. Developed for the open-source community as a fully-free alternative to paid AI design tools.
