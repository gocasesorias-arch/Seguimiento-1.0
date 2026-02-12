import { useMemo } from 'react'
import { MESES, MESES_CORTOS, FERIADOS } from '../../data/calendarioConstants'
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon, MenuIcon, PlusIcon } from './CalendarioIcons'

const CalendarioHeader = ({ mesActual, onMesChange, cursos, onToggleSidebar, onNewCurso }) => {
  // Count courses per month for pills
  const cursosPorMes = useMemo(() => {
    const counts = new Array(12).fill(0)
    cursos.forEach(c => {
      const m = parseInt(c.fecha.split('-')[1]) - 1
      if (m >= 0 && m < 12) counts[m]++
    })
    return counts
  }, [cursos])

  // Stats for current month
  const stats = useMemo(() => {
    const cursosDelMes = cursos.filter(c => {
      const m = parseInt(c.fecha.split('-')[1]) - 1
      return m === mesActual
    })
    const feriadosDelMes = Object.keys(FERIADOS).filter(f => {
      const m = parseInt(f.split('-')[1]) - 1
      return m === mesActual
    })
    return {
      totalCursos: cursosDelMes.length,
      totalParticipantes: cursosDelMes.reduce((sum, c) => sum + (c.participantes || 0), 0),
      proveedoresUnicos: new Set(cursosDelMes.map(c => c.proveedor)).size,
      feriados: feriadosDelMes.length
    }
  }, [cursos, mesActual])

  return (
    <div className="calendario-no-print">
      {/* Gradient header */}
      <div className="bg-gradient-to-r from-[#0C1929] to-[#1B3D6B] rounded-2xl p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden text-white/80 hover:text-white p-1"
            >
              <MenuIcon size={20} />
            </button>
            <CalendarIcon size={22} className="text-amber-400" />
            <div>
              <h1 className="text-lg font-bold text-white">Calendario de Capacitacion 2026</h1>
              <p className="text-xs text-slate-300">Plan Anual de Capacitacion — PAC 2026</p>
            </div>
          </div>
          <button
            onClick={onNewCurso}
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-slate-900 text-sm rounded-xl hover:bg-amber-400 transition-colors font-semibold shadow-sm"
          >
            <PlusIcon size={16} /> Nuevo Curso
          </button>
        </div>

        {/* Month pills */}
        <div className="flex gap-1 flex-wrap">
          {MESES_CORTOS.map((mes, i) => (
            <button
              key={mes}
              onClick={() => onMesChange(i)}
              className={`relative px-3 py-1.5 text-xs rounded-lg font-semibold transition-all ${
                i === mesActual
                  ? 'bg-white text-[#0C1929] shadow-sm'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              {mes}
              {cursosPorMes[i] > 0 && (
                <span className={`absolute -top-1 -right-1 w-4 h-4 text-[0.5rem] rounded-full flex items-center justify-center font-bold ${
                  i === mesActual
                    ? 'bg-blue-600 text-white'
                    : 'bg-amber-500 text-slate-900'
                }`}>
                  {cursosPorMes[i]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Month navigation + stats bar */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        {/* Month nav */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onMesChange(Math.max(0, mesActual - 1))}
            disabled={mesActual === 0}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 disabled:text-slate-300 disabled:hover:bg-transparent transition-colors"
          >
            <ChevronLeftIcon size={18} />
          </button>
          <h2 className="text-xl font-bold text-slate-800 min-w-[180px] text-center">
            {MESES[mesActual]} 2026
          </h2>
          <button
            onClick={() => onMesChange(Math.min(11, mesActual + 1))}
            disabled={mesActual === 11}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 disabled:text-slate-300 disabled:hover:bg-transparent transition-colors"
          >
            <ChevronRightIcon size={18} />
          </button>
        </div>

        {/* Stats */}
        <div className="flex gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-200">
            <span className="text-sm font-bold text-blue-700">{stats.totalCursos}</span>
            <span className="text-xs text-blue-600">Cursos</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 rounded-lg border border-emerald-200">
            <span className="text-sm font-bold text-emerald-700">{stats.totalParticipantes}</span>
            <span className="text-xs text-emerald-600">Participantes</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 rounded-lg border border-purple-200">
            <span className="text-sm font-bold text-purple-700">{stats.proveedoresUnicos}</span>
            <span className="text-xs text-purple-600">Proveedores</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 rounded-lg border border-amber-200">
            <span className="text-sm font-bold text-amber-700">{stats.feriados}</span>
            <span className="text-xs text-amber-600">Feriados</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CalendarioHeader
