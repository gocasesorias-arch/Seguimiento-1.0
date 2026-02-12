import { useMemo } from 'react'
import CalendarioCelda from './CalendarioCelda'
import { ANIO, DIAS_SEMANA, FERIADOS } from '../../data/calendarioConstants'

function generarCeldasMes(mes) {
  const primerDia = new Date(ANIO, mes, 1)
  const diasEnMes = new Date(ANIO, mes + 1, 0).getDate()
  // Monday-first: (getDay() + 6) % 7
  const offsetInicio = (primerDia.getDay() + 6) % 7

  const celdas = []
  // Leading empty cells
  for (let i = 0; i < offsetInicio; i++) {
    celdas.push({ dia: null, fecha: null, esMesActual: false })
  }
  // Days of the month
  for (let d = 1; d <= diasEnMes; d++) {
    const fecha = `${ANIO}-${String(mes + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const diaSemana = (offsetInicio + d - 1) % 7 // 0=Mon, 5=Sat, 6=Sun
    celdas.push({
      dia: d,
      fecha,
      esMesActual: true,
      esFinDeSemana: diaSemana >= 5,
      esDomingo: diaSemana === 6
    })
  }
  // Trailing empty cells to fill the last row
  while (celdas.length % 7 !== 0) {
    celdas.push({ dia: null, fecha: null, esMesActual: false })
  }
  return celdas
}

const CalendarioGrid = ({ mesActual, cursos, onAddCurso, onCursoClick }) => {
  const celdas = useMemo(() => generarCeldasMes(mesActual), [mesActual])

  // Build course lookup map by date
  const cursosPorFecha = useMemo(() => {
    const map = new Map()
    cursos.forEach(curso => {
      const key = curso.fecha
      if (!map.has(key)) map.set(key, [])
      map.get(key).push(curso)
    })
    return map
  }, [cursos])

  return (
    <div className="calendario-print-full">
      {/* Day headers */}
      <div className="grid grid-cols-7 gap-px mb-px">
        {DIAS_SEMANA.map((dia, i) => (
          <div
            key={dia}
            className={`text-center py-2 text-xs font-bold rounded-t ${
              i >= 5
                ? 'bg-[#1B3D6B] text-amber-300'
                : 'bg-[#132B4A] text-slate-200'
            }`}
          >
            {dia}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-px bg-slate-200 rounded-b-xl overflow-hidden">
        {celdas.map((celda, i) => {
          const feriadoInfo = celda.fecha ? FERIADOS[celda.fecha] : null
          const cursosDia = celda.fecha ? (cursosPorFecha.get(celda.fecha) || []) : []

          return (
            <CalendarioCelda
              key={i}
              dia={celda.dia}
              fecha={celda.fecha}
              esFeriado={!!feriadoInfo}
              feriadoInfo={feriadoInfo}
              cursos={cursosDia}
              esFinDeSemana={celda.esFinDeSemana}
              esDomingo={celda.esDomingo}
              esMesActual={celda.esMesActual}
              onAddCurso={onAddCurso}
              onCursoClick={onCursoClick}
            />
          )
        })}
      </div>
    </div>
  )
}

export default CalendarioGrid
