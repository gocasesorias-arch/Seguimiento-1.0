import CursoChip from './CursoChip'
import { PlusIcon } from './CalendarioIcons'

const MAX_CHIPS = 3

const CalendarioCelda = ({ dia, fecha, esFeriado, feriadoInfo, cursos, esFinDeSemana, esDomingo, esMesActual, onAddCurso, onCursoClick }) => {
  if (!esMesActual) {
    return <div className="bg-slate-50/50 min-h-[90px] rounded" />
  }

  const cursosOrdenados = [...cursos].sort((a, b) => a.hora.localeCompare(b.hora))
  const visibles = cursosOrdenados.slice(0, MAX_CHIPS)
  const restantes = cursosOrdenados.length - MAX_CHIPS

  let bgClass = 'bg-white'
  if (esFeriado) {
    bgClass = feriadoInfo?.regional ? 'bg-amber-100/40' : 'bg-amber-50'
  } else if (esFinDeSemana) {
    bgClass = 'bg-slate-50'
  }

  return (
    <div className={`group/celda relative ${bgClass} min-h-[90px] rounded border border-slate-200 hover:border-blue-400 transition-colors p-1 flex flex-col`}>
      {/* Header: day number + holiday label */}
      <div className="flex items-start justify-between mb-0.5">
        <span className={`text-xs font-bold ${esDomingo ? 'text-red-500' : 'text-slate-700'}`}>
          {dia}
        </span>
        {esFeriado && (
          <span className="text-[0.5rem] leading-tight text-amber-700 bg-amber-200/60 px-1 py-0.5 rounded max-w-[80%] text-right truncate">
            {feriadoInfo.nombre}{feriadoInfo.irrenunciable ? ' (I)' : ''}
          </span>
        )}
      </div>

      {/* Course chips */}
      <div className="flex-1 space-y-0.5">
        {visibles.map(curso => (
          <CursoChip key={curso.id} curso={curso} onClick={onCursoClick} />
        ))}
        {restantes > 0 && (
          <button
            onClick={(e) => { e.stopPropagation(); onCursoClick(cursosOrdenados[MAX_CHIPS]) }}
            className="text-[0.55rem] text-blue-600 hover:text-blue-800 font-medium pl-1"
          >
            +{restantes} mas
          </button>
        )}
      </div>

      {/* Add button on hover */}
      <button
        onClick={() => onAddCurso(fecha)}
        className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center opacity-0 group-hover/celda:opacity-100 transition-opacity shadow-sm hover:bg-blue-600"
        title="Agregar curso"
      >
        <PlusIcon size={12} />
      </button>
    </div>
  )
}

export default CalendarioCelda
