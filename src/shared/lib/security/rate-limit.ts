type RateLimitBucket = {
  count: number;
  resetAt: number;
};

type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

type RateLimitConfig = {
  key: string;
  windowMs: number;
  max: number;
};

const globalStore = globalThis as typeof globalThis & {
  __photuneRateLimitStore__?: Map<string, RateLimitBucket>;
};

const store = globalStore.__photuneRateLimitStore__ ?? new Map<string, RateLimitBucket>();
globalStore.__photuneRateLimitStore__ = store;

function now() {
  return Date.now();
}

function getOrCreateBucket(key: string, windowMs: number): RateLimitBucket {
  const existing = store.get(key);
  const ts = now();

  if (!existing || existing.resetAt <= ts) {
    const fresh = {
      count: 0,
      resetAt: ts + windowMs,
    };
    store.set(key, fresh);
    return fresh;
  }

  return existing;
}

export function applyRateLimit(config: RateLimitConfig): RateLimitResult {
  const bucket = getOrCreateBucket(config.key, config.windowMs);
  bucket.count += 1;

  const allowed = bucket.count <= config.max;
  const remaining = Math.max(config.max - bucket.count, 0);
  const retryAfterSeconds = Math.max(Math.ceil((bucket.resetAt - now()) / 1000), 1);

  return {
    allowed,
    remaining,
    retryAfterSeconds,
  };
}

export function getRequestIp(request: Request): string {
  const forwardedFor =
    request.headers.get('x-forwarded-for') ||
    request.headers.get('x-real-ip') ||
    request.headers.get('cf-connecting-ip');

  if (!forwardedFor) {
    return 'unknown';
  }

  return forwardedFor.split(',')[0].trim() || 'unknown';
}

export function makeRateLimitKey(route: string, request: Request, extra = ''): string {
  const ip = getRequestIp(request);
  return [route, ip, extra].filter(Boolean).join(':');
}