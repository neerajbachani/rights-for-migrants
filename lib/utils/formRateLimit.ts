// Rate limiting specifically for form submissions
// 5 submissions per IP per hour

interface FormRateLimitEntry {
  submissions: number;
  firstSubmission: Date;
  lastSubmission: Date;
  blockedUntil?: Date;
}

const formRateLimitStore = new Map<string, FormRateLimitEntry>();

const MAX_SUBMISSIONS = 5;
const TIME_WINDOW = 60 * 60 * 1000; // 1 hour
const BLOCK_DURATION = 60 * 60 * 1000; // 1 hour block

/**
 * Check if an IP address is rate limited for form submissions
 */
export function checkFormRateLimit(ip: string): { 
  allowed: boolean; 
  remainingSubmissions?: number; 
  blockedUntil?: Date;
  resetTime?: Date;
} {
  const now = new Date();
  const entry = formRateLimitStore.get(ip);

  if (!entry) {
    // First submission
    return { 
      allowed: true, 
      remainingSubmissions: MAX_SUBMISSIONS - 1,
      resetTime: new Date(now.getTime() + TIME_WINDOW)
    };
  }

  // Check if block period has expired
  if (entry.blockedUntil && now > entry.blockedUntil) {
    // Reset the entry
    formRateLimitStore.delete(ip);
    return { 
      allowed: true, 
      remainingSubmissions: MAX_SUBMISSIONS - 1,
      resetTime: new Date(now.getTime() + TIME_WINDOW)
    };
  }

  // Check if currently blocked
  if (entry.blockedUntil && now <= entry.blockedUntil) {
    return { allowed: false, blockedUntil: entry.blockedUntil };
  }

  // Check if time window has passed
  const timeSinceFirst = now.getTime() - entry.firstSubmission.getTime();
  if (timeSinceFirst > TIME_WINDOW) {
    // Reset the window
    formRateLimitStore.delete(ip);
    return { 
      allowed: true, 
      remainingSubmissions: MAX_SUBMISSIONS - 1,
      resetTime: new Date(now.getTime() + TIME_WINDOW)
    };
  }

  // Check if max submissions reached
  if (entry.submissions >= MAX_SUBMISSIONS) {
    const blockedUntil = new Date(now.getTime() + BLOCK_DURATION);
    formRateLimitStore.set(ip, {
      ...entry,
      blockedUntil,
    });
    return { allowed: false, blockedUntil };
  }

  return { 
    allowed: true, 
    remainingSubmissions: MAX_SUBMISSIONS - entry.submissions - 1,
    resetTime: new Date(entry.firstSubmission.getTime() + TIME_WINDOW)
  };
}

/**
 * Record a form submission attempt
 */
export function recordFormSubmission(ip: string): void {
  const now = new Date();
  const entry = formRateLimitStore.get(ip);

  if (!entry) {
    formRateLimitStore.set(ip, {
      submissions: 1,
      firstSubmission: now,
      lastSubmission: now,
    });
  } else {
    formRateLimitStore.set(ip, {
      ...entry,
      submissions: entry.submissions + 1,
      lastSubmission: now,
    });
  }
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