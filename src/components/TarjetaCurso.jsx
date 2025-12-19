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
    <div className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-400 transition-all hover:shadow-md bg-white">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
        <div className="flex-1">
          {/* Encabezado */}
          <div className="flex items-start gap-2 mb-2">
            <span className="text-gray-400 font-mono text-sm mt-1">#{index + 1}</span>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-gray-800">
                {curso.nombre}
              </h3>
              {curso.objetivo && curso.objetivo !== 'Sin descripción' && (
                <p className="text-sm text-gray-600 mt-1">
                  {curso.objetivo}
                </p>
              )}
            </div>
          </div>

          {/* Información principal */}
          <div className="flex flex-wrap gap-2 text-xs mb-3">
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-semibold">
              📍 {curso.vp}
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
              🏢 {curso.gerencia}
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
              ⏱️ {curso.horas}h
            </span>
            {totalParticipantes > 0 && (
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">
                👥 {totalParticipantes} participantes
              </span>
            )}
            {Number(curso.mesInicio) > 0 && (
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full">
                📅 {obtenerNombreMes(curso.mesInicio)}
              </span>
            )}
          </div>

          {/* Información adicional */}
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
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
