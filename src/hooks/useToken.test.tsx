import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useToken } from './useToken';

describe('useToken', () => {
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: vi.fn((key: string) => store[key] ?? null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key];
      }),
      clear: () => {
        store = {};
      },
    };
  })();

  beforeEach(() => {
    vi.stubGlobal('localStorage', localStorageMock);
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('initial state', () => {
    it('returns null token when localStorage has no token', () => {
      localStorageMock.getItem.mockReturnValue(null as unknown as string);

      const { result } = renderHook(() => useToken());

      expect(result.current.token).toBeNull();
    });

    it('returns the stored token when localStorage has a token', () => {
      localStorageMock.getItem.mockReturnValue('stored-jwt-token');

      const { result } = renderHook(() => useToken());

      expect(result.current.token).toBe('stored-jwt-token');
    });
  });

  describe('setToken', () => {
    it('saves the token to localStorage', () => {
      localStorageMock.getItem.mockReturnValue(null as unknown as string);

      const { result } = renderHook(() => useToken());

      act(() => {
        result.current.setToken('new-jwt-token');
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith('token', 'new-jwt-token');
    });

    it('updates the token state', () => {
      localStorageMock.getItem.mockReturnValue(null as unknown as string);

      const { result } = renderHook(() => useToken());

      act(() => {
        result.current.setToken('new-jwt-token');
      });

      expect(result.current.token).toBe('new-jwt-token');
    });
  });

  describe('clearToken', () => {
    it('removes the token from localStorage', () => {
      localStorageMock.getItem.mockReturnValue('existing-token');

      const { result } = renderHook(() => useToken());

      act(() => {
        result.current.clearToken();
      });

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
    });

    it('sets the token state to null', () => {
      localStorageMock.getItem.mockReturnValue('existing-token');

      const { result } = renderHook(() => useToken());

      act(() => {
        result.current.clearToken();
      });

      expect(result.current.token).toBeNull();
    });
  });

  describe('validateToken', () => {
    it('returns false when there is no token', async () => {
      localStorageMock.getItem.mockReturnValue(null as unknown as string);

      const { result } = renderHook(() => useToken());

      let isValid: boolean | undefined;
      await act(async () => {
        isValid = await result.current.validateToken();
      });

      expect(isValid).toBe(false);
    });

    it('returns true when fetch response is ok', async () => {
      localStorageMock.getItem.mockReturnValue('valid-token');
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
        }),
      );

      const { result } = renderHook(() => useToken());

      let isValid: boolean | undefined;
      await act(async () => {
        isValid = await result.current.validateToken();
      });

      expect(isValid).toBe(true);
    });

    it('calls /api/auth/validate with the Authorization header', async () => {
      localStorageMock.getItem.mockReturnValue('my-jwt-token');
      const fetchMock = vi.fn().mockResolvedValue({ ok: true });
      vi.stubGlobal('fetch', fetchMock);

      const { result } = renderHook(() => useToken());

      await act(async () => {
        await result.current.validateToken();
      });

      expect(fetchMock).toHaveBeenCalledWith('/api/auth/validate', {
        headers: {
          Authorization: 'my-jwt-token',
        },
      });
    });

    it('clears the token and returns false when fetch response is not ok', async () => {
      localStorageMock.getItem.mockReturnValue('expired-token');
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
        }),
      );

      const { result } = renderHook(() => useToken());

      let isValid: boolean | undefined;
      await act(async () => {
        isValid = await result.current.validateToken();
      });

      expect(isValid).toBe(false);
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
      expect(result.current.token).toBeNull();
    });

    it('clears the token and returns false when fetch throws an error', async () => {
      localStorageMock.getItem.mockReturnValue('bad-token');
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network failure')));

      const { result } = renderHook(() => useToken());

      let isValid: boolean | undefined;
      await act(async () => {
        isValid = await result.current.validateToken();
      });

      expect(isValid).toBe(false);
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
      expect(result.current.token).toBeNull();
    });
  });

  describe('returned interface', () => {
    it('exposes token, setToken, clearToken, and validateToken', () => {
      localStorageMock.getItem.mockReturnValue(null as unknown as string);

      const { result } = renderHook(() => useToken());

      expect(result.current).toHaveProperty('token');
      expect(result.current.setToken).toBeTypeOf('function');
      expect(result.current.clearToken).toBeTypeOf('function');
      expect(result.current.validateToken).toBeTypeOf('function');
    });
  });
});
