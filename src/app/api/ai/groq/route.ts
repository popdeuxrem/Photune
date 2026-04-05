import { NextRequest, NextResponse } from 'next/server';
import { getErrorSummary, logError, logInfo, logWarn } from '@/shared/lib/logging/logger';
import { requireGroqEnv } from '@/shared/lib/env/providers';
import { applyRateLimit, makeRateLimitKey } from '@/shared/lib/security/rate-limit';
import { rateLimitResponse } from '@/shared/lib/security/rate-limit-response';

/**
 * Groq API Proxy
 * Routes LLM/Vision requests through server-side to protect API key
 */
export async function POST(req: NextRequest) {
  requireGroqEnv();

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

  const apiKey = process.env.GROQ_API_KEY;

  logInfo({
    event: 'groq_request_start',
    surface: 'ai',
    route: '/api/ai/groq',
    provider: 'groq',
    operation: 'text_inference',
  });

  try {
    const body = await req.json();

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Groq API error:', error);
      logError({
        event: 'groq_request_failure',
        surface: 'ai',
        route: '/api/ai/groq',
        provider: 'groq',
        operation: 'text_inference',
        message: error,
      });
      return NextResponse.json({ error: 'Groq API error' }, { status: response.status });
    }

    const data = await response.json();
    logInfo({
      event: 'groq_request_success',
      surface: 'ai',
      route: '/api/ai/groq',
      provider: 'groq',
      operation: 'text_inference',
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error('Groq proxy error:', error);
    logError({
      event: 'groq_request_failure',
      surface: 'ai',
      route: '/api/ai/groq',
      provider: 'groq',
      operation: 'text_inference',
      ...getErrorSummary(error),
    });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
