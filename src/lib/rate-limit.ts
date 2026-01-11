// Simple in-memory rate limiter for API routes
// For production at scale, consider using Upstash Redis or similar

interface RateLimitEntry {
  count: number
  resetTime: number
}

// In-memory store - note: this resets on serverless cold starts
// For production, use Redis or a distributed store
const rateLimitStore = new Map<string, RateLimitEntry>()

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now()
  rateLimitStore.forEach((entry, key) => {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key)
    }
  })
}, 60000) // Clean every minute

export interface RateLimitConfig {
  windowMs: number      // Time window in milliseconds
  maxRequests: number   // Max requests per window
}

export interface RateLimitResult {
  success: boolean
  remaining: number
  resetTime: number
}

// Default configs for different endpoint types
export const RATE_LIMITS = {
  // Strict limits for auth endpoints
  auth: { windowMs: 15 * 60 * 1000, maxRequests: 5 },     // 5 per 15 min
  // Standard API limits
  api: { windowMs: 60 * 1000, maxRequests: 60 },          // 60 per minute
  // Stricter for expensive operations
  expensive: { windowMs: 60 * 1000, maxRequests: 10 },    // 10 per minute
  // Very strict for sensitive operations
  sensitive: { windowMs: 60 * 1000, maxRequests: 5 },     // 5 per minute
} as const

/**
 * Check rate limit for a given identifier
 * @param identifier - Unique identifier (e.g., IP address, user ID)
 * @param endpoint - Endpoint name for separate limits
 * @param config - Rate limit configuration
 */
export function checkRateLimit(
  identifier: string,
  endpoint: string,
  config: RateLimitConfig = RATE_LIMITS.api
): RateLimitResult {
  const key = `${endpoint}:${identifier}`
  const now = Date.now()

  const entry = rateLimitStore.get(key)

  // No existing entry or window expired
  if (!entry || now > entry.resetTime) {
    const resetTime = now + config.windowMs
    rateLimitStore.set(key, { count: 1, resetTime })
    return {
      success: true,
      remaining: config.maxRequests - 1,
      resetTime,
    }
  }

  // Within window, check count
  if (entry.count >= config.maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetTime: entry.resetTime,
    }
  }

  // Increment count
  entry.count++
  return {
    success: true,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
  }
}

/**
 * Get client identifier from request
 * Uses X-Forwarded-For header or falls back to a generic key
 */
export function getClientIdentifier(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }
  // Fallback - not ideal but better than nothing
  return 'unknown'
}

/**
 * Create rate limit response with proper headers
 */
export function rateLimitResponse(result: RateLimitResult) {
  return new Response(
    JSON.stringify({
      error: 'Too many requests',
      retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000),
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'X-RateLimit-Remaining': String(result.remaining),
        'X-RateLimit-Reset': String(result.resetTime),
        'Retry-After': String(Math.ceil((result.resetTime - Date.now()) / 1000)),
      },
    }
  )
}
