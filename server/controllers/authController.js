import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../config/database.js'
import { authConfig } from '../config/auth.js'

/**
 * Registro de nuevo usuario
 */
export const register = async (req, res) => {
  try {
    const { email, password, nombre, rol = 'usuario' } = req.body

    // Validaciones
    if (!email || !password || !nombre) {
      return res.status(400).json({
        success: false,
        message: 'Email, password y nombre son requeridos'
      })
    }

    // Verificar si el usuario ya existe
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email)

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'El email ya está registrado'
      })
    }

    // Hash del password
    const hashedPassword = await bcrypt.hash(password, authConfig.bcryptRounds)

    // Insertar usuario
    const result = db.prepare(`
      INSERT INTO users (email, password, nombre, rol)
      VALUES (?, ?, ?, ?)
    `).run(email, hashedPassword, nombre, rol)

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        id: result.lastInsertRowid,
        email,
        nombre,
        rol
      }
    })
  } catch (error) {
    console.error('Error en registro:', error)
    res.status(500).json({
      success: false,
      message: 'Error al registrar usuario'
    })
  }
}

/**
 * Login de usuario
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Validaciones
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y password son requeridos'
      })
    }

    // Buscar usuario
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email)

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      })
    }

    // Verificar password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      })
    }

    // Generar JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        rol: user.rol
      },
      authConfig.jwtSecret,
      { expiresIn: authConfig.jwtExpiresIn }
    )

    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          nombre: user.nombre,
          rol: user.rol
        }
      }
    })
  } catch (error) {
    console.error('Error en login:', error)
    res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión'
    })
  }
}

/**
 * Obtener información del usuario actual
 */
export const getCurrentUser = (req, res) => {
  try {
    const user = db.prepare(`
      SELECT id, email, nombre, rol, created_at
      FROM users
      WHERE id = ?
    `).get(req.user.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      })
    }

    res.json({
      success: true,
      data: user
    })
  } catch (error) {
    console.error('Error obteniendo usuario:', error)
    res.status(500).json({
      success: false,
      message: 'Error al obtener información del usuario'
    })
  }
}
