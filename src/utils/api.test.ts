import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock the simulations selector
vi.mock('../features/simulations/select', () => ({
  selectSelectedSimulation: vi.fn(),
}));

import { getHeaders, fetchWithAuth, api, initializeApi } from './api';
import { selectSelectedSimulation } from '../features/simulations/select';

const mockSelectSelectedSimulation = selectSelectedSimulation as ReturnType<typeof vi.fn>;

// Helper to build a mock Response
function makeMockResponse(data: unknown, ok = true, status = 200) {
  return {
    ok,
    status,
    json: vi.fn().mockResolvedValue(data),
  };
}

describe('getHeaders', () => {
  it('returns an empty object when no token and no body', () => {
    const headers = getHeaders(null, false);
    expect(headers).toEqual({});
  });

  it('includes Authorization header when a token is provided', () => {
    const headers = getHeaders('my-token', false);
    expect(headers['Authorization']).toBe('my-token');
  });

  it('includes Content-Type when hasBody is true', () => {
    const headers = getHeaders(null, true);
    expect(headers['Content-Type']).toBe('application/json');
  });

  it('includes both Authorization and Content-Type when token and body are present', () => {
    const headers = getHeaders('abc123', true);
    expect(headers['Authorization']).toBe('abc123');
    expect(headers['Content-Type']).toBe('application/json');
  });

  it('does not include Authorization when token is undefined', () => {
    const headers = getHeaders(undefined, false);
    expect(headers).not.toHaveProperty('Authorization');
  });

  it('does not include Authorization when token is null', () => {
    const headers = getHeaders(null, false);
    expect(headers).not.toHaveProperty('Authorization');
  });

  it('does not include Content-Type when hasBody is false', () => {
    const headers = getHeaders('token', false);
    expect(headers).not.toHaveProperty('Content-Type');
  });
});

describe('fetchWithAuth', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    // Default: no token in localStorage
    vi.stubGlobal('localStorage', {
      getItem: vi.fn().mockReturnValue(null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    });
    // Initialize api with a mock getState
    initializeApi(() => ({}) as any);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('calls fetch with the provided endpoint', async () => {
    fetchMock.mockResolvedValue(makeMockResponse({ data: 'ok' }));
    await fetchWithAuth('/api/test');
    expect(fetchMock).toHaveBeenCalledWith('/api/test', expect.any(Object));
  });

  it('returns the parsed JSON response', async () => {
    fetchMock.mockResolvedValue(makeMockResponse({ result: 42 }));
    const data = await fetchWithAuth('/api/test');
    expect(data).toEqual({ result: 42 });
  });

  it('merges Authorization header when token exists in localStorage', async () => {
    (globalThis.localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue('test-token');
    fetchMock.mockResolvedValue(makeMockResponse({}));
    await fetchWithAuth('/api/endpoint');
    const [, options] = fetchMock.mock.calls[0];
    expect(options.headers['Authorization']).toBe('test-token');
  });

  it('does not include Authorization header when no token', async () => {
    fetchMock.mockResolvedValue(makeMockResponse({}));
    await fetchWithAuth('/api/endpoint');
    const [, options] = fetchMock.mock.calls[0];
    expect(options.headers).not.toHaveProperty('Authorization');
  });

  it('includes Content-Type when options.body is set', async () => {
    fetchMock.mockResolvedValue(makeMockResponse({}));
    await fetchWithAuth('/api/endpoint', { body: JSON.stringify({ x: 1 }) });
    const [, options] = fetchMock.mock.calls[0];
    expect(options.headers['Content-Type']).toBe('application/json');
  });

  it('does not include Content-Type when options.body is not set', async () => {
    fetchMock.mockResolvedValue(makeMockResponse({}));
    await fetchWithAuth('/api/endpoint');
    const [, options] = fetchMock.mock.calls[0];
    expect(options.headers).not.toHaveProperty('Content-Type');
  });

  it('merges caller-supplied headers with auth headers', async () => {
    fetchMock.mockResolvedValue(makeMockResponse({}));
    // eslint-disable-next-line @typescript-eslint/naming-convention
    await fetchWithAuth('/api/endpoint', { headers: { 'X-Custom': 'value' } });
    const [, options] = fetchMock.mock.calls[0];
    expect(options.headers['X-Custom']).toBe('value');
  });

  it('passes method and body from options to fetch', async () => {
    fetchMock.mockResolvedValue(makeMockResponse({}));
    await fetchWithAuth('/api/endpoint', { method: 'POST', body: '{"a":1}' });
    const [, options] = fetchMock.mock.calls[0];
    expect(options.method).toBe('POST');
    expect(options.body).toBe('{"a":1}');
  });

  it('throws when the response is not ok', async () => {
    fetchMock.mockResolvedValue(makeMockResponse({}, false, 404));
    await expect(fetchWithAuth('/api/missing')).rejects.toThrow('HTTP error! status: 404');
  });

  it('throws with the correct status code in the error message', async () => {
    fetchMock.mockResolvedValue(makeMockResponse({}, false, 500));
    await expect(fetchWithAuth('/api/broken')).rejects.toThrow('HTTP error! status: 500');
  });
});

describe('api methods', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn().mockResolvedValue(makeMockResponse({ ok: true }));
    vi.stubGlobal('fetch', fetchMock);
    vi.stubGlobal('localStorage', {
      getItem: vi.fn().mockReturnValue(null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    });
    initializeApi(() => ({}) as any);
    mockSelectSelectedSimulation.mockReturnValue(null);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('api.get', () => {
    it('calls fetch with the endpoint when no simulation is selected', async () => {
      await api.get('/api/accounts');
      expect(fetchMock).toHaveBeenCalledWith('/api/accounts', expect.any(Object));
    });

    it('appends simulation query param with ? when endpoint has no query string', async () => {
      mockSelectSelectedSimulation.mockReturnValue({ name: 'base', selected: true });
      await api.get('/api/accounts');
      const [url] = fetchMock.mock.calls[0];
      expect(url).toBe('/api/accounts?simulation=base');
    });

    it('appends simulation query param with & when endpoint already has query string', async () => {
      mockSelectSelectedSimulation.mockReturnValue({ name: 'base', selected: true });
      await api.get('/api/accounts?foo=bar');
      const [url] = fetchMock.mock.calls[0];
      expect(url).toBe('/api/accounts?foo=bar&simulation=base');
    });

    it('uses GET method (default fetch behavior, no method override)', async () => {
      await api.get('/api/accounts');
      const [, options] = fetchMock.mock.calls[0];
      // GET is the default; method should either be absent or 'GET'
      expect(['GET', undefined].includes(options.method)).toBe(true);
    });
  });

  describe('api.post', () => {
    it('calls fetch with POST method', async () => {
      await api.post('/api/accounts', { name: 'Checking' });
      const [, options] = fetchMock.mock.calls[0];
      expect(options.method).toBe('POST');
    });

    it('serializes the data as JSON body', async () => {
      await api.post('/api/accounts', { name: 'Checking' });
      const [, options] = fetchMock.mock.calls[0];
      expect(options.body).toBe(JSON.stringify({ name: 'Checking' }));
    });

    it('appends simulation query param when a simulation is selected', async () => {
      mockSelectSelectedSimulation.mockReturnValue({ name: 'retirement', selected: true });
      await api.post('/api/accounts', {});
      const [url] = fetchMock.mock.calls[0];
      expect(url).toBe('/api/accounts?simulation=retirement');
    });

    it('sends no body when data is not provided', async () => {
      await api.post('/api/accounts');
      const [, options] = fetchMock.mock.calls[0];
      expect(options.body).toBeUndefined();
    });
  });

  describe('api.put', () => {
    it('calls fetch with PUT method', async () => {
      await api.put('/api/accounts/1', { name: 'Updated' });
      const [, options] = fetchMock.mock.calls[0];
      expect(options.method).toBe('PUT');
    });

    it('serializes the data as JSON body', async () => {
      await api.put('/api/accounts/1', { name: 'Updated' });
      const [, options] = fetchMock.mock.calls[0];
      expect(options.body).toBe(JSON.stringify({ name: 'Updated' }));
    });

    it('appends simulation query param when a simulation is selected', async () => {
      mockSelectSelectedSimulation.mockReturnValue({ name: 'alt', selected: true });
      await api.put('/api/accounts/1', {});
      const [url] = fetchMock.mock.calls[0];
      expect(url).toBe('/api/accounts/1?simulation=alt');
    });

    it('sends no body when data is not provided', async () => {
      await api.put('/api/accounts/1');
      const [, options] = fetchMock.mock.calls[0];
      expect(options.body).toBeUndefined();
    });
  });

  describe('api.delete', () => {
    it('calls fetch with DELETE method', async () => {
      await api.delete('/api/accounts/1');
      const [, options] = fetchMock.mock.calls[0];
      expect(options.method).toBe('DELETE');
    });

    it('appends simulation query param when a simulation is selected', async () => {
      mockSelectSelectedSimulation.mockReturnValue({ name: 'base', selected: true });
      await api.delete('/api/accounts/1');
      const [url] = fetchMock.mock.calls[0];
      expect(url).toBe('/api/accounts/1?simulation=base');
    });

    it('serializes the data as JSON body when data is provided', async () => {
      await api.delete('/api/accounts/1', { reason: 'closed' });
      const [, options] = fetchMock.mock.calls[0];
      expect(options.body).toBe(JSON.stringify({ reason: 'closed' }));
    });

    it('sends no body when data is not provided', async () => {
      await api.delete('/api/accounts/1');
      const [, options] = fetchMock.mock.calls[0];
      expect(options.body).toBeUndefined();
    });
  });
});
