# 📸 phoTextAI: The Pro AI Image-Text Studio

**phoTextAI** is a high-performance, open-source image editor that bridges the gap between static images and editable design. Using a hybrid **"Edge + Browser"** AI architecture, it extracts text, identifies typography, and removes objects—all while operating on a zero-cost infrastructure.

Built for designers and developers who want a free, open-source alternative to paid tools like `photext.shop` or Adobe Firefly.

---

## ✨ Features

### 🔍 1. Advanced OCR Engine (WASM)
- **High-Accuracy Extraction:** Uses Tesseract.js (WASM) running in a dedicated Web Worker.
- **Pre-processing Pipeline:** Hidden canvas normalization (Grayscale + Thresholding) ensures accuracy even on noisy backgrounds.
- **Click-to-Edit:** Detected text is converted instantly into Fabric.js Textbox objects with correct coordinates.

### 🪄 2. Magic AI Tools
- **Magic Erase:** Remove original text or watermarks from any image. Uses Cloudflare’s Stable Diffusion Inpainting to fill the background seamlessly.
- **AI Content Rewrite:** Optimize text tone (Professional, Casual, Marketing) via Puter.js or Llama 3 fallbacks.
- **AI Font Matching:** Automatically analyzes typography in an image crop and matches it to the closest Google Font.
- **AI Background Gen:** Generate brand-new backgrounds from text prompts via SDXL.

### 🎨 3. Professional Studio UI
- **Tabbed Sidebar:** Organized toolsets for AI, Object Removal, Filters, Stamps, and Metadata.
- **WebGL Filter Stack:** Real-time controls for Brightness, Contrast, Blur, and Grayscale.
- **Typography Suite:** Full control over font size, weight, alignment, and color.
- **Pro Export:** High-resolution PNG and PDF export with scaling support.

### 🔐 4. Cloud Infrastructure (Free Tier)
- **Supabase SSR:** Secure authentication (GitHub/Google) and persistent project saving.
- **Edge Functions:** Optimized API routes for generative AI tasks.

---

## 🛠️ Tech Stack

- **Frontend:** [Next.js 14](https://nextjs.org/) (App Router)
- **Canvas Engine:** [Fabric.js v5.3](http://fabricjs.com/)
- **AI Inference:** [Puter.js](https://puter.com/) (LLM/Vision) + [Cloudflare Workers AI](https://ai.cloudflare.com/) (Inpainting/SDXL)
- **OCR:** [Tesseract.js](https://tesseract.projectnaptha.com/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand) (with Undo/Redo History)
- **Database/Auth:** [Supabase](https://supabase.com/)
- **UI:** [Tailwind CSS](https://tailwindcss.com/) + [Radix UI](https://www.radix-ui.com/)

---

## 🚀 Getting Started

### 1. Supabase Setup
Create a project at [supabase.com](https://supabase.com) and run this in the SQL Editor:
```sql
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
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Cloudflare (Server-side)
CLOUDFLARE_ACCOUNT_ID=your_id
CLOUDFLARE_API_TOKEN=your_token

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000

3. Installation

# Install system dependencies (Linux/Ubuntu/Codespaces)
sudo apt-get update && sudo apt-get install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

# Install dependencies
npm install --legacy-peer-deps

# Run
npm run dev


🏗️ ## Architecture

[IMAGE UPLOAD] ──► [PRE-PROCESSING] ──► [TESSERACT.JS OCR] ──► [FABRIC.JS CANVAS]
                          │                                         │
                          ▼                                         ▼
               [PUTER.JS VISION MATCH]                      [CLOUDFLARE SDXL]
               (Font Identification)                        (Magic Inpainting)

Client-Side Compute: OCR and Canvas rendering happen on the user's CPU/GPU to ensure zero latency and $0 operational cost.
Hybrid AI Edge: Puter.js handles immediate logic while Cloudflare Workers handle heavy-duty generative tasks.
☁️ ## Deployment

Vercel
Connect your repo.
Add your .env variables to the Vercel dashboard.
Add the following headers to vercel.json to enable high-performance OCR:

{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Cross-Origin-Opener-Policy", "value": "same-origin" },
        { "key": "Cross-Origin-Embedder-Policy", "value": "require-corp" }
      ]
    }
  ]
}

📜 ## License
Distributed under the MIT License. Developed for the open-source community as a fully-free alternative to paid AI design tools.
