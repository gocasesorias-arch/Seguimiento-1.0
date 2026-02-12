import { getVPColors, FERIADOS } from '../../data/calendarioConstants'

const CursoChip = ({ curso, onClick }) => {
  const colors = getVPColors(curso.vp)
  const esFeriado = FERIADOS[curso.fecha]

  return (
    <div className="group/chip relative">
      <button
        onClick={(e) => { e.stopPropagation(); onClick(curso) }}
        className={`w-full text-left flex items-center gap-1 px-1.5 py-0.5 rounded border-l-[3px] ${colors.borderLeft} bg-white hover:bg-slate-50 transition-colors cursor-pointer text-[0.6rem] leading-tight shadow-sm`}
      >
        <span className="font-mono text-[0.55rem] text-slate-500 shrink-0">{curso.hora}</span>
        <span className={`${colors.text} font-medium truncate flex-1`}>{curso.nombre}</span>
        <span className="text-slate-400 text-[0.55rem] shrink-0">{curso.participantes}</span>
      </button>

      {/* Tooltip */}
      <div className="absolute bottom-full left-0 mb-1.5 hidden group-hover/chip:block z-50 pointer-events-none">
        <div className="bg-slate-800 text-white text-xs rounded-lg p-3 shadow-xl w-56">
          <p className="font-semibold mb-1.5">{curso.nombre}</p>
          <div className="space-y-0.5 text-slate-300 text-[0.65rem]">
            <p>Proveedor: {curso.proveedor}</p>
            <p>Fecha: {curso.fecha} | Hora: {curso.hora}</p>
            <p>Duracion: {curso.duracion}h | Participantes: {curso.participantes}</p>
            <p>VP: {curso.vp}</p>
            <p>Gerencia: {curso.gerencia}</p>
          </div>
          {esFeriado && (
            <div className="mt-1.5 pt-1.5 border-t border-slate-600 text-amber-300 text-[0.65rem]">
              Curso en feriado: {esFeriado.nombre}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CursoChip
