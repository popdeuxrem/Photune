import { NextResponse } from 'next/server';

export function rateLimitResponse(retryAfterSeconds: number) {
  return NextResponse.json(
    {
      error: 'Too many requests',
      retryAfterSeconds,
    },
    {
      status: 429,
      headers: {
        'Retry-After': String(retryAfterSeconds),
      },
    }
  );
}