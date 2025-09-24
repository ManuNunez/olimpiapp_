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

export function patch(endpoint, data = {}) {
  return apiRequest(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(data)
  });
}

export const ROLES = {
  STUDENT: 2,
  TEACHER: 3,
};

// Función para obtener el usuario actual del localStorage
function getCurrentUser() {
  try {
    const userString = localStorage.getItem('current_user');
    return userString ? JSON.parse(userString) : null;
  } catch (error) {
    console.error('Error parsing current user:', error);
    return null;
  }
}

// Función para guardar el usuario actual en localStorage
function setCurrentUser(user) {
  if (user) {
    localStorage.setItem('current_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('current_user');
  }
}

export const auth = {
  login: async (credentials) => {
    try {
      const response = await post('/login', credentials);
      if (response.access_token) {
        localStorage.setItem('auth_token', response.access_token);
        // Obtener y guardar los datos del usuario después del login
        try {
          const user = await get('/me');
          setCurrentUser(user);
        } catch (userError) {
          console.error('Error fetching user data after login:', userError);
        }
      }
      return response;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  },

  register: async (userData) => {
    const response = await post('/register', userData);
    if (response.access_token) {
      localStorage.setItem('auth_token', response.access_token);
      // Obtener y guardar los datos del usuario después del registro
      try {
        const user = await get('/me');
        setCurrentUser(user);
      } catch (userError) {
        console.error('Error fetching user data after register:', userError);
      }
    }
    return response;
  },

  logout: async () => {
    try {
      await post('/logout');
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('current_user');
      localStorage.removeItem('student_profile');
      setCurrentUser(null); // Limpiar el usuario actual
      
    }
  },

  isLoggedIn: () => {
    return !!localStorage.getItem('auth_token');
  },

  getToken: () => {
    return localStorage.getItem('auth_token');
  },

  getCurrentUser,

  me: async () => {
    try {
      const user = await get('/me');
      setCurrentUser(user); // Guardar el usuario actual
      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  },

  updateProfile: async (userData) => {
    try {
      const response = await put('/me', userData);
      // Actualizar el usuario guardado en localStorage
      const currentUser = getCurrentUser();
      if (currentUser && response) {
        // Si la respuesta tiene estructura { success: true, data: user }
        const updatedUserData = response.data || response;
        const updatedUser = { ...currentUser, ...updatedUserData };
        setCurrentUser(updatedUser);
        return updatedUserData;
      }
      return response.data || response;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  // Nuevas funciones para gestión de usuarios
  getUser: async (userId) => {
    try {
      const response = await get(`/users/${userId}`);
      return response.data || response; // Ajustar según la estructura de respuesta
    } catch (error) {
      console.error('Error getting user:', error);
      throw new Error('Error al obtener el usuario: ' + error.message);
    }
  },

  getUsers: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const endpoint = `/users${queryParams ? `?${queryParams}` : ''}`;
      const response = await get(endpoint);
      return response;
    } catch (error) {
      console.error('Error getting users:', error);
      throw new Error('Error al obtener los usuarios: ' + error.message);
    }
  },

  updateUser: async (userId, userData) => {
    try {
      const response = await put(`/users/${userId}`, userData);
      if (!response.success) {
        throw new Error(response.message || 'Error al actualizar el usuario');
      }
      return response;
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Error al actualizar el usuario: ' + error.message);
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await del(`/users/${userId}`);
      if (!response.success) {
        throw new Error(response.message || 'Error al desactivar el usuario');
      }
      return response;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('Error al desactivar el usuario: ' + error.message);
    }
  },

  restoreUser: async (userId) => {
    try {
      const response = await apiRequest(`/users/${userId}/restore`, {
        method: 'PATCH'
      });
      if (!response.success) {
        throw new Error(response.message || 'Error al reactivar el usuario');
      }
      return response;
    } catch (error) {
      console.error('Error restoring user:', error);
      throw new Error('Error al reactivar el usuario: ' + error.message);
    }
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