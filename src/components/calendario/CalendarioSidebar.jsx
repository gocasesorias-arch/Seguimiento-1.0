import { useState, useMemo, useRef } from 'react'
import { MESES, getVPColors } from '../../data/calendarioConstants'
import { SearchIcon, PlusIcon, TrashIcon, DownloadIcon, UploadIcon, XIcon } from './CalendarioIcons'

const CalendarioSidebar = ({ cursos, mesActual, onSelectCurso, onAddCurso, onClearAll, onExport, onImport, isOpen, onToggle }) => {
  const [tab, setTab] = useState('all') // 'all' | 'month' | 'upcoming'
  const [busqueda, setBusqueda] = useState('')
  const fileInputRef = useRef(null)

  const cursosFiltrados = useMemo(() => {
    let lista = [...cursos]

    // Tab filter
    if (tab === 'month') {
      lista = lista.filter(c => {
        const mes = parseInt(c.fecha.split('-')[1]) - 1
        return mes === mesActual
      })
    } else if (tab === 'upcoming') {
      const hoy = new Date().toISOString().slice(0, 10)
      lista = lista.filter(c => c.fecha >= hoy)
    }

    // Search filter
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase()
      lista = lista.filter(c =>
        c.nombre.toLowerCase().includes(q) ||
        c.proveedor.toLowerCase().includes(q) ||
        c.vp.toLowerCase().includes(q) ||
        c.gerencia.toLowerCase().includes(q)
      )
    }

    // Sort by date then time
    lista.sort((a, b) => a.fecha.localeCompare(b.fecha) || a.hora.localeCompare(b.hora))

    return lista
  }, [cursos, tab, busqueda, mesActual])

  const handleFileImport = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const mode = window.confirm('Reemplazar cursos existentes?\n\nAceptar = Reemplazar\nCancelar = Agregar a existentes')
        ? 'replace' : 'merge'
      onImport(ev.target.result, mode)
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleClearAll = () => {
    if (window.confirm('Eliminar TODOS los cursos del calendario?\n\nEsta accion no se puede deshacer.')) {
      onClearAll()
    }
  }

  const tabClass = (t) =>
    `px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
      tab === t
        ? 'bg-blue-600 text-white'
        : 'text-slate-600 hover:bg-slate-100'
    }`

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={onToggle}
        />
      )}

      <div className={`
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        fixed top-0 left-0 h-full w-[420px] max-w-[90vw] z-40 bg-white border-r border-slate-200 shadow-xl
        transition-transform duration-300
        lg:relative lg:translate-x-0 lg:shadow-none lg:z-auto
        flex flex-col calendario-no-print
      `}>
        {/* Sidebar header */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-slate-800">
              Cursos Programados
              <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">{cursos.length}</span>
            </h2>
            <button onClick={onToggle} className="lg:hidden text-slate-400 hover:text-slate-600">
              <XIcon size={18} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-3">
            <button onClick={() => setTab('all')} className={tabClass('all')}>Todos</button>
            <button onClick={() => setTab('month')} className={tabClass('month')}>{MESES[mesActual]}</button>
            <button onClick={() => setTab('upcoming')} className={tabClass('upcoming')}>Proximos</button>
          </div>

          {/* Search */}
          <div className="relative">
            <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar curso, proveedor, VP..."
              className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
            />
          </div>
        </div>

        {/* Course list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {cursosFiltrados.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <p className="text-sm">No hay cursos</p>
              <p className="text-xs mt-1">
                {busqueda ? 'Intenta otra busqueda' : 'Agrega un curso para comenzar'}
              </p>
            </div>
          ) : (
            cursosFiltrados.map(curso => {
              const colors = getVPColors(curso.vp)
              return (
                <button
                  key={curso.id}
                  onClick={() => onSelectCurso(curso)}
                  className="w-full text-left p-3 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">{curso.nombre}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-1.5 py-0.5 text-[0.6rem] font-semibold rounded border ${colors.badge}`}>
                          {curso.vp}
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[0.65rem] text-slate-500">{curso.fecha}</p>
                      <p className="text-[0.65rem] text-slate-400">{curso.hora}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 text-[0.6rem] text-slate-500">
                    <span>{curso.proveedor}</span>
                    <span>{curso.participantes} participantes</span>
                    <span>{curso.duracion}h</span>
                  </div>
                </button>
              )
            })
          )}
        </div>

        {/* Sidebar footer */}
        <div className="p-3 border-t border-slate-200 space-y-2">
          <div className="flex gap-2">
            <button
              onClick={() => onAddCurso()}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              <PlusIcon size={14} /> Agregar Curso
            </button>
            <button
              onClick={handleClearAll}
              className="px-3 py-2 text-red-500 hover:bg-red-50 text-xs rounded-lg transition-colors"
              title="Limpiar todo"
            >
              <TrashIcon size={14} />
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onExport}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 text-xs rounded-lg hover:bg-slate-200 transition-colors font-medium"
            >
              <DownloadIcon size={12} /> Exportar
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 text-xs rounded-lg hover:bg-slate-200 transition-colors font-medium"
            >
              <UploadIcon size={12} /> Importar
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileImport}
              className="hidden"
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default CalendarioSidebar
