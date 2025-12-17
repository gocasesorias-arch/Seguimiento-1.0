import { useState } from 'react';
import { Circle, CheckCircle, XCircle, Clock } from './Icons';
import { obtenerColorPorEstado, obtenerHitosPorEstado } from '../utils/helpers';

const GestionHitos = ({
  cursos,
  cursosFiltrados,
  progresoHitos,
  toggleHito,
  cambiarEstadoEspecial,
  limpiarFiltros
}) => {
  const [cursoExpandido, setCursoExpandido] = useState(null);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-4">
          Gestión de Cursos y Hitos
        </h2>
        <p className="text-sm text-slate-600 mb-6">
          Marca los hitos completados para cada curso. Cuando completes los 4 hitos, el curso avanzará automáticamente al siguiente estado.
        </p>

        {cursosFiltrados.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Circle size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg">No hay cursos que cumplan los filtros seleccionados</p>
            <button
              onClick={limpiarFiltros}
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Limpiar Filtros
            </button>
          </div>
        ) : (
          <div className="space-y-3 max-h-screen overflow-y-auto">
            {cursosFiltrados.map((curso) => {
              const cursoOriginalIndex = cursos.indexOf(curso);
              const progreso = progresoHitos[cursoOriginalIndex] || {
                hitos: [false, false, false, false],
                estadoActual: curso.Column4
              };
              const estadoActual = progreso.estadoActual || curso.Column4;
              const hitosEstado = obtenerHitosPorEstado(estadoActual);
              const colorEstado = obtenerColorPorEstado(estadoActual);
              const hitosCompletados = progreso.hitos.filter(h => h).length;
              const expandido = cursoExpandido === cursoOriginalIndex;

              return (
                <div
                  key={cursoOriginalIndex}
                  className="border-2 border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition-all"
                >
                  {/* Header del curso */}
                  <div
                    className="p-4 bg-slate-50 cursor-pointer"
                    onClick={() => setCursoExpandido(expandido ? null : cursoOriginalIndex)}
                  >
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-800 mb-2">
                          {curso.Column13 || 'Sin nombre'}
                        </h3>
                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded font-semibold">
                            {curso.Column9 || 'Sin VP'}
                          </span>
                          <span className="px-2 py-1 bg-white rounded border">
                            {curso.Column10 || 'Sin gerencia'}
                          </span>
                          <span className={`px-3 py-1 rounded-full font-semibold ${colorEstado}`}>
                            {estadoActual}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{hitosCompletados}/4</div>
                          <div className="text-xs text-slate-600">hitos</div>
                        </div>
                        <div className="text-2xl text-slate-400">
                          {expandido ? '▼' : '▶'}
                        </div>
                      </div>
                    </div>

                    {/* Barra de progreso */}
                    <div className="mt-3 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 transition-all duration-300"
                        style={{ width: `${(hitosCompletados / 4) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Contenido expandible */}
                  {expandido && (
                    <div className="p-6 bg-white border-t-2">
                      {/* Info adicional */}
                      <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                        <p className="text-sm text-slate-700 mb-3">
                          <span className="font-semibold">Objetivo:</span> {curso.Column14 || 'Sin descripción'}
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="font-semibold">Horas:</span> {curso.Column15 || '0'}
                          </div>
                          <div>
                            <span className="font-semibold">Participantes:</span> {curso['18348'] || '0'}
                          </div>
                          <div>
                            <span className="font-semibold">OTEC:</span> {curso.Column20 || 'No asignado'}
                          </div>
                          <div>
                            <span className="font-semibold">Responsable:</span> {curso.Column7 || 'No asignado'}
                          </div>
                        </div>
                      </div>

                      {/* Hitos */}
                      <div className="mb-6">
                        <h4 className="font-semibold text-slate-700 mb-4">
                          Hitos del Estado: {estadoActual}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {hitosEstado.map((hito, hitoIndex) => (
                            <div
                              key={hitoIndex}
                              className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                                progreso.hitos[hitoIndex]
                                  ? 'bg-green-50 border-green-500'
                                  : 'bg-white border-slate-300 hover:border-blue-400'
                              }`}
                              onClick={() => toggleHito(cursoOriginalIndex, hitoIndex)}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                  progreso.hitos[hitoIndex]
                                    ? 'bg-green-500 border-green-500'
                                    : 'bg-white border-slate-400'
                                }`}>
                                  {progreso.hitos[hitoIndex] && (
                                    <CheckCircle size={16} className="text-white" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="text-xs font-semibold text-slate-500 mb-1">
                                    Hito {hitoIndex + 1}
                                  </div>
                                  <p className="text-sm font-medium text-slate-700">{hito}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Botones especiales */}
                      <div className="flex gap-3 pt-4 border-t-2">
                        <button
                          onClick={() => cambiarEstadoEspecial(cursoOriginalIndex, 'Suspendido')}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-100 text-red-700 border-2 border-red-300 rounded-lg font-semibold hover:bg-red-200 transition-all"
                        >
                          <XCircle size={20} />
                          Suspender Curso
                        </button>
                        <button
                          onClick={() => cambiarEstadoEspecial(cursoOriginalIndex, 'Postergado')}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-purple-100 text-purple-700 border-2 border-purple-300 rounded-lg font-semibold hover:bg-purple-200 transition-all"
                        >
                          <Clock size={20} />
                          Postergar Curso
                        </button>
                      </div>

                      {hitosCompletados === 4 && (
                        <div className="mt-4 p-4 bg-green-100 border-2 border-green-500 rounded-lg text-center">
                          <p className="text-green-800 font-semibold">
                            ✅ ¡Todos los hitos completados! El curso pasará automáticamente al siguiente estado.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default GestionHitos;
