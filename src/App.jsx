import { useState, useEffect } from 'react'

function App() {
  const [cursos, setCursos] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtros, setFiltros] = useState({
    vp: 'Todos',
    gerencia: 'Todas',
    estado: 'Todos'
  })
  const [vpsDisponibles, setVpsDisponibles] = useState(['Todos'])
  const [gerenciasDisponibles, setGerenciasDisponibles] = useState(['Todas'])

  useEffect(() => {
    fetch('/Seguimiento-1.0/cursos.json')
      .then(r => r.json())
      .then(data => {
        const cursosData = data.slice(1)
        setCursos(cursosData)

        // Extraer VPs y Gerencias únicas
        const vps = ['Todos', ...new Set(cursosData.map(c => c.Column9).filter(Boolean))].sort()
        const gerencias = ['Todas', ...new Set(cursosData.map(c => c.Column10).filter(Boolean))].sort()

        setVpsDisponibles(vps)
        setGerenciasDisponibles(gerencias)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error:', err)
        setLoading(false)
      })
  }, [])

  const cursosFiltrados = cursos.filter(curso => {
    const cumpleVP = filtros.vp === 'Todos' || curso.Column9 === filtros.vp
    const cumpleGerencia = filtros.gerencia === 'Todas' || curso.Column10 === filtros.gerencia
    const cumpleEstado = filtros.estado === 'Todos' || curso.Column4 === filtros.estado
    return cumpleVP && cumpleGerencia && cumpleEstado
  })

  const estadisticas = {
    total: cursosFiltrados.length,
    realizados: cursosFiltrados.filter(c => c.Column4 === 'Realizado').length,
    enEjecucion: cursosFiltrados.filter(c => c.Column4 === 'En Ejecución').length,
    planificacion: cursosFiltrados.filter(c => c.Column4 === 'Planificación').length
  }

  const getEstadoColor = (estado) => {
    const colores = {
      'Realizado': 'bg-green-100 text-green-800 border-green-300',
      'En Ejecución': 'bg-blue-100 text-blue-800 border-blue-300',
      'En Proceso': 'bg-indigo-100 text-indigo-800 border-indigo-300',
      'Planificación': 'bg-gray-100 text-gray-800 border-gray-300',
      'Suspendido': 'bg-red-100 text-red-800 border-red-300',
      'Postergado': 'bg-purple-100 text-purple-800 border-purple-300'
    }
    return colores[estado] || 'bg-gray-100 text-gray-800 border-gray-300'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700 font-semibold text-lg">Cargando datos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            📊 Sistema de Seguimiento de Capacitaciones
          </h1>
          <p className="text-gray-600">
            Gestión integral de capacitaciones por VP y Gerencia
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-3xl font-bold text-blue-600">{estadisticas.total}</div>
            <div className="text-sm text-gray-600">Total Cursos</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-3xl font-bold text-green-600">{estadisticas.realizados}</div>
            <div className="text-sm text-gray-600">Realizados</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-3xl font-bold text-blue-600">{estadisticas.enEjecucion}</div>
            <div className="text-sm text-gray-600">En Ejecución</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-3xl font-bold text-gray-600">{estadisticas.planificacion}</div>
            <div className="text-sm text-gray-600">Planificación</div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🔍 Filtros</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Vicepresidencia
              </label>
              <select
                value={filtros.vp}
                onChange={(e) => setFiltros({...filtros, vp: e.target.value})}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                {vpsDisponibles.map(vp => (
                  <option key={vp} value={vp}>{vp}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Gerencia
              </label>
              <select
                value={filtros.gerencia}
                onChange={(e) => setFiltros({...filtros, gerencia: e.target.value})}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                {gerenciasDisponibles.map(ger => (
                  <option key={ger} value={ger}>{ger}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Estado
              </label>
              <select
                value={filtros.estado}
                onChange={(e) => setFiltros({...filtros, estado: e.target.value})}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option value="Todos">Todos</option>
                <option value="Realizado">Realizado</option>
                <option value="En Ejecución">En Ejecución</option>
                <option value="En Proceso">En Proceso</option>
                <option value="Planificación">Planificación</option>
                <option value="Suspendido">Suspendido</option>
                <option value="Postergado">Postergado</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => setFiltros({vp: 'Todos', gerencia: 'Todas', estado: 'Todos'})}
            className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold"
          >
            🗑️ Limpiar Filtros
          </button>
        </div>

        {/* Lista de Cursos */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            📚 Cursos ({cursosFiltrados.length})
          </h2>

          {cursosFiltrados.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-lg">No hay cursos que cumplan los filtros seleccionados</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {cursosFiltrados.map((curso, index) => (
                <div key={index} className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-400 transition-all hover:shadow-md">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-800 mb-2">
                        {curso.Column13 || 'Sin nombre'}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {curso.Column14 || 'Sin descripción'}
                      </p>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-semibold">
                          {curso.Column9 || 'Sin VP'}
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                          {curso.Column10 || 'Sin gerencia'}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                          {curso.Column15 || 0} horas
                        </span>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">
                          👤 {curso['18348'] || 0} participantes
                        </span>
                        {curso.Column7 && (
                          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full">
                            📋 {curso.Column7}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className={`px-4 py-2 rounded-lg border-2 font-semibold text-sm whitespace-nowrap ${getEstadoColor(curso.Column4)}`}>
                      {curso.Column4 || 'Sin estado'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-gray-600 text-sm">
          <p>© 2024 Sistema de Seguimiento de Capacitaciones</p>
          <p className="mt-1">Versión 1.0 - Deployado en GitHub Pages</p>
        </div>
      </div>
    </div>
  )
}

export default App
