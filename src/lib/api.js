// API configuration for Laravel backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

/**
 * Generic API request function
 * @param {string} endpoint - API endpoint (without /api prefix)
 * @param {Object} options - Fetch options
 * @returns {Promise} Response data
 */
export async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...options.headers
        },
        ...options
    };

    // Add authentication token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`HTTP error! status: ${response.status}`, { cause: errorData });
        }
        
        return await response.json();
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

/**
 * GET request
 * @param {string} endpoint
 * @returns {Promise}
 */
export function get(endpoint) {
    return apiRequest(endpoint, { method: 'GET' });
}

/**
 * POST request
 * @param {string} endpoint
 * @param {Object} data
 * @returns {Promise}
 */
export function post(endpoint, data = {}) {
    return apiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(data)
    });
}

/**
 * PUT request
 * @param {string} endpoint
 * @param {Object} data
 * @returns {Promise}
 */
export function put(endpoint, data = {}) {
    return apiRequest(endpoint, {
        method: 'PUT',
        body: JSON.stringify(data)
    });
}

/**
 * DELETE request
 * @param {string} endpoint
 * @returns {Promise}
 */
export function del(endpoint) {
    return apiRequest(endpoint, { method: 'DELETE' });
}

/**
 * Authentication helpers
 */
export const auth = {
    /**
     * Login user
     * @param {Object} credentials - {email, password}
     * @returns {Promise}
     */
    login: async (credentials) => {
        const response = await post('/login', credentials);
        if (response.access_token) {
            localStorage.setItem('auth_token', response.access_token);
        }
        return response;
    },

    /**
     * Register new user
     * @param {Object} userData - User registration data
     * @returns {Promise}
     */
    register: async (userData) => {
        const response = await post('/register', userData);
        if (response.access_token) {
            localStorage.setItem('auth_token', response.access_token);
        }
        return response;
    },

    /**
     * Logout current user
     * @returns {Promise}
     */
    logout: async () => {
        await post('/logout');
        localStorage.removeItem('auth_token');
    },

    /**
     * Check if user is logged in
     * @returns {boolean}
     */
    isLoggedIn: () => {
        return !!localStorage.getItem('auth_token');
    },

    /**
     * Get current auth token
     * @returns {string|null}
     */
    getToken: () => {
        return localStorage.getItem('auth_token');
    },

    /**
     * Get current user info
     * @returns {Promise}
     */
    me: async () => {
        return await get('/me');
    }
};