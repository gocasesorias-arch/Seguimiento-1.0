import { useState, useEffect, useMemo } from 'react'
import { useAuth } from './context/AuthContext'
import FiltrosCursos from './components/FiltrosCursos'
import TarjetaCurso from './components/TarjetaCurso'
import GestionHitos from './components/GestionHitos'
import LoginForm from './components/LoginForm'
import { cursosService } from './services/apiService'
import { validarCurso, normalizarCurso } from './utils/cursoHelpers'
import { useHitos } from './hooks/useHitos'

function App() {
  const { user, isAuthenticated, logout } = useAuth()
  const [cursos, setCursos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showLogin, setShowLogin] = useState(false)
  const [apiMode, setApiMode] = useState(true) // true = API, false = JSON
  const [vistaActual, setVistaActual] = useState('listado') // 'listado' o 'gestion'
  const [filtros, setFiltros] = useState({
    vp: 'Todos',
    gerencia: 'Todas',
    estado: 'Todos'
  })

  // Hook de gestión de hitos
  const { progresoHitos, toggleHito, cambiarEstadoEspecial } = useHitos(cursos)

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

              setCursos(cursosValidos)
              console.log(`✅ ${cursosValidos.length} cursos cargados desde API`)
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

          const data = await response.json()

          if (!Array.isArray(data) || data.length === 0) {
            throw new Error('El archivo de datos está vacío')
          }

          // Normalizar desde JSON (incluye normalización de VP a mayúsculas)
          const cursosNormalizados = data.slice(1).map(cursoRaw => {
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

          setCursos(cursosValidos)
          console.log(`✅ ${cursosValidos.length} cursos cargados desde JSON`)
        }

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
        estado: 'Todos'
      })
    }

    window.addEventListener('limpiarFiltros', handleLimpiarFiltros)
    return () => window.removeEventListener('limpiarFiltros', handleLimpiarFiltros)
  }, [])

  // Aplicar filtros
  const cursosFiltrados = useMemo(() => {
    return cursos.filter(curso => {
      const cumpleVP = filtros.vp === 'Todos' || (curso.vp || '').toUpperCase() === filtros.vp.toUpperCase()
      const cumpleGerencia = filtros.gerencia === 'Todas' || curso.gerencia === filtros.gerencia
      const cumpleEstado = filtros.estado === 'Todos' || curso.estado === filtros.estado
      return cumpleVP && cumpleGerencia && cumpleEstado
    })
  }, [cursos, filtros])

  // Estadísticas
  const estadisticas = useMemo(() => {
    return {
      total: cursosFiltrados.length,
      realizados: cursosFiltrados.filter(c => c.estado === 'Realizado').length,
      enEjecucion: cursosFiltrados.filter(c => c.estado === 'En Ejecución').length,
      enProceso: cursosFiltrados.filter(c => c.estado === 'En Proceso').length,
      planificacion: cursosFiltrados.filter(c => c.estado === 'Planificación').length,
      totalHoras: cursosFiltrados.reduce((sum, c) => sum + (c.horas || 0), 0),
      totalParticipantes: cursosFiltrados.reduce((sum, c) => {
        if (c.participantesPorMes) {
          const totalMes = Object.values(c.participantesPorMes).reduce((a, b) => a + b, 0)
          return sum + totalMes
        }
        return sum
      }, 0)
    }
  }, [cursosFiltrados])

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }))
  }

  const handleLimpiarFiltros = () => {
    setFiltros({
      vp: 'Todos',
      gerencia: 'Todas',
      estado: 'Todos'
    })
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
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
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
            <div className="text-2xl font-bold text-purple-600">{estadisticas.totalHoras.toLocaleString()}</div>
            <div className="text-xs text-gray-600">Horas Totales</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-orange-600">{estadisticas.totalParticipantes.toLocaleString()}</div>
            <div className="text-xs text-gray-600">Participantes</div>
          </div>
        </div>

        {/* Filtros con cascada */}
        <FiltrosCursos
          filtros={filtros}
          onFiltroChange={handleFiltroChange}
          onLimpiarFiltros={handleLimpiarFiltros}
          cursos={cursos}
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
                  <TarjetaCurso key={curso.id || index} curso={curso} index={index} />
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
            onToggleHito={toggleHito}
            onCambiarEstadoEspecial={cambiarEstadoEspecial}
            filtrosAplicados={filtros}
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
