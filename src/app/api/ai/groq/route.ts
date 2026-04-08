import { NextRequest, NextResponse } from 'next/server';

import {
  extractGroqOutputText,
  makeAIError,
  makeAISuccess,
  parseGroqRequestPayload,
} from '@/shared/lib/ai/ai-contract';
import { requireGroqEnv } from '@/shared/lib/env/providers';
import { getErrorSummary, logError, logInfo, logWarn } from '@/shared/lib/logging/logger';
import { applyRateLimit, makeRateLimitKey } from '@/shared/lib/security/rate-limit';
import { rateLimitResponse } from '@/shared/lib/security/rate-limit-response';

const GROQ_UPSTREAM_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function POST(req: NextRequest) {
  const rateLimit = applyRateLimit({
    key: makeRateLimitKey('/api/ai/groq', req),
    windowMs: 60_000,
    max: 30,
  });

  if (!rateLimit.allowed) {
    logWarn({
      event: 'groq_rate_limited',
      surface: 'ai',
      route: '/api/ai/groq',
      provider: 'groq',
      statusCode: 429,
      message: 'Groq route rate limit exceeded',
    });
    return rateLimitResponse(rateLimit.retryAfterSeconds);
  }

  logInfo({
    event: 'groq_request_start',
    surface: 'ai',
    route: '/api/ai/groq',
    provider: 'groq',
    operation: 'text_inference',
  });

  try {
    requireGroqEnv();

    const payload = parseGroqRequestPayload(await req.json());
    const apiKey = process.env.GROQ_API_KEY as string;

    const response = await fetch(GROQ_UPSTREAM_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();

      logError({
        event: 'groq_request_failure',
        surface: 'ai',
        route: '/api/ai/groq',
        provider: 'groq',
        operation: 'text_inference',
        statusCode: response.status,
        message: errorText,
      });

      return NextResponse.json(
        makeAIError('groq', 'provider_error', 'Groq request failed.'),
        { status: response.status }
      );
    }

    const data = await response.json();
    const outputText = extractGroqOutputText(data);

    logInfo({
      event: 'groq_request_success',
      surface: 'ai',
      route: '/api/ai/groq',
      provider: 'groq',
      operation: 'text_inference',
    });

    return NextResponse.json(
      makeAISuccess('groq', {
        outputText,
        model: payload.model,
        raw: data,
      })
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Groq request failed unexpectedly.';

    logError({
      event: 'groq_request_failure',
      surface: 'ai',
      route: '/api/ai/groq',
      provider: 'groq',
      operation: 'text_inference',
      ...getErrorSummary(error),
    });

    const isValidationError =
      message.includes('required') ||
      message.includes('invalid') ||
      message.includes('must be');

    return NextResponse.json(
      makeAIError(
        'groq',
        isValidationError ? 'bad_request' : 'provider_unavailable',
        message
      ),
      { status: isValidationError ? 400 : 503 }
    );
  }
}
