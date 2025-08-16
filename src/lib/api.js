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
            throw new Error(`HTTP error! status: ${response.status}`);
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
    login: async (credentials) => {
        const response = await post('/auth/login', credentials);
        if (response.token) {
            localStorage.setItem('auth_token', response.token);
        }
        return response;
    },
    
    logout: () => {
        localStorage.removeItem('auth_token');
    },
    
    isLoggedIn: () => {
        return !!localStorage.getItem('auth_token');
    },
    
    getToken: () => {
        return localStorage.getItem('auth_token');
    }
};
