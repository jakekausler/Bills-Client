/**
 * Development logger that forwards console logs to the backend API
 * Only active in development mode (import.meta.env.DEV)
 */

type LogLevel = 'log' | 'warn' | 'error' | 'info' | 'debug';

// Store original console methods
const originalConsole = {
  log: console.log,
  warn: console.warn,
  error: console.error,
  info: console.info,
  debug: console.debug,
};

/**
 * Serialize arguments for logging, handling objects and errors safely
 */
function serializeArgs(args: unknown[]): unknown[] {
  return args.map((arg) => {
    try {
      // Handle Error objects specially
      if (arg instanceof Error) {
        return {
          message: arg.message,
          stack: arg.stack,
          name: arg.name,
        };
      }
      // Try to JSON stringify, will throw for circular references
      JSON.stringify(arg);
      return arg;
    } catch {
      // Fallback to string representation for circular references or non-serializable objects
      return String(arg);
    }
  });
}

/**
 * Send log to backend API (fire-and-forget)
 */
function sendLogToBackend(level: LogLevel, args: unknown[]): void {
  if (!import.meta.env.DEV) return;

  const payload = {
    level,
    args: serializeArgs(args),
    timestamp: new Date().toISOString(),
  };

  // Try to use sendBeacon for reliability (works even on page unload)
  const data = JSON.stringify(payload);
  if (navigator.sendBeacon) {
    const blob = new Blob([data], { type: 'application/json' });
    navigator.sendBeacon('/api/dev/log', blob);
  } else {
    // Fallback to fetch (fire-and-forget, no await)
    fetch('/api/dev/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data,
      keepalive: true,
    }).catch(() => {
      // Silently ignore errors to avoid infinite loops
    });
  }
}

/**
 * Initialize dev logger - override console methods
 */
export function initDevLogger(): void {
  if (!import.meta.env.DEV) return;

  const levels: LogLevel[] = ['log', 'warn', 'error', 'info', 'debug'];

  levels.forEach((level) => {
    console[level] = (...args: unknown[]) => {
      // Call original console method first
      originalConsole[level](...args);
      // Send to backend
      sendLogToBackend(level, args);
    };
  });
}

/**
 * Reset dev log on the backend (clear previous logs)
 */
export function resetDevLog(): void {
  if (!import.meta.env.DEV) return;

  // Fire-and-forget POST to reset endpoint
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/dev/log/reset');
  } else {
    fetch('/api/dev/log/reset', {
      method: 'POST',
      keepalive: true,
    }).catch(() => {
      // Silently ignore errors
    });
  }
}
