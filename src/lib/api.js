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

// Constantes de roles
export const ROLES = {
  STUDENT: 2,
  TEACHER: 3,
  // Agrega otros roles según los tengas
};

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
  },

  /**
   * Update user profile
   * @param {Object} userData - User data to update
   * @returns {Promise}
   */
  updateProfile: async (userData) => {
    return await put('/me', userData);
  },

  // ====== FUNCIONES DE ROLES ======

  /**
   * Obtener roles de un usuario específico
   * @param {number} userId - ID del usuario
   * @returns {Promise}
   */
  getUserRoles: async (userId) => {
    try {
      return await get(`/users/${userId}/roles`);
    } catch (error) {
      console.error('Error obteniendo roles del usuario:', error);
      throw error;
    }
  },

  /**
   * Verificar si un usuario tiene un rol específico
   * @param {number} userId - ID del usuario
   * @param {number} roleId - ID del rol
   * @returns {Promise}
   */
  checkUserHasRole: async (userId, roleId) => {
    try {
      return await post('/users/check-role', {
        user_id: userId,
        role_id: roleId
      });
    } catch (error) {
      console.error('Error verificando rol del usuario:', error);
      throw error;
    }
  },

  /**
   * Verificar si un usuario tiene un rol específico (usando GET)
   * @param {number} userId - ID del usuario
   * @param {number} roleId - ID del rol
   * @returns {Promise}
   */
  checkUserHasRoleByParams: async (userId, roleId) => {
    try {
      return await get(`/users/${userId}/roles/${roleId}/check`);
    } catch (error) {
      console.error('Error verificando rol del usuario:', error);
      throw error;
    }
  },

  /**
   * Función helper para verificar si el usuario actual tiene un rol específico
   * @param {number} roleId - ID del rol a verificar
   * @returns {Promise}
   */
  currentUserHasRole: async (roleId) => {
    try {
      const userData = await auth.me();
      return await auth.checkUserHasRole(userData.id, roleId);
    } catch (error) {
      console.error('Error verificando rol del usuario actual:', error);
      return { success: false, has_role: false };
    }
  },

  /**
   * Función helper para verificar si el usuario actual es estudiante
   * @returns {Promise<boolean>}
   */
  isCurrentUserStudent: async () => {
    try {
      const result = await auth.currentUserHasRole(ROLES.STUDENT);
      return result.success && result.has_role;
    } catch (error) {
      console.error('Error verificando si el usuario es estudiante:', error);
      return false;
    }
  },

  /**
   * Función helper para verificar si el usuario actual es maestro
   * @returns {Promise<boolean>}
   */
  isCurrentUserTeacher: async () => {
    try {
      const result = await auth.currentUserHasRole(ROLES.TEACHER);
      return result.success && result.has_role;
    } catch (error) {
      console.error('Error verificando si el usuario es maestro:', error);
      return false;
    }
  },

  /**
   * Obtener múltiples verificaciones de roles de una vez
   * @param {number} userId - ID del usuario
   * @param {Array<number>} roleIds - Array de IDs de roles a verificar
   * @returns {Promise<Object>} Objeto con el resultado de cada rol
   */
  checkMultipleRoles: async (userId, roleIds = [ROLES.STUDENT, ROLES.TEACHER]) => {
    try {
      const roleChecks = await Promise.allSettled(
        roleIds.map(roleId => auth.checkUserHasRole(userId, roleId))
      );

      const results = {};
      roleChecks.forEach((result, index) => {
        const roleId = roleIds[index];
        if (result.status === 'fulfilled' && result.value.success) {
          results[roleId] = result.value.has_role;
        } else {
          results[roleId] = false;
        }
      });

      return {
        success: true,
        roles: results,
        isStudent: results[ROLES.STUDENT] || false,
        isTeacher: results[ROLES.TEACHER] || false
      };
    } catch (error) {
      console.error('Error verificando múltiples roles:', error);
      return {
        success: false,
        roles: {},
        isStudent: false,
        isTeacher: false
      };
    }
  },

  // ====== CONSTANTES PÚBLICAS ======
  ROLES
};