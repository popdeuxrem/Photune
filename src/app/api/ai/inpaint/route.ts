import { NextRequest, NextResponse } from 'next/server';

import { makeAIError } from '@/shared/lib/ai/ai-contract';
import { requireCloudflareEnv } from '@/shared/lib/env/providers';
import { getErrorSummary, logError, logInfo, logWarn } from '@/shared/lib/logging/logger';
import { applyRateLimit, makeRateLimitKey } from '@/shared/lib/security/rate-limit';
import { rateLimitResponse } from '@/shared/lib/security/rate-limit-response';

function assertInpaintDataUrl(value: unknown, field: 'image' | 'mask'): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`Field "${field}" is required.`);
  }

  const normalized = value.trim();

  if (!normalized.startsWith('data:image/')) {
    throw new Error(`Field "${field}" must be a data URL.`);
  }

  return normalized;
}

export async function POST(req: NextRequest) {
  const rateLimit = applyRateLimit({
    key: makeRateLimitKey('/api/ai/inpaint', req),
    windowMs: 60_000,
    max: 20,
  });

  if (!rateLimit.allowed) {
    logWarn({
      event: 'cloudflare_inpaint_rate_limited',
      surface: 'ai',
      route: '/api/ai/inpaint',
      provider: 'cloudflare',
      statusCode: 429,
      message: 'Cloudflare inpaint route rate limit exceeded',
    });
    return rateLimitResponse(rateLimit.retryAfterSeconds);
  }

  logInfo({
    event: 'cloudflare_request_start',
    surface: 'ai',
    route: '/api/ai/inpaint',
    provider: 'cloudflare',
    operation: 'cloudflare_inpaint',
  });

  try {
    requireCloudflareEnv();

    const body = await req.json();
    const image = assertInpaintDataUrl(body?.image, 'image');
    const mask = assertInpaintDataUrl(body?.mask, 'mask');

    const accId = process.env.CLOUDFLARE_ACCOUNT_ID as string;
    const token = process.env.CLOUDFLARE_API_TOKEN as string;

    const imageBlob = await (await fetch(image)).blob();
    const maskBlob = await (await fetch(mask)).blob();

    const formData = new FormData();
    formData.append('image', imageBlob);
    formData.append('mask', maskBlob);
    formData.append(
      'prompt',
      'seamless background, high detail, remove text, matching texture, fill-in naturally'
    );

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accId}/ai/run/@cf/runwayml/stable-diffusion-v1-5-inpainting`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      logError({
        event: 'cloudflare_request_failure',
        surface: 'ai',
        route: '/api/ai/inpaint',
        provider: 'cloudflare',
        operation: 'cloudflare_inpaint',
        statusCode: response.status,
        message: errorText,
      });

      return NextResponse.json(
        makeAIError('cloudflare', 'provider_error', 'Inpainting failed upstream.'),
        { status: response.status }
      );
    }

    logInfo({
      event: 'cloudflare_request_success',
      surface: 'ai',
      route: '/api/ai/inpaint',
      provider: 'cloudflare',
      operation: 'cloudflare_inpaint',
    });

    const buffer = await response.arrayBuffer();
    return new Response(buffer, {
      headers: { 'Content-Type': 'image/png' },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Inpainting failed unexpectedly.';

    logError({
      event: 'cloudflare_request_failure',
      surface: 'ai',
      route: '/api/ai/inpaint',
      provider: 'cloudflare',
      operation: 'cloudflare_inpaint',
      ...getErrorSummary(error),
    });

    const isValidationError = message.includes('required') || message.includes('data URL');

    return NextResponse.json(
      makeAIError(
        'cloudflare',
        isValidationError ? 'bad_request' : 'provider_unavailable',
        message
      ),
      { status: isValidationError ? 400 : 503 }
    );
  }
}
