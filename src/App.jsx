import { useState, useEffect, useMemo } from 'react'
import { useAuth } from './context/AuthContext'
import FiltrosCursos from './components/FiltrosCursos'
import TarjetaCurso from './components/TarjetaCurso'
import GestionHitos from './components/GestionHitos'
import LoginForm from './components/LoginForm'
import { cursosService } from './services/apiService'
import { validarCurso, normalizarCurso } from './utils/cursoHelpers'
import { useHitos } from './hooks/useHitos'
import { compareNormalized } from './utils/normalizers'

function App() {
  const { user, isAuthenticated, logout } = useAuth()
  const [cursos, setCursos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showLogin, setShowLogin] = useState(false)
  const [apiMode, setApiMode] = useState(true) // true = API, false = JSON
  const [vistaActual, setVistaActual] = useState('listado') // 'listado' o 'gestion'
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [filtros, setFiltros] = useState({
    vp: 'Todos',
    gerencia: 'Todas',
    estado: 'Todos',
    cursos: [],
    mesesInicio: []
  })

  // Hook de gestión de hitos
  const { progresoHitos, toggleHito, cambiarEstadoEspecial, revertirEstado } = useHitos(cursos)

  // Cargar datos desde API o JSON
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true)
        setError(null)

        if (apiMode) {
          // Modo API: Obtener desde backend
          try {
            const response = await cursosService.getCursos()

            if (response.success && Array.isArray(response.data)) {
              // Los datos ya vienen normalizados desde la BD, pero normalizar VP a mayúsculas
              const cursosNormalizados = response.data.map(curso => ({
                ...curso,
                vp: (curso.vp || '').toUpperCase()
              }))

              const cursosValidos = cursosNormalizados.filter(curso => {
                const { esValido, errores } = validarCurso(curso)
                if (!esValido) {
                  console.warn(`Curso "${curso.nombre}" tiene errores:`, errores)
                }
                return esValido
              })

              // Verificar duplicados por ID
              const idsUnicos = new Set()
              const sinDuplicados = cursosValidos.filter(curso => {
                if (idsUnicos.has(curso.id)) {
                  console.warn(`⚠️ Curso duplicado detectado:`, curso.id, curso.nombre)
                  return false
                }
                idsUnicos.add(curso.id)
                return true
              })

              setCursos(sinDuplicados)
              console.log(`✅ ${sinDuplicados.length} cursos cargados desde API (${cursosValidos.length - sinDuplicados.length} duplicados removidos)`)
            } else {
              throw new Error('Formato de datos inválido desde API')
            }
          } catch (apiError) {
            console.warn('API no disponible, cargando desde JSON local:', apiError)
            setApiMode(false) // Fallback a JSON
            return // Triggerea otro useEffect
          }
        } else {
          // Modo JSON: Fallback al archivo local
          const response = await fetch('/Seguimiento-1.0/cursos.json')

          if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`)
          }

          // Sanear textos con valores inválidos (NaN) antes de parsear JSON
          const rawText = await response.text()
          const sanitizedText = rawText.replace(/\bNaN\b/gi, '0')
          const data = JSON.parse(sanitizedText)

          // Handle both old array format and new object format with metadata
          let cursosData = data
          if (!Array.isArray(data)) {
            // New format: { metadata: {...}, cursos: [...] }
            if (data.cursos && Array.isArray(data.cursos)) {
              cursosData = data.cursos
            } else {
              throw new Error('Formato de datos JSON inválido')
            }
          }

          if (cursosData.length === 0) {
            throw new Error('El archivo de datos está vacío')
          }

          // Normalizar desde JSON (incluye normalización de VP a mayúsculas)
          // Skip first row if it's a header (old format)
          const startIndex = Array.isArray(data) ? 1 : 0
          const cursosNormalizados = cursosData.slice(startIndex).map(cursoRaw => {
            try {
              return normalizarCurso(cursoRaw)
            } catch (err) {
              console.error('Error normalizando curso:', err)
              return null
            }
          }).filter(Boolean)

          const cursosValidos = cursosNormalizados.filter(curso => {
            const { esValido, errores } = validarCurso(curso)
            if (!esValido) {
              console.warn(`Curso "${curso.nombre}" tiene errores:`, errores)
            }
            return esValido
          })

          if (cursosValidos.length === 0) {
            throw new Error('No se encontraron cursos válidos en los datos')
          }

          // Verificar duplicados por ID
          const idsUnicos = new Set()
          const sinDuplicados = cursosValidos.filter(curso => {
            if (idsUnicos.has(curso.id)) {
              console.warn(`⚠️ Curso duplicado detectado:`, curso.id, curso.nombre)
              return false
            }
            idsUnicos.add(curso.id)
            return true
          })

          setCursos(sinDuplicados)
          console.log(`✅ ${sinDuplicados.length} cursos cargados desde JSON (${cursosValidos.length - sinDuplicados.length} duplicados removidos)`)
        }

        setLastUpdate(new Date())
        setLoading(false)
      } catch (err) {
        console.error('Error cargando datos:', err)
        setError(err.message)
        setLoading(false)
      }
    }

    cargarDatos()
  }, [apiMode])

  // Escuchar evento de limpiar filtros
  useEffect(() => {
    const handleLimpiarFiltros = () => {
      setFiltros({
        vp: 'Todos',
        gerencia: 'Todas',
        estado: 'Todos',
        cursos: [],
        mesesInicio: []
      })
    }

    window.addEventListener('limpiarFiltros', handleLimpiarFiltros)
    return () => window.removeEventListener('limpiarFiltros', handleLimpiarFiltros)
  }, [])

  // Aplicar filtros
  const cursosConEstado = useMemo(() => {
    return cursos.map((curso, index) => {
      const progresoCurso = progresoHitos[index] || {}
      const estadoActual = progresoCurso.estadoActual || curso.estado
      return {
        ...curso,
        estadoActual,
        mesInicio: curso.mesInicio,
        progreso: progresoCurso.hitos || [false, false, false, false],
        historialEstados: progresoCurso.historialEstados || [],
        originalIndex: index
      }
    })
  }, [cursos, progresoHitos])

  const cursosFiltrados = useMemo(() => {
    const filtered = cursosConEstado.filter(curso => {
      const cumpleVP = filtros.vp === 'Todos' || compareNormalized(curso.vp || '', filtros.vp)
      const cumpleGerencia = filtros.gerencia === 'Todas' || compareNormalized(curso.gerencia || '', filtros.gerencia)
      const cumpleEstado = filtros.estado === 'Todos' || compareNormalized(curso.estadoActual || '', filtros.estado)
      const cumpleCursoSeleccionado = filtros.cursos.length === 0 || filtros.cursos.some(nombreFiltro => compareNormalized(curso.nombre || '', nombreFiltro))
      const cumpleMesInicio = filtros.mesesInicio.length === 0 || filtros.mesesInicio.includes(String(curso.mesInicio))
      return cumpleVP && cumpleGerencia && cumpleEstado && cumpleCursoSeleccionado && cumpleMesInicio
    })

    console.log('🔍 Filtros aplicados:', filtros)
    console.log('📊 Total cursos:', cursosConEstado.length, '| Filtrados:', filtered.length)

    return filtered
  }, [cursosConEstado, filtros])

  // Estadísticas
  const estadisticas = useMemo(() => {
    return {
      total: cursosFiltrados.length,
      realizados: cursosFiltrados.filter(c => c.estadoActual === 'Realizado').length,
      enEjecucion: cursosFiltrados.filter(c => c.estadoActual === 'En Ejecución').length,
      enProceso: cursosFiltrados.filter(c => c.estadoActual === 'En Proceso').length,
      programado: cursosFiltrados.filter(c => c.estadoActual === 'Programado').length,
      planificado: cursosFiltrados.filter(c => c.estadoActual === 'Planificado' || c.estadoActual === 'Planificación').length,
      pendiente: cursosFiltrados.filter(c => c.estadoActual === 'Pendiente').length
    }
  }, [cursosFiltrados])

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }))
  }

  const handleLimpiarFiltros = () => {
    setFiltros({
      vp: 'Todos',
      gerencia: 'Todas',
      estado: 'Todos',
      cursos: [],
      mesesInicio: []
    })
  }

  const handleToggleHito = (cursoIndex, hitoIndex) => {
    toggleHito(cursoIndex, hitoIndex)
    setLastUpdate(new Date())
  }

  const handleCambiarEstadoEspecial = (cursoIndex, nuevoEstado) => {
    cambiarEstadoEspecial(cursoIndex, nuevoEstado)
    setLastUpdate(new Date())
  }

  const handleRevertirEstado = (cursoIndex) => {
    revertirEstado(cursoIndex)
    setLastUpdate(new Date())
  }

  // Estado de carga
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700 font-semibold text-lg">Cargando y validando datos...</p>
          <p className="text-gray-500 text-sm mt-2">Normalizando estructura de cursos</p>
        </div>
      </div>
    )
  }

  // Estado de error
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error al Cargar Datos</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold w-full"
          >
            🔄 Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                📊 Sistema de Seguimiento de Capacitaciones
              </h1>
              <div className="flex items-center gap-3 flex-wrap">
                <p className="text-gray-600">
                  Gestión integral de capacitaciones - <span className="font-semibold">Fase 3: Backend API</span>
                </p>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  apiMode
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {apiMode ? '🟢 API Backend' : '📁 JSON Local'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">Total en sistema</div>
                <div className="text-3xl font-bold text-blue-600">{cursos.length}</div>
                <div className="text-xs text-gray-500">cursos validados</div>
              </div>

              {isAuthenticated ? (
                <div className="flex flex-col items-end gap-2">
                  <div className="text-sm text-gray-600">
                    Hola, <span className="font-semibold">{user?.nombre}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors font-semibold"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLogin(true)}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Iniciar Sesión
                </button>
              )}
            </div>
          </div>

          {/* Toggle de vistas */}
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setVistaActual('listado')}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                vistaActual === 'listado'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              📋 Vista Listado
            </button>
            <button
              onClick={() => setVistaActual('gestion')}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                vistaActual === 'gestion'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              ✅ Gestión de Hitos
            </button>
          </div>
        </div>

        {/* Login Modal */}
        {showLogin && <LoginForm onClose={() => setShowLogin(false)} />}

        {/* Estadísticas Mejoradas */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 mb-2">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-blue-600">{estadisticas.total}</div>
            <div className="text-xs text-gray-600">Filtrados</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-green-600">{estadisticas.realizados}</div>
            <div className="text-xs text-gray-600">Realizados</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-blue-600">{estadisticas.enEjecucion}</div>
            <div className="text-xs text-gray-600">En Ejecución</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-indigo-600">{estadisticas.enProceso}</div>
            <div className="text-xs text-gray-600">En Proceso</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-yellow-600">{estadisticas.programado}</div>
            <div className="text-xs text-gray-600">Programado</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-cyan-600">{estadisticas.planificado}</div>
            <div className="text-xs text-gray-600">Planificado</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-slate-700">{estadisticas.pendiente}</div>
            <div className="text-xs text-gray-600">Pendiente</div>
          </div>
        </div>
        <div className="text-sm text-gray-600 mb-6 flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-1 bg-slate-100 text-slate-700 rounded-lg border border-slate-200 font-semibold">
            Fecha última actualización: {lastUpdate.toLocaleString()}
          </span>
        </div>

        {/* Filtros con cascada */}
        <FiltrosCursos
          filtros={filtros}
          onFiltroChange={handleFiltroChange}
          onLimpiarFiltros={handleLimpiarFiltros}
          cursos={cursosConEstado}
        />

        {/* Vista Listado */}
        {vistaActual === 'listado' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                📚 Cursos
              </h2>
              <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-semibold">
                {cursosFiltrados.length} resultados
              </span>
            </div>

            {cursosFiltrados.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-lg font-semibold mb-2">No hay cursos que cumplan los filtros</p>
                <p className="text-sm">Intenta ajustar o limpiar los filtros</p>
                <button
                  onClick={handleLimpiarFiltros}
                  className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
                >
                  🗑️ Limpiar Filtros
                </button>
              </div>
            ) : (
              <div className="space-y-3 max-h-[700px] overflow-y-auto pr-2">
                {cursosFiltrados.map((curso, index) => (
                  <TarjetaCurso
                    key={`${curso.id}-${curso.originalIndex}`}
                    curso={curso}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Vista Gestión de Hitos */}
        {vistaActual === 'gestion' && (
          <GestionHitos
            cursos={cursos}
            progresoHitos={progresoHitos}
            onToggleHito={handleToggleHito}
            onCambiarEstadoEspecial={handleCambiarEstadoEspecial}
            onRevertirEstado={handleRevertirEstado}
            filtrosAplicados={filtros}
            lastUpdate={lastUpdate}
          />
        )}

        {/* Footer mejorado */}
        <div className="mt-6 bg-white rounded-lg shadow p-4 text-center text-gray-600 text-sm">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <span>© 2024 Sistema de Seguimiento de Capacitaciones</span>
            <span className="hidden md:inline">•</span>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
              Fase 3: Backend API + Gestión de Hitos
            </span>
            <span className="hidden md:inline">•</span>
            <span>Deployado en GitHub Pages</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
