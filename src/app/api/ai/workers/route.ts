import { NextResponse } from 'next/server';

import {
  extractCloudflareTextOutput,
  makeAIError,
  makeAISuccess,
  parseCloudflareWorkersRequest,
} from '@/shared/lib/ai/ai-contract';
import { requireCloudflareEnv } from '@/shared/lib/env/providers';
import { getErrorSummary, logError, logInfo, logWarn } from '@/shared/lib/logging/logger';
import { applyRateLimit, makeRateLimitKey } from '@/shared/lib/security/rate-limit';
import { rateLimitResponse } from '@/shared/lib/security/rate-limit-response';

const IMAGE_MODEL = '@cf/stabilityai/stable-diffusion-xl-base-1.0';
const TEXT_MODEL = '@cf/meta/llama-3-8b-instruct';

export async function POST(request: Request) {
  const rateLimit = applyRateLimit({
    key: makeRateLimitKey('/api/ai/workers', request),
    windowMs: 60_000,
    max: 30,
  });

  if (!rateLimit.allowed) {
    logWarn({
      event: 'cloudflare_workers_rate_limited',
      surface: 'ai',
      route: '/api/ai/workers',
      provider: 'cloudflare',
      statusCode: 429,
      message: 'Cloudflare workers route rate limit exceeded',
    });
    return rateLimitResponse(rateLimit.retryAfterSeconds);
  }

  logInfo({
    event: 'cloudflare_request_start',
    surface: 'ai',
    route: '/api/ai/workers',
    provider: 'cloudflare',
    operation: 'cloudflare_request',
  });

  try {
    requireCloudflareEnv();

    const { task, prompt } = parseCloudflareWorkersRequest(await request.json());
    const accId = process.env.CLOUDFLARE_ACCOUNT_ID as string;
    const token = process.env.CLOUDFLARE_API_TOKEN as string;
    const model = task === 'image-gen' ? IMAGE_MODEL : TEXT_MODEL;

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accId}/ai/run/${model}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(prompt),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      logError({
        event: 'cloudflare_request_failure',
        surface: 'ai',
        route: '/api/ai/workers',
        provider: 'cloudflare',
        operation: 'cloudflare_request',
        statusCode: response.status,
        message: errorText,
      });

      return NextResponse.json(
        makeAIError('cloudflare', 'provider_error', 'Cloudflare AI request failed.'),
        { status: response.status }
      );
    }

    if (task === 'image-gen') {
      const buffer = await response.arrayBuffer();

      logInfo({
        event: 'cloudflare_request_success',
        surface: 'ai',
        route: '/api/ai/workers',
        provider: 'cloudflare',
        operation: 'cloudflare_request',
      });

      return new Response(buffer, {
        headers: { 'Content-Type': 'image/png' },
      });
    }

    const result = await response.json();
    const outputText = extractCloudflareTextOutput(result);

    logInfo({
      event: 'cloudflare_request_success',
      surface: 'ai',
      route: '/api/ai/workers',
      provider: 'cloudflare',
      operation: 'cloudflare_request',
    });

    return NextResponse.json(
      makeAISuccess('cloudflare', {
        task: 'text-gen' as const,
        outputText,
        raw: result,
      })
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Cloudflare request failed unexpectedly.';

    logError({
      event: 'cloudflare_request_failure',
      surface: 'ai',
      route: '/api/ai/workers',
      provider: 'cloudflare',
      operation: 'cloudflare_request',
      ...getErrorSummary(error),
    });

    const isValidationError =
      message.includes('required') ||
      message.includes('invalid') ||
      message.includes('unsupported');

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
