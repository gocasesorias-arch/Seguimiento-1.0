import { obtenerColorEstado, formatearMoneda, obtenerNombreMes } from '../utils/cursoHelpers'

const TarjetaCurso = ({ curso, index }) => {
  const totalParticipantes = curso.participantesPorMes
    ? Object.values(curso.participantesPorMes).reduce((a, b) => a + b, 0)
    : (curso.participacion_real || 0)
  const costoTotal = curso.valorPersona && totalParticipantes
    ? curso.valorPersona * totalParticipantes
    : 0
  const estadoVisible = curso.estadoActual || curso.estado

  return (
    <div className="border border-slate-200 rounded-2xl p-4 hover:border-emerald-300 transition-all hover:shadow-md bg-white">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
        <div className="flex-1">
          {/* Encabezado */}
          <div className="flex items-start gap-2 mb-2">
            <span className="text-slate-400 font-mono text-sm mt-1">#{index + 1}</span>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-slate-800">
                {curso.nombre}
              </h3>
              {curso.objetivo && curso.objetivo !== 'Sin descripción' && (
                <p className="text-sm text-slate-600 mt-1">
                  {curso.objetivo}
                </p>
              )}
            </div>
          </div>

          {/* Información principal */}
          <div className="flex flex-wrap gap-2 text-xs mb-3">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full font-semibold border border-emerald-100">
              📍 {curso.vp}
            </span>
            <span className="px-3 py-1 bg-sky-50 text-sky-700 rounded-full border border-sky-100">
              🏢 {curso.gerencia}
            </span>
            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full border border-slate-200">
              ⏱️ {curso.horas}h
            </span>
            {totalParticipantes > 0 && (
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
                👥 {totalParticipantes} participantes
              </span>
            )}
            {Number(curso.mesInicio) > 0 && (
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
                📅 {obtenerNombreMes(curso.mesInicio)}
              </span>
            )}
          </div>

          {/* Información adicional */}
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
            {curso.responsableOTIC && (
              <div>
                <span className="font-semibold">Responsable:</span> {curso.responsableOTIC}
              </div>
            )}
          </div>
        </div>

        {/* Estado */}
        <div className={`px-4 py-2 rounded-lg border-2 font-semibold text-sm whitespace-nowrap self-start ${obtenerColorEstado(estadoVisible)}`}>
          {estadoVisible}
        </div>
      </div>
    </div>
  )
}

export default TarjetaCurso
