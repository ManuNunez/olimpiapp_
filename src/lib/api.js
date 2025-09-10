const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

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

export function get(endpoint) {
  return apiRequest(endpoint, { method: 'GET' });
}

export function post(endpoint, data = {}) {
  return apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export function put(endpoint, data = {}) {
  return apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export function del(endpoint) {
  return apiRequest(endpoint, { method: 'DELETE' });
}

export const ROLES = {
  STUDENT: 2,
  TEACHER: 3,
};

export const auth = {
  login: async (credentials) => {
    const response = await post('/login', credentials);
    if (response.access_token) {
      localStorage.setItem('auth_token', response.access_token);
    }
    return response;
  },

  register: async (userData) => {
    const response = await post('/register', userData);
    if (response.access_token) {
      localStorage.setItem('auth_token', response.access_token);
    }
    return response;
  },

  logout: async () => {
    await post('/logout');
    localStorage.removeItem('auth_token');
  },

  isLoggedIn: () => {
    return !!localStorage.getItem('auth_token');
  },

  getToken: () => {
    return localStorage.getItem('auth_token');
  },

  me: async () => {
    return await get('/me');
  },

  updateProfile: async (userData) => {
    return await put('/me', userData);
  },

  getUserRoles: async (userId) => {
    try {
      return await get(`/users/${userId}/roles`);
    } catch (error) {
      console.error('Error obteniendo roles del usuario:', error);
      throw error;
    }
  },

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

  checkUserHasRoleByParams: async (userId, roleId) => {
    try {
      return await get(`/users/${userId}/roles/${roleId}/check`);
    } catch (error) {
      console.error('Error verificando rol del usuario:', error);
      throw error;
    }
  },

  currentUserHasRole: async (roleId) => {
    try {
      const userData = await auth.me();
      return await auth.checkUserHasRole(userData.id, roleId);
    } catch (error) {
      console.error('Error verificando rol del usuario actual:', error);
      return { success: false, has_role: false };
    }
  },

  isCurrentUserStudent: async () => {
    try {
      const result = await auth.currentUserHasRole(ROLES.STUDENT);
      return result.success && result.has_role;
    } catch (error) {
      console.error('Error verificando si el usuario es estudiante:', error);
      return false;
    }
  },

  isCurrentUserTeacher: async () => {
    try {
      const result = await auth.currentUserHasRole(ROLES.TEACHER);
      return result.success && result.has_role;
    } catch (error) {
      console.error('Error verificando si el usuario es maestro:', error);
      return false;
    }
  },

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

  ROLES
};
