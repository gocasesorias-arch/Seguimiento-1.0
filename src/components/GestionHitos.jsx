import { useState } from 'react'
import {
  CheckCircleIcon as CheckCircle,
  XCircleIcon as XCircle,
  ClockIcon as Clock,
  CircleIcon as Circle
} from './Icons.jsx'
import { obtenerHitosPorEstado, obtenerColorPorEstado } from '../hooks/useHitos'
import { formatearMoneda } from '../utils/cursoHelpers'
import { compareNormalized } from '../utils/normalizers'

const GestionHitos = ({
  cursos,
  progresoHitos,
  onToggleHito,
  onCambiarEstadoEspecial,
  onRevertirEstado,
  filtrosAplicados,
  lastUpdate
}) => {
  const [cursoExpandido, setCursoExpandido] = useState(null)

  // Aplicar filtros
  const cursosFiltrados = cursos.filter(curso => {
    // Obtener el estado actual (puede ser modificado por hitos)
    const cursoIndex = cursos.indexOf(curso)
    const estadoActual = progresoHitos[cursoIndex]?.estadoActual || curso.estado

    const cumpleVP = filtrosAplicados.vp === 'Todos' ||
          compareNormalized(curso.vp || '', filtrosAplicados.vp)
    const cumpleGerencia = filtrosAplicados.gerencia === 'Todas' ||
                compareNormalized(curso.gerencia || '', filtrosAplicados.gerencia)
    const cumpleEstado = filtrosAplicados.estado === 'Todos' || compareNormalized(estadoActual || '', filtrosAplicados.estado)
    const cumpleCursoSeleccionado = filtrosAplicados.cursos.length === 0 ||
      filtrosAplicados.cursos.some(nombreFiltro => compareNormalized(curso.nombre || '', nombreFiltro))
    const cumpleMesInicio = filtrosAplicados.mesesInicio.length === 0 ||
      filtrosAplicados.mesesInicio.includes(String(curso.mesInicio))

    return cumpleVP && cumpleGerencia && cumpleEstado && cumpleCursoSeleccionado && cumpleMesInicio
  })

  const limpiarFiltros = () => {
    // Este evento debería ser manejado por el componente padre
    window.dispatchEvent(new CustomEvent('limpiarFiltros'))
  }

  // Datos para gráfico de avance por mes de inicio
  const graficoAvance = cursosFiltrados.reduce((acc, curso) => {
    const cursoIndex = cursos.indexOf(curso)
    const progreso = progresoHitos[cursoIndex] || { hitos: [false, false, false, false] }
    const completados = progreso.hitos.filter(h => h).length
    const total = 4
    const mesClave = String(curso.mesInicio || 'Sin mes')

    if (!acc[mesClave]) {
      acc[mesClave] = { completados: 0, total: 0 }
    }

    acc[mesClave].completados += completados
    acc[mesClave].total += total
    return acc
  }, {})

  const graficoOrden = Object.entries(graficoAvance).sort((a, b) => {
    if (a[0] === 'Sin mes') return 1
    if (b[0] === 'Sin mes') return -1
    return Number(a[0]) - Number(b[0])
  })

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-2">
          Gestión de Cursos y Hitos
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Marca los hitos completados para cada curso. Cuando completes los 4 hitos, el curso avanzará automáticamente al siguiente estado.
        </p>
        <div className="text-xs text-slate-500 mb-4">
          Fecha última actualización: <span className="font-semibold text-slate-700">{lastUpdate?.toLocaleString()}</span>
        </div>

        {/* Gráfico de avance de hitos */}
        {graficoOrden.length > 0 && (
          <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-700">Avance de hitos por mes de inicio</h3>
              <span className="text-xs text-slate-500">Hitos realizados vs totales proyectados</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
              {graficoOrden.map(([mes, data]) => {
                const porcentaje = data.total > 0 ? (data.completados / data.total) * 100 : 0
                return (
                  <div key={mes} className="flex flex-col items-center gap-2">
                    <div className="w-full h-28 bg-white border border-slate-200 rounded-xl flex items-end overflow-hidden">
                      <div
                        className="w-full bg-gradient-to-t from-emerald-500 to-emerald-300 transition-all duration-500"
                        style={{ height: `${porcentaje}%` }}
                        title={`${data.completados}/${data.total} hitos`}
                      />
                    </div>
                    <div className="text-xs text-center text-slate-600">
                      <div className="font-semibold">{mes === 'Sin mes' ? 'Sin mes' : `Mes ${mes}`}</div>
                      <div>{data.completados}/{data.total} hitos ({porcentaje.toFixed(0)}%)</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {cursosFiltrados.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Circle size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg">No hay cursos que cumplan los filtros seleccionados</p>
            <button
              onClick={limpiarFiltros}
              className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700"
            >
              Limpiar Filtros
            </button>
          </div>
        ) : (
          <div className="space-y-3 max-h-screen overflow-y-auto">
            {cursosFiltrados.map((curso) => {
              const cursoOriginalIndex = cursos.indexOf(curso)
              const progreso = progresoHitos[cursoOriginalIndex] || {
                hitos: [false, false, false, false],
                estadoActual: curso.estado,
                historialEstados: []
              }
              const estadoActual = progreso.estadoActual || curso.estado
              const hitosEstado = obtenerHitosPorEstado(estadoActual)
              const colorEstado = obtenerColorPorEstado(estadoActual)
              const hitosCompletados = progreso.hitos.filter(h => h).length
              const expandido = cursoExpandido === cursoOriginalIndex
              const totalParticipantes = curso.participantesPorMes
                ? Object.values(curso.participantesPorMes).reduce((a, b) => a + b, 0)
                : (curso.participacion_real || 0)
              const costoTotal = curso.valorPersona && totalParticipantes
                ? formatearMoneda(curso.valorPersona * totalParticipantes)
                : null

              return (
                <div
                  key={cursoOriginalIndex}
                  className="border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition-all bg-white"
                >
                  {/* Header del curso */}
                  <div
                    className="p-4 bg-slate-50 cursor-pointer"
                    onClick={() => setCursoExpandido(expandido ? null : cursoOriginalIndex)}
                  >
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-800 mb-2">
                          {curso.nombre || 'Sin nombre'}
                        </h3>
                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded font-semibold border border-emerald-100">
                            {(curso.vp || 'Sin VP').toUpperCase()}
                          </span>
                          <span className="px-2 py-1 bg-white rounded border border-slate-200">
                            {curso.gerencia || 'Sin gerencia'}
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
                        className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 transition-all duration-300"
                        style={{ width: `${(hitosCompletados / 4) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Contenido expandible */}
                  {expandido && (
                    <div className="p-6 bg-white border-t border-slate-200">
                      {/* Info adicional */}
                      <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <p className="text-sm text-slate-700 mb-3">
                          <span className="font-semibold">Objetivo:</span> {curso.objetivo || 'Sin descripción'}
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="font-semibold">Horas:</span> {curso.horas || '0'}
                          </div>
                          <div>
                            <span className="font-semibold">Participantes:</span> {totalParticipantes || '0'}
                          </div>
                          <div>
                            <span className="font-semibold">OTEC:</span> {curso.otecSugerido || 'No asignado'}
                          </div>
                          <div>
                            <span className="font-semibold">Responsable:</span> {curso.responsableOTIC || 'No asignado'}
                          </div>
                          {curso.modalidad && (
                            <div>
                              <span className="font-semibold">Modalidad:</span> {curso.modalidad}
                            </div>
                          )}
                          {costoTotal && (
                            <div>
                              <span className="font-semibold">Costo total:</span> {costoTotal}
                            </div>
                          )}
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
                              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                                progreso.hitos[hitoIndex]
                                  ? 'bg-emerald-50 border-emerald-400'
                                  : 'bg-white border-slate-200 hover:border-emerald-300'
                              }`}
                              onClick={() => onToggleHito(cursoOriginalIndex, hitoIndex)}
                            >
                              <div className="flex items-start gap-3">
                                <div
                                  className={`w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 ${
                                    progreso.hitos[hitoIndex]
                                      ? 'bg-emerald-500 border-emerald-500'
                                      : 'bg-white border-slate-300'
                                  }`}
                                >
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
                      <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200">
                        <button
                          onClick={() => onCambiarEstadoEspecial(cursoOriginalIndex, 'Suspendido')}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl font-semibold hover:bg-rose-100 transition-all"
                        >
                          <XCircle size={20} />
                          Suspender Curso
                        </button>
                        <button
                          onClick={() => onCambiarEstadoEspecial(cursoOriginalIndex, 'Postergado')}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl font-semibold hover:bg-amber-100 transition-all"
                        >
                          <Clock size={20} />
                          Postergar Curso
                        </button>
                        {(progreso.estadoAnterior || (progreso.historialEstados?.length || 0) > 0) && (
                          <button
                            onClick={() => onRevertirEstado(cursoOriginalIndex)}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl font-semibold hover:bg-emerald-100 transition-all"
                          >
                            Deshacer cambio de estado
                          </button>
                        )}
                      </div>

                      {progreso.historialEstados && progreso.historialEstados.length > 0 && (
                        <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="text-sm font-semibold text-slate-700">Historial de estados</h5>
                            <span className="text-xs text-slate-500">Reversa habilitada</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {progreso.historialEstados.slice(-4).reverse().map((registro, idx) => (
                              <div key={`${registro.estado}-${idx}`} className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs">
                                <div className="font-semibold text-slate-700">{registro.estado}</div>
                                <div className="text-slate-500">{new Date(registro.fecha).toLocaleString()}</div>
                                {registro.motivo && <div className="text-slate-400 italic">{registro.motivo}</div>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {hitosCompletados === 4 && (
                        <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                          <p className="text-emerald-800 font-semibold">
                            ✅ El curso ha finalizado el registro de hitos exitosamente.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default GestionHitos
