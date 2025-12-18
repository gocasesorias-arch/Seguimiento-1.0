import { useEffect, useMemo, useRef, useState } from 'react'

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
    const estados = new Set(cursos.map(c => c.estadoActual || c.estado).filter(Boolean))
    return ['Todos', ...Array.from(estados).sort()]
  }, [cursos])

  // Meses de inicio disponibles
  const mesesDisponibles = useMemo(() => {
    const meses = new Set(
      cursos
        .map(c => c.mesInicio || c.Column2)
        .filter(Boolean)
    )
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

  const renderMultiSelect = (label, placeholder, options, selected, onChange) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <details className="relative group">
        <summary className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 cursor-pointer list-none flex items-center justify-between text-sm">
          <span className="truncate">
            {selected.length === 0 ? placeholder : `${selected.length} seleccionados`}
          </span>
          <span className="text-xs text-slate-500">▼</span>
        </summary>
        <div className="absolute left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-20">
          {options.map(opt => (
            <label
              key={opt.value}
              className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 cursor-pointer text-sm"
            >
              <input
                type="checkbox"
                className="rounded text-blue-600"
                checked={selected.includes(opt.value)}
                onChange={() => {
                  const nuevo = selected.includes(opt.value)
                    ? selected.filter(v => v !== opt.value)
                    : [...selected, opt.value]
                  onChange(nuevo)
                }}
              />
              <span>{opt.label}</span>
            </label>
          ))}
          {options.length === 0 && (
            <div className="px-3 py-2 text-xs text-slate-500">No hay opciones disponibles</div>
          )}
        </div>
      </details>
    </div>
  )

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

        {/* Filtro Cursos (multi selección con dropdown) */}
        {renderMultiSelect(
          'Cursos (selección múltiple)',
          'Elige uno o varios cursos',
          cursosDisponibles.map(nombre => ({ value: nombre, label: nombre })),
          filtros.cursos,
          (valores) => onFiltroChange('cursos', valores)
        )}

        {/* Filtro Mes de Inicio (multi selección con dropdown) */}
        {renderMultiSelect(
          'Mes Inicio (selección múltiple)',
          'Selecciona meses de inicio',
          mesesDisponibles.map(mes => ({ value: mes, label: `Mes ${mes}` })),
          filtros.mesesInicio,
          (valores) => onFiltroChange('mesesInicio', valores)
        )}
      </div>
    </div>
  )
}

export default FiltrosCursos
