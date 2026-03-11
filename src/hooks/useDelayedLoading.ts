import { useState, useEffect } from 'react';

/**
 * Delays showing a loading state to prevent flash of loading UI for fast operations.
 * Returns true only after the specified delay while isLoading remains true.
 */
export function useDelayedLoading(isLoading: boolean, delayMs: number = 250): boolean {
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setShowLoading(true);
      }, delayMs);
      return () => clearTimeout(timer);
    } else {
      setShowLoading(false);
    }
  }, [isLoading, delayMs]);

  return showLoading;
}
