import db from '../config/database.js'

const COLUMN_ALIASES = {
  id: ['id', 'id powerbi', 'id_powerbi', 'codigo', 'código'],
  año: ['año', 'ano', 'anio', 'year'],
  id_gerencia: ['id_gerencia', 'id gerencia'],
  estado: ['estado', 'status'],
  lider_proceso: ['lider_proceso', 'líder_proceso', 'lider proceso'],
  usuario_responsable: ['usuario_responsable', 'usuario responsable', 'responsable'],
  responsable_otic: ['responsable_otic', 'responsable otic'],
  observaciones: ['observaciones', 'observacion', 'observación'],
  vp: ['vp', 'vicepresidencia'],
  gerencia: ['gerencia'],
  tipo_plan: ['tipo_plan', 'tipo plan'],
  subtipo: ['subtipo'],
  nombre: ['nombre', 'curso', 'nombre curso'],
  objetivo: ['objetivo'],
  horas: ['horas'],
  tipo_cargo: ['tipo_cargo', 'tipo cargo'],
  dirigido_a: ['dirigido_a', 'dirigido a'],
  valor_persona: ['valor_persona', 'valor persona'],
  participacion_real: ['participacion_real', 'participación_real', 'participacion real'],
  otec_sugerido: ['otec_sugerido', 'otec sugerido'],
  modalidad: ['modalidad'],
  plan_emergente: ['plan_emergente', 'plan emergente'],
  interno_externo: ['interno_externo', 'interno externo'],
  abierto_cerrado: ['abierto_cerrado', 'abierto cerrado'],
  modulo_planificador: ['modulo_planificador', 'módulo_planificador', 'modulo planificador'],
  mes_inicio: ['mes_inicio', 'mes inicio'],
  detalle_ejecucion: ['detalle_ejecucion', 'detalle ejecución', 'detalle ejecucion'],
  participantes_enero: ['participantes_enero', 'enero', 'ene'],
  participantes_febrero: ['participantes_febrero', 'febrero', 'feb'],
  participantes_marzo: ['participantes_marzo', 'marzo', 'mar'],
  participantes_abril: ['participantes_abril', 'abril', 'abr'],
  participantes_mayo: ['participantes_mayo', 'mayo', 'may'],
  participantes_junio: ['participantes_junio', 'junio', 'jun'],
  participantes_julio: ['participantes_julio', 'julio', 'jul'],
  participantes_agosto: ['participantes_agosto', 'agosto', 'ago'],
  participantes_septiembre: ['participantes_septiembre', 'septiembre', 'setiembre', 'sep'],
  participantes_octubre: ['participantes_octubre', 'octubre', 'oct'],
  participantes_noviembre: ['participantes_noviembre', 'noviembre', 'nov'],
  participantes_diciembre: ['participantes_diciembre', 'diciembre', 'dic']
}

const DB_COLUMNS = Object.keys(COLUMN_ALIASES)

const sanitizeHeader = (value) => String(value || '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, '_')
  .replace(/^_+|_+$/g, '')

const parseNumericField = (value) => {
  if (value === null || value === undefined || value === '') return 0
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0

  const normalized = String(value)
    .replace(/\./g, '')
    .replace(/,/g, '.')
    .trim()
  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : 0
}

const parseCsv = (csvText) => {
  const rows = []
  let current = ''
  let row = []
  let inQuotes = false

  for (let i = 0; i < csvText.length; i += 1) {
    const char = csvText[i]
    const nextChar = csvText[i + 1]

    if (char === '"' && inQuotes && nextChar === '"') {
      current += '"'
      i += 1
      continue
    }

    if (char === '"') {
      inQuotes = !inQuotes
      continue
    }

    if (char === ',' && !inQuotes) {
      row.push(current)
      current = ''
      continue
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') i += 1
      row.push(current)
      current = ''
      if (row.some(cell => String(cell).trim() !== '')) rows.push(row)
      row = []
      continue
    }

    current += char
  }

  if (current.length > 0 || row.length > 0) {
    row.push(current)
    if (row.some(cell => String(cell).trim() !== '')) rows.push(row)
  }

  if (rows.length === 0) return []

  const headers = rows[0].map(h => String(h || '').trim())
  return rows.slice(1).map(values => {
    const record = {}
    headers.forEach((header, index) => {
      record[header] = values[index] ?? ''
    })
    return record
  })
}

const mapRowsToCursos = (rows) => {
  if (!rows.length) return []

  const firstRowHeaders = Object.keys(rows[0] || {})
  const headerMap = {}

  for (const rawHeader of firstRowHeaders) {
    const normalizedHeader = sanitizeHeader(rawHeader)
    const dbColumn = DB_COLUMNS.find(column =>
      COLUMN_ALIASES[column].some(alias => sanitizeHeader(alias) === normalizedHeader)
    )

    if (dbColumn) {
      headerMap[dbColumn] = rawHeader
    }
  }

  return rows
    .map((row, index) => {
      const idValue = row[headerMap.id]
      const nombreValue = row[headerMap.nombre]
      const id = String(idValue || '').trim()
      const nombre = String(nombreValue || '').trim()

      if (!id || !nombre) return null

      return {
        id,
        año: parseNumericField(row[headerMap.año]),
        id_gerencia: String(row[headerMap.id_gerencia] || '').trim() || null,
        estado: String(row[headerMap.estado] || '').trim() || null,
        lider_proceso: String(row[headerMap.lider_proceso] || '').trim() || null,
        usuario_responsable: String(row[headerMap.usuario_responsable] || '').trim() || null,
        responsable_otic: String(row[headerMap.responsable_otic] || '').trim() || null,
        observaciones: String(row[headerMap.observaciones] || '').trim() || null,
        vp: String(row[headerMap.vp] || '').trim().toUpperCase() || null,
        gerencia: String(row[headerMap.gerencia] || '').trim() || null,
        tipo_plan: String(row[headerMap.tipo_plan] || '').trim() || null,
        subtipo: String(row[headerMap.subtipo] || '').trim() || null,
        nombre,
        objetivo: String(row[headerMap.objetivo] || '').trim() || null,
        horas: parseNumericField(row[headerMap.horas]),
        tipo_cargo: String(row[headerMap.tipo_cargo] || '').trim() || null,
        dirigido_a: String(row[headerMap.dirigido_a] || '').trim() || null,
        valor_persona: parseNumericField(row[headerMap.valor_persona]),
        participacion_real: parseNumericField(row[headerMap.participacion_real]),
        otec_sugerido: String(row[headerMap.otec_sugerido] || '').trim() || null,
        modalidad: String(row[headerMap.modalidad] || '').trim() || null,
        plan_emergente: String(row[headerMap.plan_emergente] || '').trim() || null,
        interno_externo: String(row[headerMap.interno_externo] || '').trim() || null,
        abierto_cerrado: String(row[headerMap.abierto_cerrado] || '').trim() || null,
        modulo_planificador: String(row[headerMap.modulo_planificador] || '').trim() || null,
        mes_inicio: parseNumericField(row[headerMap.mes_inicio]),
        detalle_ejecucion: String(row[headerMap.detalle_ejecucion] || '').trim() || null,
        participantes_enero: parseNumericField(row[headerMap.participantes_enero]),
        participantes_febrero: parseNumericField(row[headerMap.participantes_febrero]),
        participantes_marzo: parseNumericField(row[headerMap.participantes_marzo]),
        participantes_abril: parseNumericField(row[headerMap.participantes_abril]),
        participantes_mayo: parseNumericField(row[headerMap.participantes_mayo]),
        participantes_junio: parseNumericField(row[headerMap.participantes_junio]),
        participantes_julio: parseNumericField(row[headerMap.participantes_julio]),
        participantes_agosto: parseNumericField(row[headerMap.participantes_agosto]),
        participantes_septiembre: parseNumericField(row[headerMap.participantes_septiembre]),
        participantes_octubre: parseNumericField(row[headerMap.participantes_octubre]),
        participantes_noviembre: parseNumericField(row[headerMap.participantes_noviembre]),
        participantes_diciembre: parseNumericField(row[headerMap.participantes_diciembre]),
        _index: index + 2
      }
    })
    .filter(Boolean)
}

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

/**
 * Importar cursos desde archivo Excel alojado en SharePoint
 */
export const importarDesdeSharePoint = async (req, res) => {
  try {
    const { excelUrl } = req.body

    if (!excelUrl) {
      return res.status(400).json({
        success: false,
        message: 'Debes enviar la URL del archivo Excel (excelUrl)'
      })
    }

    const response = await fetch(excelUrl)
    if (!response.ok) {
      return res.status(400).json({
        success: false,
        message: `No se pudo descargar el Excel desde SharePoint (HTTP ${response.status})`
      })
    }

    const csvText = await response.text()
    const rows = parseCsv(csvText)
    const cursos = mapRowsToCursos(rows)

    if (!cursos.length) {
      return res.status(400).json({
        success: false,
        message: 'No se encontraron cursos válidos para importar (revisar columnas ID y nombre)'
      })
    }

    const insertSql = `
      INSERT INTO cursos (
        id, año, id_gerencia, estado, lider_proceso, usuario_responsable,
        responsable_otic, observaciones, vp, gerencia, tipo_plan, subtipo,
        nombre, objetivo, horas, tipo_cargo, dirigido_a, valor_persona,
        participacion_real, otec_sugerido, modalidad, plan_emergente, interno_externo,
        abierto_cerrado, modulo_planificador, mes_inicio, detalle_ejecucion,
        participantes_enero, participantes_febrero, participantes_marzo, participantes_abril,
        participantes_mayo, participantes_junio, participantes_julio, participantes_agosto,
        participantes_septiembre, participantes_octubre, participantes_noviembre,
        participantes_diciembre
      ) VALUES (
        @id, @año, @id_gerencia, @estado, @lider_proceso, @usuario_responsable,
        @responsable_otic, @observaciones, @vp, @gerencia, @tipo_plan, @subtipo,
        @nombre, @objetivo, @horas, @tipo_cargo, @dirigido_a, @valor_persona,
        @participacion_real, @otec_sugerido, @modalidad, @plan_emergente, @interno_externo,
        @abierto_cerrado, @modulo_planificador, @mes_inicio, @detalle_ejecucion,
        @participantes_enero, @participantes_febrero, @participantes_marzo, @participantes_abril,
        @participantes_mayo, @participantes_junio, @participantes_julio, @participantes_agosto,
        @participantes_septiembre, @participantes_octubre, @participantes_noviembre,
        @participantes_diciembre
      )
      ON CONFLICT(id) DO UPDATE SET
        año = excluded.año,
        id_gerencia = excluded.id_gerencia,
        estado = excluded.estado,
        lider_proceso = excluded.lider_proceso,
        usuario_responsable = excluded.usuario_responsable,
        responsable_otic = excluded.responsable_otic,
        observaciones = excluded.observaciones,
        vp = excluded.vp,
        gerencia = excluded.gerencia,
        tipo_plan = excluded.tipo_plan,
        subtipo = excluded.subtipo,
        nombre = excluded.nombre,
        objetivo = excluded.objetivo,
        horas = excluded.horas,
        tipo_cargo = excluded.tipo_cargo,
        dirigido_a = excluded.dirigido_a,
        valor_persona = excluded.valor_persona,
        participacion_real = excluded.participacion_real,
        otec_sugerido = excluded.otec_sugerido,
        modalidad = excluded.modalidad,
        plan_emergente = excluded.plan_emergente,
        interno_externo = excluded.interno_externo,
        abierto_cerrado = excluded.abierto_cerrado,
        modulo_planificador = excluded.modulo_planificador,
        mes_inicio = excluded.mes_inicio,
        detalle_ejecucion = excluded.detalle_ejecucion,
        participantes_enero = excluded.participantes_enero,
        participantes_febrero = excluded.participantes_febrero,
        participantes_marzo = excluded.participantes_marzo,
        participantes_abril = excluded.participantes_abril,
        participantes_mayo = excluded.participantes_mayo,
        participantes_junio = excluded.participantes_junio,
        participantes_julio = excluded.participantes_julio,
        participantes_agosto = excluded.participantes_agosto,
        participantes_septiembre = excluded.participantes_septiembre,
        participantes_octubre = excluded.participantes_octubre,
        participantes_noviembre = excluded.participantes_noviembre,
        participantes_diciembre = excluded.participantes_diciembre,
        updated_at = CURRENT_TIMESTAMP
    `

    const statement = db.prepare(insertSql)
    const importTransaction = db.transaction((items) => {
      for (const curso of items) {
        statement.run(curso)
      }
    })

    importTransaction(cursos)

    return res.json({
        success: true,
      message: 'Cursos importados correctamente desde SharePoint (CSV)',
      data: {
        imported: cursos.length
      }
    })
  } catch (error) {
    console.error('Error importando cursos desde SharePoint:', error)
    return res.status(500).json({
      success: false,
      message: 'Error al importar cursos desde SharePoint'
    })
  }
}
