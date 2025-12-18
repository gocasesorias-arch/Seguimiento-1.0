import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/apiService'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('auth_token')
      const savedUser = localStorage.getItem('user')

      if (token && savedUser) {
        setUser(JSON.parse(savedUser))
        setIsAuthenticated(true)
      } else {
        setUser(null)
        setIsAuthenticated(false)
      }

      setLoading(false)
    }

    checkAuth()
  }, [])

  /**
   * Login
   */
  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password)

      if (response.success) {
        setUser(response.data.user)
        setIsAuthenticated(true)
        return { success: true, user: response.data.user }
      }

      return { success: false, message: response.message }
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error al iniciar sesión'
      }
    }
  }

  /**
   * Register
   */
  const register = async (email, password, nombre) => {
    try {
      const response = await authService.register(email, password, nombre)
      return { success: response.success, message: response.message }
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error al registrar usuario'
      }
    }
  }

  /**
   * Logout
   */
  const logout = () => {
    authService.logout()
    setUser(null)
    setIsAuthenticated(false)
  }

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
