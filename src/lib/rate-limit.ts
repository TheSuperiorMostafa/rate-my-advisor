/**
 * Simple in-memory rate limiter
 * ⚠️ For production, use Redis or a proper rate limiting service
 */

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetAt: number;
  };
}

const store: RateLimitStore = {};

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach((key) => {
    if (store[key].resetAt < now) {
      delete store[key];
    }
  });
}, 5 * 60 * 1000);

export interface RateLimitOptions {
  maxRequests: number;
  windowMs: number; // Time window in milliseconds
  keyPrefix?: string;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Check rate limit for a given key
 */
export function checkRateLimit(
  key: string,
  options: RateLimitOptions
): RateLimitResult {
  const fullKey = options.keyPrefix ? `${options.keyPrefix}:${key}` : key;
  const now = Date.now();

  let entry = store[fullKey];

  // If entry doesn't exist or has expired, create new one
  if (!entry || entry.resetAt < now) {
    entry = {
      count: 1,
      resetAt: now + options.windowMs,
    };
    store[fullKey] = entry;
    return {
      allowed: true,
      remaining: options.maxRequests - 1,
      resetAt: entry.resetAt,
    };
  }

  // Increment count
  entry.count++;

  // Check if limit exceeded
  if (entry.count > options.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
    };
  }

  return {
    allowed: true,
    remaining: options.maxRequests - entry.count,
    resetAt: entry.resetAt,
  };
}

/**
 * Rate limit middleware helper
 */
export function rateLimitMiddleware(
  request: Request,
  options: RateLimitOptions
): Response | null {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
  const result = checkRateLimit(ip, options);

  if (!result.allowed) {
    return new Response(
      JSON.stringify({
        error: "Rate limit exceeded",
        resetAt: new Date(result.resetAt).toISOString(),
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "X-RateLimit-Limit": options.maxRequests.toString(),
          "X-RateLimit-Remaining": result.remaining.toString(),
          "X-RateLimit-Reset": result.resetAt.toString(),
          "Retry-After": Math.ceil((result.resetAt - Date.now()) / 1000).toString(),
        },
      }
    );
  }

  return null;
}

/**
 * Get rate limit response (for use in API routes)
 */
export function rateLimitResponse(resetAt: number): Response {
  return new Response(
    JSON.stringify({
      success: false,
      error: "Rate limit exceeded",
      resetAt: new Date(resetAt).toISOString(),
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": Math.ceil((resetAt - Date.now()) / 1000).toString(),
      },
    }
  );
}

/**
 * Production note: Use Redis-based rate limiting
 * Example with @upstash/ratelimit or similar:
 * 
 * import { Ratelimit } from "@upstash/ratelimit";
 * import { Redis } from "@upstash/redis";
 * 
 * const ratelimit = new Ratelimit({
 *   redis: Redis.fromEnv(),
 *   limiter: Ratelimit.slidingWindow(10, "10 s"),
 * });
 */

