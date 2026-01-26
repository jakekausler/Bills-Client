import { selectSelectedSimulation } from '../features/simulations/select';
import { store } from '../store';
const getAuthToken = () => {
    return localStorage.getItem('token');
};
// Helper function to get headers with auth token
export const getHeaders = (token, hasBody) => {
    const headers = {};
    if (hasBody) {
        headers['Content-Type'] = 'application/json';
    }
    if (token) {
        headers['Authorization'] = `${token}`;
    }
    return headers;
};
// Generic fetch wrapper that adds auth headers
export const fetchWithAuth = async (endpoint, options = {}) => {
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
    get: (endpoint) => {
        const selectedSimulation = selectSelectedSimulation(store.getState());
        return fetchWithAuth(endpoint +
            (selectedSimulation ? `${endpoint.includes('?') ? '&' : '?'}simulation=${selectedSimulation.name}` : ''));
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    post: (endpoint, data) => {
        const selectedSimulation = selectSelectedSimulation(store.getState());
        return fetchWithAuth(endpoint +
            (selectedSimulation ? `${endpoint.includes('?') ? '&' : '?'}simulation=${selectedSimulation.name}` : ''), {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    put: (endpoint, data) => {
        const selectedSimulation = selectSelectedSimulation(store.getState());
        return fetchWithAuth(endpoint +
            (selectedSimulation ? `${endpoint.includes('?') ? '&' : '?'}simulation=${selectedSimulation.name}` : ''), {
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete: (endpoint, data) => {
        const selectedSimulation = selectSelectedSimulation(store.getState());
        return fetchWithAuth(endpoint +
            (selectedSimulation ? `${endpoint.includes('?') ? '&' : '?'}simulation=${selectedSimulation.name}` : ''), {
            method: 'DELETE',
            body: data ? JSON.stringify(data) : undefined,
        });
    },
};
