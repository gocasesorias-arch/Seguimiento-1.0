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
      pendiente: cursosFiltrados.filter(c => c.estadoActual === 'Pendiente').length,
      planificado: cursosFiltrados.filter(c => c.estadoActual === 'Planificado' || c.estadoActual === 'Planificación').length,
      enProceso: cursosFiltrados.filter(c => c.estadoActual === 'En Proceso').length,
      programado: cursosFiltrados.filter(c => c.estadoActual === 'Programado').length,
      enEjecucion: cursosFiltrados.filter(c => c.estadoActual === 'En Ejecución').length,
      realizados: cursosFiltrados.filter(c => c.estadoActual === 'Realizado').length,
      cierre: cursosFiltrados.filter(c => c.estadoActual === 'Cierre').length,
      suspendido: cursosFiltrados.filter(c => c.estadoActual === 'Suspendido').length,
      postergado: cursosFiltrados.filter(c => c.estadoActual === 'Postergado').length,
      cancelado: cursosFiltrados.filter(c => c.estadoActual === 'Cancelado').length
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-slate-700 font-semibold text-lg">Cargando y validando datos...</p>
          <p className="text-slate-500 text-sm mt-2">Normalizando estructura de cursos</p>
        </div>
      </div>
    )
  }

  // Estado de error
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md border border-red-100">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error al Cargar Datos</h2>
          <p className="text-slate-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-semibold w-full"
          >
            🔄 Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg">
                  📊
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
                    Sistema de Seguimiento de Capacitaciones
                  </h1>
                  <p className="text-sm text-slate-500">
                    Gestión integral de capacitaciones - OTIC CCHC - Proyecto Collahuasi
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                  apiMode
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {apiMode ? '🟢 Conectado a API' : '📁 Fase 1: Creacion Seguimiento Hitos'}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                  {cursos.length} cursos cargados
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <div className="flex flex-col items-end gap-2">
                  <div className="text-sm text-slate-600">
                    Hola, <span className="font-semibold">{user?.nombre}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="px-4 py-2 bg-rose-500 text-white text-sm rounded-xl hover:bg-rose-600 transition-colors font-semibold"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLogin(true)}
                  className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-xl hover:bg-emerald-700 transition-colors font-semibold"
                >
                  Iniciar Sesión
                </button>
              )}
            </div>
          </div>

          {/* Toggle de vistas */}
          <div className="mt-6 flex flex-wrap gap-2">
            <button
              onClick={() => setVistaActual('listado')}
              className={`px-6 py-2 rounded-xl font-semibold transition-colors border ${
                vistaActual === 'listado'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
              }`}
            >
              📋 Dashboard
            </button>
            <button
              onClick={() => setVistaActual('gestion')}
              className={`px-6 py-2 rounded-xl font-semibold transition-colors border ${
                vistaActual === 'gestion'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
              }`}
            >
              ✅ Gestión de Hitos
            </button>
          </div>
        </div>

        {/* Login Modal */}
        {showLogin && <LoginForm onClose={() => setShowLogin(false)} />}

        {/* Estadísticas Mejoradas */}
        <div>
          <h2 className="text-lg font-semibold text-slate-800 mb-3">Dashboard de estadísticas</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 border-t-4 border-emerald-500">
              <div className="text-2xl font-bold text-emerald-600">{estadisticas.total}</div>
              <div className="text-xs text-slate-500">Filtrados</div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 border-t-4 border-green-500">
              <div className="text-2xl font-bold text-green-600">{estadisticas.realizados}</div>
              <div className="text-xs text-slate-500">Realizados</div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 border-t-4 border-sky-500">
              <div className="text-2xl font-bold text-sky-600">{estadisticas.enEjecucion}</div>
              <div className="text-xs text-slate-500">En Ejecución</div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 border-t-4 border-indigo-500">
              <div className="text-2xl font-bold text-indigo-600">{estadisticas.enProceso}</div>
              <div className="text-xs text-slate-500">En Proceso</div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 border-t-4 border-amber-500">
              <div className="text-2xl font-bold text-amber-600">{estadisticas.programado}</div>
              <div className="text-xs text-slate-500">Programado</div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 border-t-4 border-cyan-500">
              <div className="text-2xl font-bold text-cyan-600">{estadisticas.planificado}</div>
              <div className="text-xs text-slate-500">Planificado</div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 border-t-4 border-slate-500">
              <div className="text-2xl font-bold text-slate-700">{estadisticas.pendiente}</div>
              <div className="text-xs text-slate-500">Pendiente</div>
            </div>
          </div>
        </div>
        <div className="text-sm text-slate-600 flex items-center gap-2">
          <span className="inline-flex items-center px-3 py-1 bg-white text-slate-600 rounded-full border border-slate-200 font-semibold shadow-sm">
            Fecha última actualización: {lastUpdate.toLocaleString()}
          </span>
        </div>

        {/* Sección de listado */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Listado de Cursos</h2>
              <p className="text-sm text-slate-500">Gestiona y da seguimiento a todas las capacitaciones</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
              {cursosFiltrados.length} resultados
            </span>
          </div>

          {/* Filtros con cascada */}
          <FiltrosCursos
            filtros={filtros}
            onFiltroChange={handleFiltroChange}
            onLimpiarFiltros={handleLimpiarFiltros}
            cursos={cursosConEstado}
          />
        </div>

        {/* Vista Listado */}
        {vistaActual === 'listado' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
              📚 Cursos
              </h2>
              <p className="text-sm text-slate-500">Gestiona y da seguimiento a todas las capacitaciones</p>
            </div>
            <span className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-semibold text-sm">
              {cursosFiltrados.length} resultados
            </span>
          </div>

          {cursosFiltrados.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-lg font-semibold mb-2">No hay cursos que cumplan los filtros</p>
              <p className="text-sm">Intenta ajustar o limpiar los filtros</p>
              <button
                onClick={handleLimpiarFiltros}
                className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-semibold"
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
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 text-center text-slate-600 text-sm">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <span>© 2025 Sistema de Seguimiento de Capacitaciones</span>
            <span className="hidden md:inline">•</span>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold border border-emerald-200">
              Gestión de Hitos V2.0 
            </span>
            <span className="hidden md:inline">•</span>
            <span>Deployado en GitHub Pages Autor Guillermo Olivares</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
