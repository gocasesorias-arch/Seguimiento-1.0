import express from 'express'
import {
  getCursos,
  getCursoById,
  createCurso,
  updateCurso,
  deleteCurso,
  getEstadisticas,
  importarDesdeSharePoint
} from '../controllers/cursosController.js'
import { authenticateToken, requireAdmin, optionalAuth } from '../middleware/auth.js'

const router = express.Router()

/**
 * GET /api/cursos
 * Obtener todos los cursos (con filtros opcionales)
 * Query params: vp, gerencia, estado, año
 * Autenticación opcional
 */
router.get('/', optionalAuth, getCursos)

/**
 * GET /api/cursos/estadisticas
 * Obtener estadísticas generales
 */
router.get('/estadisticas', optionalAuth, getEstadisticas)

/**
 * GET /api/cursos/:id
 * Obtener un curso por ID
 */
router.get('/:id', optionalAuth, getCursoById)

/**
 * POST /api/cursos
 * Crear nuevo curso (requiere autenticación)
 */
router.post('/', authenticateToken, createCurso)

/**
 * PUT /api/cursos/:id
 * Actualizar curso (requiere autenticación)
 */
router.put('/:id', authenticateToken, updateCurso)

/**
 * DELETE /api/cursos/:id
 * Eliminar curso (requiere autenticación y rol admin)
 */
router.delete('/:id', authenticateToken, requireAdmin, deleteCurso)

/**
 * POST /api/cursos/importar-sharepoint
 * Importar cursos desde un Excel en SharePoint (requiere autenticación)
 */
router.post('/importar-sharepoint', authenticateToken, importarDesdeSharePoint)

export default router
