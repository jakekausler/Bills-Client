import { describe, it, expect, vi } from 'vitest';
import { useDelayedLoading } from './useDelayedLoading';
import { renderHook } from '@testing-library/react';

describe('useDelayedLoading', () => {
  it('returns false initially when isLoading is true', () => {
    const { result } = renderHook(() => useDelayedLoading(true, 250));

    expect(result.current).toBe(false);
  });

  it('returns false when isLoading is false', () => {
    const { result } = renderHook(() => useDelayedLoading(false, 250));

    expect(result.current).toBe(false);
  });

  it('returns false when isLoading changes to false before delay', () => {
    const { result, rerender } = renderHook(
      ({ isLoading, delay }: { isLoading: boolean; delay: number }) =>
        useDelayedLoading(isLoading, delay),
      { initialProps: { isLoading: true, delay: 250 } }
    );

    expect(result.current).toBe(false);

    rerender({ isLoading: false, delay: 250 });

    expect(result.current).toBe(false);
  });

  it('clears timeout when isLoading becomes false', () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
    const { rerender } = renderHook(
      ({ isLoading, delay }: { isLoading: boolean; delay: number }) =>
        useDelayedLoading(isLoading, delay),
      { initialProps: { isLoading: true, delay: 250 } }
    );

    rerender({ isLoading: false, delay: 250 });

    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });

  it('respects custom delay value', () => {
    // Test that different delays are passed to setTimeout
    const timeoutSpy = vi.spyOn(global, 'setTimeout');
    renderHook(() => useDelayedLoading(true, 500));
    expect(timeoutSpy).toHaveBeenCalledWith(expect.any(Function), 500);
    timeoutSpy.mockRestore();
  });

  it('uses default delay of 250ms when not specified', () => {
    const timeoutSpy = vi.spyOn(global, 'setTimeout');
    renderHook(() => useDelayedLoading(true));
    expect(timeoutSpy).toHaveBeenCalledWith(expect.any(Function), 250);
    timeoutSpy.mockRestore();
  });
});
