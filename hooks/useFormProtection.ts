import { useRef, useCallback } from 'react';
import {
  performSpamCheck,
  incrementRateLimit,
  checkRateLimit,
  type SpamCheckResult,
} from '../lib/spamProtection';

interface UseFormProtectionOptions {
  rateLimitKey?: string;
}

export function useFormProtection(options: UseFormProtectionOptions = {}) {
  const formStartTimeRef = useRef<number>(Date.now());

  const resetFormTimer = useCallback(() => {
    formStartTimeRef.current = Date.now();
  }, []);

  const validate = useCallback((email: string, honeypot = ''): SpamCheckResult => {
    return performSpamCheck(email, honeypot, formStartTimeRef.current);
  }, []);

  const recordSubmission = useCallback(() => {
    incrementRateLimit();
    formStartTimeRef.current = Date.now();
  }, []);

  const getRateLimitStatus = useCallback(() => {
    return checkRateLimit();
  }, []);

  return {
    validate,
    recordSubmission,
    resetFormTimer,
    getRateLimitStatus,
    formStartTime: formStartTimeRef.current,
  };
}
