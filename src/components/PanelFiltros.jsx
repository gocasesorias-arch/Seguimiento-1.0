import { useState } from 'react';
import { Filter } from './Icons';

const PanelFiltros = ({
  filtros,
  actualizarFiltro,
  limpiarFiltros,
  opcionesFiltros,
  cursosContados
}) => {
  const [mostrarFiltros, setMostrarFiltros] = useState(true);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter size={24} className="text-blue-600" />
          <h2 className="text-lg font-semibold text-slate-700">Filtros</h2>
        </div>
        <button
          onClick={() => setMostrarFiltros(!mostrarFiltros)}
          className="px-4 py-2 text-sm bg-slate-100 hover:bg-slate-200 rounded-lg transition-all"
        >
          {mostrarFiltros ? 'Ocultar' : 'Mostrar'}
        </button>
      </div>

      {mostrarFiltros && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Filtro VP */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Vicepresidencia
              </label>
              <select
                value={filtros.vp}
                onChange={(e) => actualizarFiltro('vp', e.target.value)}
                className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                {opcionesFiltros.vps.map((vp) => (
                  <option key={vp} value={vp}>
                    {vp}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro Gerencia */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Gerencia
              </label>
              <select
                value={filtros.gerencia}
                onChange={(e) => actualizarFiltro('gerencia', e.target.value)}
                className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                {opcionesFiltros.gerencias.map((gerencia) => (
                  <option key={gerencia} value={gerencia}>
                    {gerencia}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro Mes de Inicio */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Mes de Inicio
              </label>
              <select
                value={filtros.mes}
                onChange={(e) => actualizarFiltro('mes', e.target.value)}
                className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option value="Todos">Todos</option>
                {opcionesFiltros.meses.map((mes) => (
                  <option key={mes} value={mes}>
                    {mes}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro Nombre Curso (Multiselección) */}
            <div className="md:col-span-3">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Nombre Curso (Selección Múltiple)
              </label>
              <div className="h-32 overflow-y-auto border-2 border-slate-300 rounded-lg p-2 bg-slate-50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {opcionesFiltros.nombres.map((nombre) => (
                  <div key={nombre} className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      checked={filtros.nombres.includes(nombre)}
                      onChange={(e) => {
                        const newNombres = e.target.checked
                          ? [...filtros.nombres, nombre]
                          : filtros.nombres.filter(n => n !== nombre);
                        actualizarFiltro('nombres', newNombres);
                      }}
                      className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700 break-words">{nombre}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-slate-500">
                  {filtros.nombres.length === 0 ? "Todos los cursos seleccionados" : `${filtros.nombres.length} cursos seleccionados`}
                </span>
                {filtros.nombres.length > 0 && (
                  <button
                    onClick={() => actualizarFiltro('nombres', [])}
                    className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    Limpiar selección
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 border-t pt-4">
            {/* Filtro PDC Responsable OTIC */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                PDC Responsable OTIC
              </label>
              <select
                value={filtros.responsable}
                onChange={(e) => actualizarFiltro('responsable', e.target.value)}
                className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                {opcionesFiltros.responsables.map((resp) => (
                  <option key={resp} value={resp}>
                    {resp}
                  </option>
                ))}
              </select>
            </div>
            {/* Botón Limpiar */}
            <div className="flex items-end">
              <button
                onClick={limpiarFiltros}
                className="w-full px-4 py-2 bg-red-100 text-red-700 border-2 border-red-300 rounded-lg font-semibold hover:bg-red-200 transition-all"
              >
                🗑️ Limpiar Todos los Filtros
              </button>
            </div>
          </div>

          {/* Contador de resultados */}
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
            <div className="text-sm text-slate-700">
              <span className="font-semibold">Filtros activos:</span>
              {' '}
              {Object.values(filtros).filter(v => v !== 'Todos' && v !== 'Todas' && !(Array.isArray(v) && v.length === 0)).length}
            </div>
            <div className="text-lg font-bold text-blue-700">
              {cursosContados} cursos
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PanelFiltros;
