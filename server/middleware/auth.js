import jwt from 'jsonwebtoken'
import { authConfig } from '../config/auth.js'

/**
 * Middleware para verificar JWT token
 */
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Acceso denegado. Token no proporcionado.'
    })
  }

  try {
    const decoded = jwt.verify(token, authConfig.jwtSecret)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Token inválido o expirado'
    })
  }
}

/**
 * Middleware para verificar rol de administrador
 */
export const requireAdmin = (req, res, next) => {
  if (req.user.rol !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requiere rol de administrador.'
    })
  }
  next()
}

/**
 * Middleware opcional de autenticación (no falla si no hay token)
 */
export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token) {
    try {
      const decoded = jwt.verify(token, authConfig.jwtSecret)
      req.user = decoded
    } catch (error) {
      // Token inválido, pero continuamos sin autenticación
      req.user = null
    }
  }

  next()
}
