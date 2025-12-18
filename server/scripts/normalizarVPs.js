import db from '../config/database.js'

/**
 * Script para normalizar VPs a mayúsculas en la base de datos
 * Elimina duplicados como "VP Ejecutiva Operaciones" y "VP EJECUTIVA OPERACIONES"
 */
async function normalizarVPs() {
  console.log('🔧 Iniciando normalización de VPs...')

  try {
    // Obtener todos los cursos
    const cursos = db.prepare("SELECT id, vp FROM cursos WHERE vp IS NOT NULL AND vp != ''").all()

    console.log(`📊 Encontrados ${cursos.length} cursos con VP`)

    // Preparar statement de actualización
    const updateStmt = db.prepare('UPDATE cursos SET vp = ? WHERE id = ?')

    // Contar cambios
    let actualizados = 0
    let sinCambios = 0

    // Transacción para mejor performance
    const normalizarTodos = db.transaction((cursos) => {
      for (const curso of cursos) {
        const vpOriginal = curso.vp
        const vpNormalizada = vpOriginal.toUpperCase()

        if (vpOriginal !== vpNormalizada) {
          updateStmt.run(vpNormalizada, curso.id)
          actualizados++
          console.log(`  ✅ ${curso.id}: "${vpOriginal}" → "${vpNormalizada}"`)
        } else {
          sinCambios++
        }
      }
    })

    // Ejecutar normalización
    normalizarTodos(cursos)

    console.log('\n📈 Resumen:')
    console.log(`   - ${actualizados} cursos actualizados`)
    console.log(`   - ${sinCambios} cursos sin cambios`)

    // Verificar VPs únicas después de normalización
    const vpsUnicas = db.prepare("SELECT DISTINCT vp, COUNT(*) as count FROM cursos WHERE vp IS NOT NULL AND vp != '' GROUP BY vp ORDER BY count DESC").all()

    console.log('\n📊 VPs únicas en la base de datos:')
    vpsUnicas.forEach(vp => {
      console.log(`   - ${vp.vp}: ${vp.count} cursos`)
    })

    console.log('\n✅ Normalización completada exitosamente')
  } catch (error) {
    console.error('❌ Error en normalización:', error)
    process.exit(1)
  }
}

// Ejecutar script
normalizarVPs()
