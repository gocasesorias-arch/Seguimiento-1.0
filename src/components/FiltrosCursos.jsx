import { useMemo } from 'react'

const FiltrosCursos = ({
  filtros,
  onFiltroChange,
  onLimpiarFiltros,
  cursos
}) => {
  // Cursos disponibles
  const cursosDisponibles = useMemo(() => {
    const nombres = new Set(cursos.map(c => c.nombre).filter(Boolean))
    return Array.from(nombres).sort()
  }, [cursos])

  // VPs únicas
  const vpsDisponibles = useMemo(() => {
    const vps = new Set(cursos.map(c => c.vp).filter(Boolean))
    return ['Todos', ...Array.from(vps).sort()]
  }, [cursos])

  // Gerencias filtradas por VP seleccionado (CASCADA)
  const gerenciasDisponibles = useMemo(() => {
    let gerencias
    if (filtros.vp === 'Todos') {
      gerencias = new Set(cursos.map(c => c.gerencia).filter(Boolean))
    } else {
      // Solo gerencias de la VP seleccionada
      gerencias = new Set(
        cursos
          .filter(c => c.vp === filtros.vp)
          .map(c => c.gerencia)
          .filter(Boolean)
      )
    }
    return ['Todas', ...Array.from(gerencias).sort()]
  }, [cursos, filtros.vp])

  // Estados disponibles
  const estadosDisponibles = useMemo(() => {
    const estados = new Set(cursos.map(c => c.estado).filter(Boolean))
    return ['Todos', ...Array.from(estados).sort()]
  }, [cursos])

  // Meses de inicio disponibles
  const mesesDisponibles = useMemo(() => {
    const meses = new Set(cursos.map(c => c.mesInicio).filter(Boolean))
    return Array.from(meses).map(m => String(m)).sort((a, b) => Number(a) - Number(b))
  }, [cursos])

  // Contar filtros activos
  const filtrosActivos = Object.entries(filtros).filter(([key, value]) => {
    if (key === 'vp') return value !== 'Todos'
    if (key === 'gerencia') return value !== 'Todas'
    if (key === 'estado') return value !== 'Todos'
    if (key === 'cursos') return value.length > 0
    if (key === 'mesesInicio') return value.length > 0
    return false
  }).length

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔍</span>
          <h2 className="text-xl font-bold text-gray-800">Filtros</h2>
          {filtrosActivos > 0 && (
            <span className="px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
              {filtrosActivos}
            </span>
          )}
        </div>
        {filtrosActivos > 0 && (
          <button
            onClick={onLimpiarFiltros}
            className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors font-semibold"
          >
            🗑️ Limpiar
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Filtro VP */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Vicepresidencia
          </label>
          <select
            value={filtros.vp}
            onChange={(e) => {
              onFiltroChange('vp', e.target.value)
              // Reset gerencia cuando cambia VP
              if (e.target.value !== filtros.vp) {
                onFiltroChange('gerencia', 'Todas')
              }
            }}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
          >
            {vpsDisponibles.map(vp => (
              <option key={vp} value={vp}>{vp}</option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            {vpsDisponibles.length - 1} VPs disponibles
          </p>
        </div>

        {/* Filtro Gerencia (cascada) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Gerencia
            {filtros.vp !== 'Todos' && (
              <span className="text-xs text-blue-600 ml-1">
                (filtrado por VP)
              </span>
            )}
          </label>
          <select
            value={filtros.gerencia}
            onChange={(e) => onFiltroChange('gerencia', e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
            disabled={filtros.vp === 'Todos' && gerenciasDisponibles.length === 1}
          >
            {gerenciasDisponibles.map(ger => (
              <option key={ger} value={ger}>{ger}</option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            {gerenciasDisponibles.length - 1} gerencias disponibles
          </p>
        </div>

        {/* Filtro Estado */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Estado
          </label>
          <select
            value={filtros.estado}
            onChange={(e) => onFiltroChange('estado', e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
          >
            {estadosDisponibles.map(estado => (
              <option key={estado} value={estado}>{estado}</option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            {estadosDisponibles.length - 1} estados disponibles
          </p>
        </div>

        {/* Filtro Cursos (multi selección) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Cursos (selección múltiple)
          </label>
          <select
            multiple
            value={filtros.cursos}
            onChange={(e) => {
              const valores = Array.from(e.target.selectedOptions).map(opt => opt.value)
              onFiltroChange('cursos', valores)
            }}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors h-32"
          >
            {cursosDisponibles.map(nombre => (
              <option key={nombre} value={nombre}>{nombre}</option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Selecciona uno o varios cursos
          </p>
        </div>

        {/* Filtro Mes de Inicio (multi selección) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Mes Inicio (selección múltiple)
          </label>
          <select
            multiple
            value={filtros.mesesInicio}
            onChange={(e) => {
              const valores = Array.from(e.target.selectedOptions).map(opt => opt.value)
              onFiltroChange('mesesInicio', valores)
            }}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors h-32"
          >
            {mesesDisponibles.map(mes => (
              <option key={mes} value={mes}>Mes {mes}</option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Filtra por mes de inicio programado
          </p>
        </div>
      </div>
    </div>
  )
}

export default FiltrosCursos
