import { NextRequest, NextResponse } from 'next/server';
import { getErrorSummary, logError, logInfo, logWarn } from '@/shared/lib/logging/logger';
import { requireCloudflareEnv } from '@/shared/lib/env/providers';
import { applyRateLimit, makeRateLimitKey } from '@/shared/lib/security/rate-limit';
import { rateLimitResponse } from '@/shared/lib/security/rate-limit-response';

export async function POST(req: NextRequest) {
  requireCloudflareEnv();

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
    operation: 'cloudflare_request',
  });

  const { image, mask } = await req.json();

  const accId = process.env.CLOUDFLARE_ACCOUNT_ID!;
  const token = process.env.CLOUDFLARE_API_TOKEN!;

  try {
    // Convert base64 inputs to Blobs
    const imageBlob = await (await fetch(image)).blob();
    const maskBlob = await (await fetch(mask)).blob();

    const formData = new FormData();
    formData.append('image', imageBlob);
    formData.append('mask', maskBlob);
    formData.append('prompt', "seamless background, high detail, remove text, matching texture, fill-in naturally");

    // We use the stable-diffusion-v1-5-inpainting model provided in CF Workers AI free/pro tiers
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accId}/ai/run/@cf/runwayml/stable-diffusion-v1-5-inpainting`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      }
    );

    if (!response.ok) throw new Error("Cloudflare AI error");

    logInfo({
      event: 'cloudflare_request_success',
      surface: 'ai',
      route: '/api/ai/inpaint',
      provider: 'cloudflare',
      operation: 'cloudflare_request',
    });

    const buffer = await response.arrayBuffer();
    return new Response(buffer, { headers: { 'Content-Type': 'image/png' } });
  } catch (error) {
    console.error(error);
    logError({
      event: 'cloudflare_request_failure',
      surface: 'ai',
      route: '/api/ai/inpaint',
      provider: 'cloudflare',
      operation: 'cloudflare_request',
      ...getErrorSummary(error),
    });
    return NextResponse.json({ error: "Inpainting failed" }, { status: 500 });
  }
}
