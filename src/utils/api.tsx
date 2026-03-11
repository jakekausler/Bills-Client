import type { RootState } from '../store';
import { selectSelectedSimulation } from '../features/simulations/select';

const getAuthToken = () => {
  return localStorage.getItem('token');
};

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
export const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();

  const response = await fetch(`${endpoint}`, {
    ...options,
    headers: {
      ...getHeaders(token, !!options.body),
      ...(options.headers || {}),
    },
  });

  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.reload();
    throw new Error('Authentication expired');
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Example usage for different HTTP methods
export const api = {
  get: (endpoint: string) => {
    const simulation = getSimulation();
    return fetchWithAuth(
      endpoint +
        (simulation ? `${endpoint.includes('?') ? '&' : '?'}simulation=${simulation}` : ''),
    );
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  post: (endpoint: string, data?: any) => {
    const simulation = getSimulation();
    return fetchWithAuth(
      endpoint +
        (simulation ? `${endpoint.includes('?') ? '&' : '?'}simulation=${simulation}` : ''),
      {
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
      },
    );
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  put: (endpoint: string, data?: any) => {
    const simulation = getSimulation();
    return fetchWithAuth(
      endpoint +
        (simulation ? `${endpoint.includes('?') ? '&' : '?'}simulation=${simulation}` : ''),
      {
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
      },
    );
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete: (endpoint: string, data?: any) => {
    const simulation = getSimulation();
    return fetchWithAuth(
      endpoint +
        (simulation ? `${endpoint.includes('?') ? '&' : '?'}simulation=${simulation}` : ''),
      {
        method: 'DELETE',
        body: data ? JSON.stringify(data) : undefined,
      },
    );
  },
};
