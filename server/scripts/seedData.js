import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import db, { initDatabase } from '../config/database.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Script para importar datos desde cursos.json a la base de datos
 */
async function seedData() {
  console.log('🌱 Iniciando seed de datos...')

  try {
    // Inicializar base de datos
    await initDatabase()

    // Leer archivo cursos.json
    const cursosPath = path.resolve(__dirname, '../../cursos.json')
    const cursosData = JSON.parse(fs.readFileSync(cursosPath, 'utf-8'))

    console.log(`📊 Archivo leído: ${cursosData.length} registros encontrados`)

    // Saltar primera fila (headers)
    const cursos = cursosData.slice(1)

    // Preparar statement de inserción
    const insertStmt = db.prepare(`
      INSERT OR REPLACE INTO cursos (
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
    `)

    // Iniciar transacción para mejor performance
    const insertMany = db.transaction((cursos) => {
      let insertados = 0
      let errores = 0

      for (const cursoRaw of cursos) {
        try {
          insertStmt.run(
            cursoRaw.Column1 || '',
            parseInt(cursoRaw.Column2) || null,
            cursoRaw.Column3 || null,
            cursoRaw.Column4 || null,
            cursoRaw.Column5 || null,
            cursoRaw.Column6 || null,
            cursoRaw.Column7 || null,
            cursoRaw.Column8 || null,
            cursoRaw.Column9 || null,
            cursoRaw.Column10 || null,
            cursoRaw.Column11 || null,
            cursoRaw.Column12 || null,
            cursoRaw.Column13 || 'Sin nombre',
            cursoRaw.Column14 || null,
            parseInt(cursoRaw.Column15) || null,
            cursoRaw.Column16 || null,
            cursoRaw.Column17 || null,
            parseInt(cursoRaw['18348']) || null,
            parseInt(cursoRaw.Column19) || null,
            cursoRaw.Column20 || null,
            cursoRaw.Column21 || null,
            cursoRaw.Column22 || null,
            cursoRaw.Column23 || null,
            cursoRaw.Column24 || null,
            cursoRaw.Column25 || null,
            parseInt(cursoRaw['0']) || null,
            cursoRaw.Column27 || null,
            parseInt(cursoRaw['139']) || 0,
            parseInt(cursoRaw['182']) || 0,
            parseInt(cursoRaw['2663']) || 0,
            parseInt(cursoRaw['1928']) || 0,
            parseInt(cursoRaw['2247']) || 0,
            parseInt(cursoRaw['2494']) || 0,
            parseInt(cursoRaw['2252']) || 0,
            parseInt(cursoRaw['2866']) || 0,
            parseInt(cursoRaw['1600']) || 0,
            parseInt(cursoRaw['1666']) || 0,
            parseInt(cursoRaw['261']) || 0,
            parseInt(cursoRaw['50']) || 0
          )
          insertados++
        } catch (err) {
          console.error(`Error insertando curso ${cursoRaw.Column1}:`, err.message)
          errores++
        }
      }

      return { insertados, errores }
    })

    // Ejecutar transacción
    const resultado = insertMany(cursos)

    console.log(`✅ Seed completado:`)
    console.log(`   - ${resultado.insertados} cursos insertados`)
    console.log(`   - ${resultado.errores} errores`)

    // Verificar total de registros
    const total = db.prepare('SELECT COUNT(*) as count FROM cursos').get()
    console.log(`📊 Total de cursos en base de datos: ${total.count}`)

    // Mostrar estadísticas
    const stats = db.prepare(`
      SELECT estado, COUNT(*) as count
      FROM cursos
      GROUP BY estado
    `).all()

    console.log('\n📈 Estadísticas por estado:')
    stats.forEach(stat => {
      console.log(`   - ${stat.estado}: ${stat.count}`)
    })

    console.log('\n✅ Seed finalizado exitosamente')
  } catch (error) {
    console.error('❌ Error en seed:', error)
    process.exit(1)
  }
}

// Ejecutar seed
seedData()
