import express from 'express'
import { register, login, getCurrentUser } from '../controllers/authController.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

/**
 * POST /api/auth/register
 * Registrar nuevo usuario
 */
router.post('/register', register)

/**
 * POST /api/auth/login
 * Iniciar sesión
 */
router.post('/login', login)

/**
 * GET /api/auth/me
 * Obtener información del usuario actual (requiere autenticación)
 */
router.get('/me', authenticateToken, getCurrentUser)

export default router
