import { NextResponse } from 'next/server';
import { getErrorSummary, logError, logInfo, logWarn } from '@/shared/lib/logging/logger';
import { requireCloudflareEnv } from '@/shared/lib/env/providers';
import { applyRateLimit, makeRateLimitKey } from '@/shared/lib/security/rate-limit';
import { rateLimitResponse } from '@/shared/lib/security/rate-limit-response';

export async function POST(request: Request) {
  requireCloudflareEnv();

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

  const { prompt, task } = await request.json();
  const accId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const token = process.env.CLOUDFLARE_API_TOKEN;

  let model = task === 'image-gen' 
    ? '@cf/stabilityai/stable-diffusion-xl-base-1.0' 
    : '@cf/meta/llama-3-8b-instruct';

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accId}/ai/run/${model}`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(prompt),
    }
  );

  if (task === 'image-gen') {
    const buffer = await response.arrayBuffer();
    logInfo({
      event: 'cloudflare_request_success',
      surface: 'ai',
      route: '/api/ai/workers',
      provider: 'cloudflare',
      operation: 'cloudflare_request',
    });
    return new Response(buffer, { headers: { 'Content-Type': 'image/png' } });
  }

  const result = await response.json();
  logInfo({
    event: 'cloudflare_request_success',
    surface: 'ai',
    route: '/api/ai/workers',
    provider: 'cloudflare',
    operation: 'cloudflare_request',
  });
  return NextResponse.json(result.result);
}
