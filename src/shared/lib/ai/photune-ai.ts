/**
 * Photune AI client
 * - typed task entrypoints
 * - browser-safe local cache for string tasks
 * - serverless proxy calls only
 * - deterministic fallbacks when providers fail
 */

import { AICacheService } from '@/shared/lib/ai/ai-cache';
import { hashJson } from '@/shared/lib/ai/ai-hash';
import type { AIEnvelope, GroqTextResult, CloudflareTextResult } from '@/shared/lib/ai/ai-contract';

export type Tone = 'professional' | 'casual' | 'marketing' | 'concise';
export type FontCategory = 'sans-serif' | 'serif' | 'monospaced' | 'handwriting';

export type FontSuggestion = {
  category: FontCategory;
  family: string;
  weight: string;
};

type GroqTextMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

type GroqVisionMessage = {
  role: 'user';
  content: Array<
    | { type: 'text'; text: string }
    | { type: 'image_url'; image_url: { url: string } }
  >;
};

type GroqPayload = {
  model: string;
  messages: Array<GroqTextMessage | GroqVisionMessage>;
  temperature?: number;
  max_tokens?: number;
};

const GROQ_ENDPOINT = '/api/ai/groq';
const WORKERS_ENDPOINT = '/api/ai/workers';

const DEFAULT_TIMEOUT_MS = 15_000;
const PRUNE_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;
const TEXT_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const VISION_TTL_MS = 24 * 60 * 60 * 1000;

const FONT_SYSTEM: Record<FontCategory, Omit<FontSuggestion, 'category'>> = {
  'sans-serif': { family: 'Inter', weight: '400' },
  serif: { family: 'Playfair Display', weight: '700' },
  monospaced: { family: 'JetBrains Mono', weight: '500' },
  handwriting: { family: 'Dancing Script', weight: '400' },
};

function sanitizeModelText(input: string | undefined, fallback: string): string {
  const trimmed = (input ?? '').trim();
  if (!trimmed) return fallback;

  return (
    trimmed
      .replace(/^["'`]+|["'`]+$/g, '')
      .replace(/^```[\s\S]*?\n/, '')
      .replace(/```$/g, '')
      .trim() || fallback
  );
}

function normalizeToneContext(tone: Tone): string {
  switch (tone) {
    case 'professional':
      return 'polished, corporate, and precise';
    case 'casual':
      return 'friendly, accessible, and warm';
    case 'marketing':
      return 'persuasive, punchy, and conversion-oriented';
    case 'concise':
      return 'minimal, direct, and stripped of fluff';
    default:
      return 'polished, corporate, and precise';
  }
}

function parseFontCategory(input: string): FontCategory {
  const normalized = input.toLowerCase().trim();

  if (normalized.includes('serif')) return 'serif';
  if (normalized.includes('mono')) return 'monospaced';
  if (normalized.includes('hand')) return 'handwriting';
  return 'sans-serif';
}

async function fetchJsonEnvelope<TData>(
  url: string,
  payload: unknown,
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<AIEnvelope<TData>> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    return (await response.json()) as AIEnvelope<TData>;
  } finally {
    window.clearTimeout(timeout);
  }
}

async function invokeGroqString(
  payload: GroqPayload,
  fallback: string,
  options?: {
    cacheTtlMs?: number;
    cacheNamespace?: string;
    timeoutMs?: number;
  }
): Promise<string> {
  const cacheNamespace = options?.cacheNamespace ?? 'groq';
  const cacheTtlMs = options?.cacheTtlMs ?? 0;
  const timeoutMs = options?.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  try {
    const cacheKeyPayload = {
      namespace: cacheNamespace,
      payload,
    };
    const cacheKey = await hashJson(cacheKeyPayload);

    if (cacheTtlMs > 0) {
      const cached = await AICacheService.get(cacheKey);
      if (cached) {
        return cached;
      }
    }

    const envelope = await fetchJsonEnvelope<GroqTextResult>(GROQ_ENDPOINT, payload, timeoutMs);

    if (!envelope.ok) {
      return fallback;
    }

    const content = sanitizeModelText(envelope.data.outputText, fallback);

    if (cacheTtlMs > 0 && content !== fallback) {
      await AICacheService.set(cacheKey, content, cacheTtlMs);
      void AICacheService.prune(PRUNE_MAX_AGE_MS);
    }

    return content;
  } catch (error) {
    console.error('Photune AI invoke failed:', error);
    return fallback;
  }
}

export const PhotuneAI = {
  async rewrite(text: string, tone: Tone = 'professional'): Promise<string> {
    const fallback = text;

    const payload: GroqPayload = {
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content:
            'You are a professional copy editor. Output only the rewritten text. No preamble. No labels. No quotes.',
        },
        {
          role: 'user',
          content: `Rewrite the following text to be ${normalizeToneContext(tone)}:\n\n${text}`,
        },
      ],
      temperature: 0.65,
      max_tokens: 256,
    };

    return invokeGroqString(payload, fallback, {
      cacheNamespace: `rewrite:${tone}`,
      cacheTtlMs: TEXT_TTL_MS,
    });
  },

  async detectFont(imageDataUrl: string): Promise<FontSuggestion> {
    const fallbackCategory: FontCategory = 'sans-serif';

    const payload: GroqPayload = {
      model: 'llama-3.2-11b-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text:
                'Identify the font category in this image. Respond with only one category: sans-serif, serif, monospaced, or handwriting.',
            },
            {
              type: 'image_url',
              image_url: { url: imageDataUrl },
            },
          ],
        },
      ],
      max_tokens: 16,
    };

    const categoryText = await invokeGroqString(payload, fallbackCategory, {
      cacheNamespace: 'detect-font',
      cacheTtlMs: VISION_TTL_MS,
    });

    const category = parseFontCategory(categoryText);
    return {
      category,
      ...FONT_SYSTEM[category],
    };
  },

  async generateProjectTitle(imageDataUrl: string): Promise<string> {
    const fallback = 'Untitled Asset';

    const payload: GroqPayload = {
      model: 'llama-3.2-11b-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text:
                'Generate a concise, sophisticated three-word title for this image. Output only the title.',
            },
            {
              type: 'image_url',
              image_url: { url: imageDataUrl },
            },
          ],
        },
      ],
      max_tokens: 24,
    };

    return invokeGroqString(payload, fallback, {
      cacheNamespace: 'generate-title',
      cacheTtlMs: VISION_TTL_MS,
    });
  },

  async generateBackground(prompt: string): Promise<Blob> {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

    try {
      const response = await fetch(WORKERS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: 'image-gen',
          prompt: {
            prompt: `Studio photography, high resolution, professional lighting, ${prompt}`,
          },
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Image generation failed with status ${response.status}`);
      }

      const contentType = response.headers.get('content-type') ?? '';
      if (!contentType.includes('image/')) {
        throw new Error('Image generation returned a non-image response.');
      }

      return await response.blob();
    } finally {
      window.clearTimeout(timeout);
    }
  },

  async rewriteWithMetadata(
    text: string,
    tone: Tone = 'professional'
  ): Promise<{ suggestion: string; changed: boolean }> {
    const suggestion = await this.rewrite(text, tone);

    return {
      suggestion,
      changed: suggestion.trim() !== text.trim(),
    };
  },

  async textGen(prompt: string, fallback: string): Promise<string> {
    try {
      const envelope = await fetchJsonEnvelope<CloudflareTextResult>(WORKERS_ENDPOINT, {
        task: 'text-gen',
        prompt: {
          messages: [{ role: 'user', content: prompt }],
        },
      });

      if (!envelope.ok) {
        return fallback;
      }

      return sanitizeModelText(envelope.data.outputText, fallback);
    } catch {
      return fallback;
    }
  },
};
