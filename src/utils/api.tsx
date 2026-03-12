import type { RootState } from '../store';
import { selectSelectedSimulation } from '../features/simulations/select';

const getAuthToken = () => {
  return localStorage.getItem('token');
};

let isReloading = false;

// Dependency injection: Store getState function is set by initializeApi
let _getState: (() => RootState) | null = null;

export function initializeApi(getState: () => RootState) {
  _getState = getState;
}

function getSimulation(): string {
  if (!_getState) {
    throw new Error('API not initialized. Call initializeApi(store.getState) first.');
  }
  const selectedSimulation = selectSelectedSimulation(_getState());
  return selectedSimulation ? selectedSimulation.name : '';
}

// Helper function to construct endpoint with simulation parameter
function withSimulation(endpoint: string): string {
  const simulation = getSimulation();
  if (!simulation) return endpoint;
  const sep = endpoint.includes('?') ? '&' : '?';
  return `${endpoint}${sep}simulation=${encodeURIComponent(simulation)}`;
}

// Helper function to get headers with auth token
export const getHeaders = (token?: string | null, hasBody?: boolean) => {
  const headers: Record<string, string> = {};
  if (hasBody) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `${token}`;
  }

  return headers;
};

// Generic fetch wrapper that adds auth headers
export const fetchWithAuth = async <T = any>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const token = getAuthToken();

  const response = await fetch(`${endpoint}`, {
    ...options,
    headers: {
      ...getHeaders(token, !!options.body),
      ...(options.headers || {}),
    },
  });

  if (response.status === 401) {
    if (!isReloading) {
      isReloading = true;
      localStorage.removeItem('token');
      window.location.reload();
    }
    return new Promise(() => {}); // Never resolves, prevents downstream handlers
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  if (response.status === 204) return null as T;
  return response.json() as Promise<T>;
};

// Example usage for different HTTP methods
export const api = {
  get: <T = any>(endpoint: string) => {
    return fetchWithAuth<T>(withSimulation(endpoint));
  },

  post: <T = any>(endpoint: string, data?: unknown) => {
    return fetchWithAuth<T>(withSimulation(endpoint), {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  put: <T = any>(endpoint: string, data?: unknown) => {
    return fetchWithAuth<T>(withSimulation(endpoint), {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  delete: <T = any>(endpoint: string, data?: unknown) => {
    return fetchWithAuth<T>(withSimulation(endpoint), {
      method: 'DELETE',
      body: data ? JSON.stringify(data) : undefined,
    });
  },
};
