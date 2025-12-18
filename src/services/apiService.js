import { API_BASE_URL, API_ENDPOINTS, getHeaders, handleApiError } from '../config/api.js'

/**
 * Servicio genérico para hacer requests a la API
 */
class ApiService {
  /**
   * GET request
   */
  async get(endpoint, params = {}, requireAuth = false) {
    try {
      const url = new URL(`${API_BASE_URL}${endpoint}`)

      // Añadir query params si existen
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
          url.searchParams.append(key, params[key])
        }
      })

      const response = await fetch(url, {
        method: 'GET',
        headers: getHeaders(requireAuth)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error en la solicitud')
      }

      return data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  /**
   * POST request
   */
  async post(endpoint, body = {}, requireAuth = false) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: getHeaders(requireAuth),
        body: JSON.stringify(body)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error en la solicitud')
      }

      return data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  /**
   * PUT request
   */
  async put(endpoint, body = {}, requireAuth = true) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: getHeaders(requireAuth),
        body: JSON.stringify(body)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error en la solicitud')
      }

      return data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  /**
   * DELETE request
   */
  async delete(endpoint, requireAuth = true) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: getHeaders(requireAuth)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error en la solicitud')
      }

      return data
    } catch (error) {
      throw handleApiError(error)
    }
  }
}

// Exportar instancia única
export const apiService = new ApiService()

/**
 * Servicio específico para Cursos
 */
export const cursosService = {
  /**
   * Obtener todos los cursos con filtros opcionales
   */
  async getCursos(filtros = {}) {
    return apiService.get(API_ENDPOINTS.cursos, filtros, false)
  },

  /**
   * Obtener un curso por ID
   */
  async getCurso(id) {
    return apiService.get(API_ENDPOINTS.curso(id), {}, false)
  },

  /**
   * Crear nuevo curso
   */
  async createCurso(curso) {
    return apiService.post(API_ENDPOINTS.cursos, curso, true)
  },

  /**
   * Actualizar curso
   */
  async updateCurso(id, updates) {
    return apiService.put(API_ENDPOINTS.curso(id), updates, true)
  },

  /**
   * Eliminar curso
   */
  async deleteCurso(id) {
    return apiService.delete(API_ENDPOINTS.curso(id), true)
  },

  /**
   * Obtener estadísticas
   */
  async getEstadisticas() {
    return apiService.get(API_ENDPOINTS.estadisticas, {}, false)
  }
}

/**
 * Servicio específico para Autenticación
 */
export const authService = {
  /**
   * Login
   */
  async login(email, password) {
    const response = await apiService.post(API_ENDPOINTS.login, { email, password }, false)

    // Guardar token en localStorage
    if (response.success && response.data.token) {
      localStorage.setItem('auth_token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }

    return response
  },

  /**
   * Register
   */
  async register(email, password, nombre) {
    return apiService.post(API_ENDPOINTS.register, { email, password, nombre }, false)
  },

  /**
   * Get current user
   */
  async getCurrentUser() {
    return apiService.get(API_ENDPOINTS.me, {}, true)
  },

  /**
   * Logout
   */
  logout() {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!localStorage.getItem('auth_token')
  },

  /**
   * Get current user from localStorage
   */
  getUser() {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  }
}

export default apiService
