/**
 * Configuración de la API
 */

// URL base de la API
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Endpoints
export const API_ENDPOINTS = {
  // Auth
  login: '/auth/login',
  register: '/auth/register',
  me: '/auth/me',

  // Cursos
  cursos: '/cursos',
  curso: (id) => `/cursos/${id}`,
  estadisticas: '/cursos/estadisticas',

  // Health
  health: '/health'
}

/**
 * Headers por defecto para requests
 */
export const getHeaders = (includeAuth = false) => {
  const headers = {
    'Content-Type': 'application/json'
  }

  if (includeAuth) {
    const token = localStorage.getItem('auth_token')
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }

  return headers
}

/**
 * Manejo de errores de API
 */
export const handleApiError = (error) => {
  if (error.response) {
    // Error de respuesta del servidor
    return {
      message: error.response.data?.message || 'Error en la solicitud',
      status: error.response.status,
      data: error.response.data
    }
  } else if (error.request) {
    // Error de red (no hay respuesta)
    return {
      message: 'No se pudo conectar con el servidor. Verifica tu conexión.',
      status: 0,
      data: null
    }
  } else {
    // Error en la configuración de la solicitud
    return {
      message: error.message || 'Error desconocido',
      status: -1,
      data: null
    }
  }
}

export default {
  API_BASE_URL,
  API_ENDPOINTS,
  getHeaders,
  handleApiError
}
