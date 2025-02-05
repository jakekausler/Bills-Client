const getAuthToken = () => {
  return localStorage.getItem('token');
};

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

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Example usage for different HTTP methods
export const api = {
  get: (endpoint: string) => fetchWithAuth(endpoint),

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  post: (endpoint: string, data?: any) =>
    fetchWithAuth(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  put: (endpoint: string, data?: any) =>
    fetchWithAuth(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete: (endpoint: string, data?: any) =>
    fetchWithAuth(endpoint, {
      method: 'DELETE',
      body: data ? JSON.stringify(data) : undefined,
    }),
};
