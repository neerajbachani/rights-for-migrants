// Simple in-memory rate limiting for login attempts
// In production, this should use Redis or a proper rate limiting service

interface RateLimitEntry {
  attempts: number;
  lastAttempt: Date;
  blockedUntil?: Date;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

const MAX_ATTEMPTS = 5;
const BLOCK_DURATION = 15 * 60 * 1000; // 15 minutes
const RESET_WINDOW = 60 * 60 * 1000; // 1 hour

/**
 * Check if an IP address is rate limited for login attempts
 */
export function checkRateLimit(ip: string): { allowed: boolean; remainingAttempts?: number; blockedUntil?: Date } {
  const now = new Date();
  const entry = rateLimitStore.get(ip);

  if (!entry) {
    // First attempt
    rateLimitStore.set(ip, {
      attempts: 0,
      lastAttempt: now,
    });
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS };
  }

  // Check if block period has expired
  if (entry.blockedUntil && now > entry.blockedUntil) {
    // Reset the entry
    rateLimitStore.set(ip, {
      attempts: 0,
      lastAttempt: now,
    });
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS };
  }

  // Check if currently blocked
  if (entry.blockedUntil && now <= entry.blockedUntil) {
    return { allowed: false, blockedUntil: entry.blockedUntil };
  }

  // Check if reset window has passed
  const timeSinceLastAttempt = now.getTime() - entry.lastAttempt.getTime();
  if (timeSinceLastAttempt > RESET_WINDOW) {
    // Reset attempts
    rateLimitStore.set(ip, {
      attempts: 0,
      lastAttempt: now,
    });
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS };
  }

  // Check if max attempts reached
  if (entry.attempts >= MAX_ATTEMPTS) {
    const blockedUntil = new Date(now.getTime() + BLOCK_DURATION);
    rateLimitStore.set(ip, {
      ...entry,
      blockedUntil,
    });
    return { allowed: false, blockedUntil };
  }

  return { 
    allowed: true, 
    remainingAttempts: MAX_ATTEMPTS - entry.attempts 
  };
}

/**
 * Record a failed login attempt
 */
export function recordFailedAttempt(ip: string): void {
  const now = new Date();
  const entry = rateLimitStore.get(ip);

  if (!entry) {
    rateLimitStore.set(ip, {
      attempts: 1,
      lastAttempt: now,
    });
  } else {
    rateLimitStore.set(ip, {
      ...entry,
      attempts: entry.attempts + 1,
      lastAttempt: now,
    });
  }
}

/**
 * Reset rate limit for successful login
 */
export function resetRateLimit(ip: string): void {
  rateLimitStore.delete(ip);
}

/**
 * Get client IP address from request headers
 */
export function getClientIP(request: Request): string {
  // Check various headers for the real IP
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  if (cfConnectingIP) {
    return cfConnectingIP;
  }

  // Fallback to a default IP for development
  return '127.0.0.1';
}