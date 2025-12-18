import db from '../config/database.js'

/**
 * Obtener todos los cursos con filtros opcionales
 */
export const getCursos = (req, res) => {
  try {
    const { vp, gerencia, estado, año } = req.query

    let query = 'SELECT * FROM cursos WHERE 1=1'
    const params = []

    if (vp) {
      query += ' AND vp = ?'
      params.push(vp)
    }

    if (gerencia) {
      query += ' AND gerencia = ?'
      params.push(gerencia)
    }

    if (estado) {
      query += ' AND estado = ?'
      params.push(estado)
    }

    if (año) {
      query += ' AND año = ?'
      params.push(parseInt(año))
    }

    query += ' ORDER BY nombre'

    const cursos = db.prepare(query).all(...params)

    res.json({
      success: true,
      count: cursos.length,
      data: cursos
    })
  } catch (error) {
    console.error('Error obteniendo cursos:', error)
    res.status(500).json({
      success: false,
      message: 'Error al obtener cursos'
    })
  }
}

/**
 * Obtener un curso por ID
 */
export const getCursoById = (req, res) => {
  try {
    const { id } = req.params

    const curso = db.prepare('SELECT * FROM cursos WHERE id = ?').get(id)

    if (!curso) {
      return res.status(404).json({
        success: false,
        message: 'Curso no encontrado'
      })
    }

    res.json({
      success: true,
      data: curso
    })
  } catch (error) {
    console.error('Error obteniendo curso:', error)
    res.status(500).json({
      success: false,
      message: 'Error al obtener curso'
    })
  }
}

/**
 * Crear nuevo curso
 */
export const createCurso = (req, res) => {
  try {
    const {
      id, año, id_gerencia, estado, lider_proceso, usuario_responsable,
      responsable_otic, observaciones, vp, gerencia, tipo_plan, subtipo,
      nombre, objetivo, horas, tipo_cargo, dirigido_a, valor_persona,
      participacion_real, otec_sugerido, modalidad, plan_emergente,
      interno_externo, abierto_cerrado, modulo_planificador, mes_inicio,
      detalle_ejecucion, participantes_enero, participantes_febrero,
      participantes_marzo, participantes_abril, participantes_mayo,
      participantes_junio, participantes_julio, participantes_agosto,
      participantes_septiembre, participantes_octubre, participantes_noviembre,
      participantes_diciembre
    } = req.body

    // Validaciones
    if (!id || !nombre) {
      return res.status(400).json({
        success: false,
        message: 'ID y nombre son requeridos'
      })
    }

    // Verificar si el curso ya existe
    const existingCurso = db.prepare('SELECT id FROM cursos WHERE id = ?').get(id)

    if (existingCurso) {
      return res.status(409).json({
        success: false,
        message: 'Ya existe un curso con ese ID'
      })
    }

    // Insertar curso
    const result = db.prepare(`
      INSERT INTO cursos (
        id, año, id_gerencia, estado, lider_proceso, usuario_responsable,
        responsable_otic, observaciones, vp, gerencia, tipo_plan, subtipo,
        nombre, objetivo, horas, tipo_cargo, dirigido_a, valor_persona,
        participacion_real, otec_sugerido, modalidad, plan_emergente,
        interno_externo, abierto_cerrado, modulo_planificador, mes_inicio,
        detalle_ejecucion, participantes_enero, participantes_febrero,
        participantes_marzo, participantes_abril, participantes_mayo,
        participantes_junio, participantes_julio, participantes_agosto,
        participantes_septiembre, participantes_octubre, participantes_noviembre,
        participantes_diciembre
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, año, id_gerencia, estado, lider_proceso, usuario_responsable,
      responsable_otic, observaciones, vp, gerencia, tipo_plan, subtipo,
      nombre, objetivo, horas, tipo_cargo, dirigido_a, valor_persona,
      participacion_real, otec_sugerido, modalidad, plan_emergente,
      interno_externo, abierto_cerrado, modulo_planificador, mes_inicio,
      detalle_ejecucion, participantes_enero || 0, participantes_febrero || 0,
      participantes_marzo || 0, participantes_abril || 0, participantes_mayo || 0,
      participantes_junio || 0, participantes_julio || 0, participantes_agosto || 0,
      participantes_septiembre || 0, participantes_octubre || 0, participantes_noviembre || 0,
      participantes_diciembre || 0
    )

    const newCurso = db.prepare('SELECT * FROM cursos WHERE id = ?').get(id)

    res.status(201).json({
      success: true,
      message: 'Curso creado exitosamente',
      data: newCurso
    })
  } catch (error) {
    console.error('Error creando curso:', error)
    res.status(500).json({
      success: false,
      message: 'Error al crear curso'
    })
  }
}

/**
 * Actualizar curso existente
 */
export const updateCurso = (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body

    // Verificar que el curso existe
    const existingCurso = db.prepare('SELECT * FROM cursos WHERE id = ?').get(id)

    if (!existingCurso) {
      return res.status(404).json({
        success: false,
        message: 'Curso no encontrado'
      })
    }

    // Construir query dinámica de actualización
    const allowedFields = [
      'año', 'id_gerencia', 'estado', 'lider_proceso', 'usuario_responsable',
      'responsable_otic', 'observaciones', 'vp', 'gerencia', 'tipo_plan',
      'subtipo', 'nombre', 'objetivo', 'horas', 'tipo_cargo', 'dirigido_a',
      'valor_persona', 'participacion_real', 'otec_sugerido', 'modalidad',
      'plan_emergente', 'interno_externo', 'abierto_cerrado', 'modulo_planificador',
      'mes_inicio', 'detalle_ejecucion', 'participantes_enero', 'participantes_febrero',
      'participantes_marzo', 'participantes_abril', 'participantes_mayo',
      'participantes_junio', 'participantes_julio', 'participantes_agosto',
      'participantes_septiembre', 'participantes_octubre', 'participantes_noviembre',
      'participantes_diciembre'
    ]

    const setClause = []
    const params = []

    for (const field of allowedFields) {
      if (updates.hasOwnProperty(field)) {
        setClause.push(`${field} = ?`)
        params.push(updates[field])
      }
    }

    if (setClause.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No hay campos para actualizar'
      })
    }

    setClause.push('updated_at = CURRENT_TIMESTAMP')

    const query = `UPDATE cursos SET ${setClause.join(', ')} WHERE id = ?`
    params.push(id)

    db.prepare(query).run(...params)

    const updatedCurso = db.prepare('SELECT * FROM cursos WHERE id = ?').get(id)

    res.json({
      success: true,
      message: 'Curso actualizado exitosamente',
      data: updatedCurso
    })
  } catch (error) {
    console.error('Error actualizando curso:', error)
    res.status(500).json({
      success: false,
      message: 'Error al actualizar curso'
    })
  }
}

/**
 * Eliminar curso
 */
export const deleteCurso = (req, res) => {
  try {
    const { id } = req.params

    // Verificar que el curso existe
    const existingCurso = db.prepare('SELECT * FROM cursos WHERE id = ?').get(id)

    if (!existingCurso) {
      return res.status(404).json({
        success: false,
        message: 'Curso no encontrado'
      })
    }

    db.prepare('DELETE FROM cursos WHERE id = ?').run(id)

    res.json({
      success: true,
      message: 'Curso eliminado exitosamente'
    })
  } catch (error) {
    console.error('Error eliminando curso:', error)
    res.status(500).json({
      success: false,
      message: 'Error al eliminar curso'
    })
  }
}

/**
 * Obtener estadísticas de cursos
 */
export const getEstadisticas = (req, res) => {
  try {
    const stats = {
      total: db.prepare('SELECT COUNT(*) as count FROM cursos').get().count,
      porEstado: db.prepare(`
        SELECT estado, COUNT(*) as count
        FROM cursos
        GROUP BY estado
      `).all(),
      porVP: db.prepare(`
        SELECT vp, COUNT(*) as count
        FROM cursos
        GROUP BY vp
        ORDER BY count DESC
      `).all(),
      porGerencia: db.prepare(`
        SELECT gerencia, COUNT(*) as count
        FROM cursos
        GROUP BY gerencia
        ORDER BY count DESC
        LIMIT 10
      `).all(),
      totalHoras: db.prepare('SELECT SUM(horas) as total FROM cursos').get().total || 0,
      totalParticipantes: db.prepare(`
        SELECT SUM(
          participantes_enero + participantes_febrero + participantes_marzo +
          participantes_abril + participantes_mayo + participantes_junio +
          participantes_julio + participantes_agosto + participantes_septiembre +
          participantes_octubre + participantes_noviembre + participantes_diciembre
        ) as total FROM cursos
      `).get().total || 0
    }

    res.json({
      success: true,
      data: stats
    })
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error)
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas'
    })
  }
}
