/**
 * Spam Protection Utilities
 * Includes rate limiting, honeypot validation, and disposable email detection
 */

// Rate limiting using localStorage (client-side)
interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const RATE_LIMIT_KEY = 'form_submissions';

interface RateLimitConfig {
  windowMs: number;     // Time window in milliseconds
  maxRequests: number;  // Max requests per window
}

const DEFAULT_CONFIG: RateLimitConfig = {
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 5,           // 5 submissions per hour
};

/**
 * Check if the user has exceeded the rate limit
 */
export function checkRateLimit(
  config: RateLimitConfig = DEFAULT_CONFIG
): { allowed: boolean; remaining: number; resetIn: number } {
  try {
    const now = Date.now();
    const stored = localStorage.getItem(RATE_LIMIT_KEY);
    let record: RateLimitRecord = stored ? JSON.parse(stored) : null;

    // Reset if window has passed
    if (!record || now > record.resetTime) {
      record = {
        count: 0,
        resetTime: now + config.windowMs,
      };
    }

    // Check if limit exceeded
    if (record.count >= config.maxRequests) {
      const resetIn = Math.max(0, record.resetTime - now);
      return {
        allowed: false,
        remaining: 0,
        resetIn,
      };
    }

    return {
      allowed: true,
      remaining: config.maxRequests - record.count,
      resetIn: record.resetTime - now,
    };
  } catch (e) {
    // If localStorage fails, allow the request
    console.warn('Rate limit check failed:', e);
    return { allowed: true, remaining: config.maxRequests, resetIn: config.windowMs };
  }
}

/**
 * Increment the rate limit counter
 */
export function incrementRateLimit(config: RateLimitConfig = DEFAULT_CONFIG): void {
  try {
    const now = Date.now();
    const stored = localStorage.getItem(RATE_LIMIT_KEY);
    let record: RateLimitRecord = stored ? JSON.parse(stored) : null;

    if (!record || now > record.resetTime) {
      record = {
        count: 1,
        resetTime: now + config.windowMs,
      };
    } else {
      record.count++;
    }

    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(record));
  } catch (e) {
    console.warn('Rate limit increment failed:', e);
  }
}

/**
 * Common disposable email domains to block
 */
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'tempmail.com',
  'throwaway.email',
  'guerrillamail.com',
  'mailinator.com',
  '10minutemail.com',
  'temp-mail.org',
  'fakeinbox.com',
  'trashmail.com',
  'yopmail.com',
  'dispostable.com',
  'maildrop.cc',
  'getairmail.com',
  'mohmal.com',
  'tempinbox.com',
  'burnermail.io',
  'sharklasers.com',
  'guerrillamailblock.com',
  'spam4.me',
  'grr.la',
  'mailnesia.com',
]);

/**
 * Check if an email uses a disposable domain
 */
export function isDisposableEmail(email: string): boolean {
  try {
    const domain = email.toLowerCase().split('@')[1];
    return DISPOSABLE_EMAIL_DOMAINS.has(domain);
  } catch {
    return false;
  }
}

/**
 * Basic email format validation
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Check if honeypot field was filled (indicates bot)
 */
export function isHoneypotFilled(honeypotValue: string): boolean {
  return honeypotValue.trim().length > 0;
}

/**
 * Calculate form submission time (bots submit too fast)
 */
export function isSubmissionTooFast(startTime: number, minSeconds = 3): boolean {
  const elapsedSeconds = (Date.now() - startTime) / 1000;
  return elapsedSeconds < minSeconds;
}

/**
 * Comprehensive spam check
 */
export interface SpamCheckResult {
  isSpam: boolean;
  reason?: string;
}

export function performSpamCheck(
  email: string,
  honeypotValue: string,
  formStartTime: number,
  captchaToken?: string | null
): SpamCheckResult {
  // Check honeypot
  if (isHoneypotFilled(honeypotValue)) {
    return { isSpam: true, reason: 'Bot detected' };
  }

  // Check submission time
  if (isSubmissionTooFast(formStartTime)) {
    return { isSpam: true, reason: 'Please take your time filling out the form' };
  }

  // Check rate limit
  const rateLimit = checkRateLimit();
  if (!rateLimit.allowed) {
    const minutes = Math.ceil(rateLimit.resetIn / 60000);
    return {
      isSpam: true,
      reason: `Too many submissions. Please try again in ${minutes} minute${minutes > 1 ? 's' : ''}.`
    };
  }

  // Check email validity
  if (!isValidEmail(email)) {
    return { isSpam: true, reason: 'Please enter a valid email address' };
  }

  // Check disposable email
  if (isDisposableEmail(email)) {
    return { isSpam: true, reason: 'Please use a permanent email address' };
  }

  // If captcha is required but not provided
  // Note: This check is optional since captcha might not be enabled
  // if (captchaToken === null) {
  //   return { isSpam: true, reason: 'Please complete the captcha' };
  // }

  return { isSpam: false };
}

/**
 * Format reset time for display
 */
export function formatResetTime(resetIn: number): string {
  const minutes = Math.ceil(resetIn / 60000);
  if (minutes > 60) {
    const hours = Math.ceil(minutes / 60);
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  }
  return `${minutes} minute${minutes > 1 ? 's' : ''}`;
}
