/**
 * Monitoring and Observability utilities
 * Integrates with error tracking, analytics, and performance monitoring
 */

// Error tracking configuration
interface ErrorContext {
  userId?: string;
  email?: string;
  page?: string;
  component?: string;
  action?: string;
  extra?: Record<string, unknown>;
}

interface ErrorReport {
  message: string;
  stack?: string;
  context: ErrorContext;
  timestamp: string;
  userAgent: string;
  url: string;
}

// In-memory error queue for batching
const errorQueue: ErrorReport[] = [];
const MAX_QUEUE_SIZE = 50;
const FLUSH_INTERVAL = 30000; // 30 seconds

// Initialize error tracking
export function initErrorTracking(): void {
  // Global error handler
  window.onerror = (message, source, lineno, colno, error) => {
    captureError(error || new Error(String(message)), {
      extra: { source, lineno, colno },
    });
    return false;
  };

  // Unhandled promise rejection handler
  window.addEventListener('unhandledrejection', (event) => {
    captureError(event.reason, {
      action: 'unhandledrejection',
    });
  });

  // Flush errors periodically
  setInterval(flushErrors, FLUSH_INTERVAL);

  // Flush on page unload
  window.addEventListener('beforeunload', () => {
    flushErrors();
  });
}

// Capture an error
export function captureError(error: Error | unknown, context: ErrorContext = {}): void {
  const errorReport: ErrorReport = {
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    context: {
      ...context,
      page: window.location.pathname,
    },
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
  };

  errorQueue.push(errorReport);

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error captured:', errorReport);
  }

  // Flush if queue is full
  if (errorQueue.length >= MAX_QUEUE_SIZE) {
    flushErrors();
  }
}

// Flush errors to backend/service
async function flushErrors(): Promise<void> {
  if (errorQueue.length === 0) return;

  const errors = [...errorQueue];
  errorQueue.length = 0;

  try {
    // Send to your error tracking endpoint
    // Replace with actual Sentry/LogRocket/etc. integration
    const endpoint = '/api/errors';

    await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ errors }),
      keepalive: true,
    }).catch(() => {
      // Silent fail - don't want error tracking to cause errors
    });
  } catch {
    // Re-add errors to queue on failure
    errorQueue.unshift(...errors);
  }
}

// Performance monitoring
interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

const metricsQueue: PerformanceMetric[] = [];

export function trackMetric(
  name: string,
  value: number,
  unit = 'ms',
  metadata?: Record<string, unknown>
): void {
  metricsQueue.push({
    name,
    value,
    unit,
    timestamp: new Date().toISOString(),
    metadata,
  });

  if (process.env.NODE_ENV === 'development') {
    console.log(`Metric: ${name} = ${value}${unit}`, metadata);
  }
}

// Custom timing helper
export function startTiming(name: string): () => void {
  const start = performance.now();

  return () => {
    const duration = performance.now() - start;
    trackMetric(name, Math.round(duration));
  };
}

// Track page load performance
export function trackPageLoad(): void {
  if (typeof window === 'undefined') return;

  // Wait for page to fully load
  window.addEventListener('load', () => {
    setTimeout(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

      if (navigation) {
        trackMetric('page_load_time', Math.round(navigation.loadEventEnd - navigation.startTime));
        trackMetric('dom_interactive', Math.round(navigation.domInteractive - navigation.startTime));
        trackMetric('dom_complete', Math.round(navigation.domComplete - navigation.startTime));
        trackMetric('ttfb', Math.round(navigation.responseStart - navigation.requestStart));
      }

      // Track LCP
      const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
      if (lcpEntries.length > 0) {
        const lcp = lcpEntries[lcpEntries.length - 1] as PerformanceEntry;
        trackMetric('lcp', Math.round(lcp.startTime));
      }
    }, 0);
  });
}

// User action tracking
interface UserAction {
  action: string;
  category: string;
  label?: string;
  value?: number;
  timestamp: string;
}

const actionQueue: UserAction[] = [];

export function trackAction(
  action: string,
  category: string,
  label?: string,
  value?: number
): void {
  actionQueue.push({
    action,
    category,
    label,
    value,
    timestamp: new Date().toISOString(),
  });

  if (process.env.NODE_ENV === 'development') {
    console.log(`Action: ${category}/${action}`, { label, value });
  }
}

// Page view tracking
export function trackPageView(page: string, title?: string): void {
  trackAction('page_view', 'navigation', page);

  if (process.env.NODE_ENV === 'development') {
    console.log(`Page view: ${page}`, { title });
  }
}

// Feature flag tracking
export function trackFeatureUsage(feature: string, variant?: string): void {
  trackAction('feature_used', 'features', feature, variant ? 1 : 0);
}

// Session recording (placeholder for tools like LogRocket, FullStory)
export function identifyUser(userId: string, traits: Record<string, unknown> = {}): void {
  if (process.env.NODE_ENV === 'development') {
    console.log(`Identified user: ${userId}`, traits);
  }

  // Integrate with session recording tool here
  // Example: LogRocket.identify(userId, traits);
}

// Health check endpoint helper
export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: {
    name: string;
    status: 'pass' | 'fail';
    message?: string;
    responseTime?: number;
  }[];
  timestamp: string;
}

export async function checkHealth(checks: (() => Promise<boolean>)[]): Promise<HealthStatus> {
  const results = await Promise.all(
    checks.map(async (check, index) => {
      const start = performance.now();
      try {
        const passed = await check();
        return {
          name: `check_${index}`,
          status: passed ? ('pass' as const) : ('fail' as const),
          responseTime: Math.round(performance.now() - start),
        };
      } catch (error) {
        return {
          name: `check_${index}`,
          status: 'fail' as const,
          message: error instanceof Error ? error.message : 'Unknown error',
          responseTime: Math.round(performance.now() - start),
        };
      }
    })
  );

  const failedChecks = results.filter((r) => r.status === 'fail').length;

  return {
    status: failedChecks === 0 ? 'healthy' : failedChecks < results.length ? 'degraded' : 'unhealthy',
    checks: results,
    timestamp: new Date().toISOString(),
  };
}

// Uptime monitoring helper
let lastHeartbeat = Date.now();

export function startHeartbeat(intervalMs = 60000): () => void {
  const interval = setInterval(() => {
    lastHeartbeat = Date.now();
    trackMetric('heartbeat', 1, 'count');
  }, intervalMs);

  return () => clearInterval(interval);
}

export function getLastHeartbeat(): number {
  return lastHeartbeat;
}

// Console override for production (optional)
export function overrideConsole(): void {
  if (process.env.NODE_ENV === 'production') {
    const noop = () => {};

    // Disable console in production
    console.log = noop;
    console.debug = noop;
    console.info = noop;

    // Keep errors and warnings
    const originalError = console.error;
    const originalWarn = console.warn;

    console.error = (...args) => {
      captureError(new Error(args.join(' ')), { action: 'console.error' });
      originalError.apply(console, args);
    };

    console.warn = (...args) => {
      trackAction('console_warning', 'logs', args.join(' '));
      originalWarn.apply(console, args);
    };
  }
}

// Initialize all monitoring
export function initMonitoring(): void {
  initErrorTracking();
  trackPageLoad();

  if (process.env.NODE_ENV === 'development') {
    console.log('Monitoring initialized');
  }
}
