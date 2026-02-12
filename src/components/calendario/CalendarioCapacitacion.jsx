import { useState, useEffect, useCallback } from 'react'
import { useCalendarioCursos } from '../../hooks/useCalendarioCursos'
import CalendarioHeader from './CalendarioHeader'
import CalendarioSidebar from './CalendarioSidebar'
import CalendarioGrid from './CalendarioGrid'
import CursoFormModal from './CursoFormModal'

const CalendarioCapacitacion = () => {
  const { cursos, addCurso, updateCurso, deleteCurso, clearAll, exportarJSON, importarJSON } = useCalendarioCursos()

  const [mesActual, setMesActual] = useState(() => new Date().getMonth())
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [cursoEditando, setCursoEditando] = useState(null)
  const [fechaPrefill, setFechaPrefill] = useState(null)
  const [isWideScreen, setIsWideScreen] = useState(window.innerWidth >= 1024)

  // Responsive breakpoint
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const handler = (e) => setIsWideScreen(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (modalOpen) return
      const tag = e.target.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if (e.key === 'ArrowLeft') setMesActual(prev => Math.max(0, prev - 1))
      if (e.key === 'ArrowRight') setMesActual(prev => Math.min(11, prev + 1))
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [modalOpen])

  const openCreateModal = useCallback((fecha) => {
    setCursoEditando(null)
    setFechaPrefill(fecha || null)
    setModalOpen(true)
  }, [])

  const openEditModal = useCallback((curso) => {
    setCursoEditando(curso)
    setFechaPrefill(null)
    setModalOpen(true)
  }, [])

  const handleSave = useCallback((data) => {
    if (data.id) {
      const { id, ...updates } = data
      updateCurso(id, updates)
    } else {
      addCurso(data)
    }
    setModalOpen(false)
    setCursoEditando(null)
    setFechaPrefill(null)
  }, [addCurso, updateCurso])

  const handleDelete = useCallback((id) => {
    deleteCurso(id)
    setModalOpen(false)
    setCursoEditando(null)
  }, [deleteCurso])

  const handleSelectFromSidebar = useCallback((curso) => {
    // Navigate to the course's month
    const mes = parseInt(curso.fecha.split('-')[1]) - 1
    setMesActual(mes)
    // On mobile, close sidebar
    if (!isWideScreen) setSidebarOpen(false)
  }, [isWideScreen])

  const handleImport = useCallback((jsonString, mode) => {
    const result = importarJSON(jsonString, mode)
    if (result.success) {
      window.alert(`${result.count} cursos importados correctamente`)
    } else {
      window.alert(`Error al importar: ${result.error}`)
    }
  }, [importarJSON])

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="flex">
        {/* Sidebar */}
        <CalendarioSidebar
          cursos={cursos}
          mesActual={mesActual}
          onSelectCurso={handleSelectFromSidebar}
          onAddCurso={() => openCreateModal()}
          onClearAll={clearAll}
          onExport={exportarJSON}
          onImport={handleImport}
          isOpen={isWideScreen || sidebarOpen}
          onToggle={() => setSidebarOpen(prev => !prev)}
        />

        {/* Main content */}
        <div className="flex-1 min-w-0 p-4">
          <CalendarioHeader
            mesActual={mesActual}
            onMesChange={setMesActual}
            cursos={cursos}
            onToggleSidebar={() => setSidebarOpen(prev => !prev)}
            onNewCurso={() => openCreateModal()}
          />

          <CalendarioGrid
            mesActual={mesActual}
            cursos={cursos}
            onAddCurso={openCreateModal}
            onCursoClick={openEditModal}
          />
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <CursoFormModal
          curso={cursoEditando}
          fechaPrefill={fechaPrefill}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => { setModalOpen(false); setCursoEditando(null); setFechaPrefill(null) }}
        />
      )}
    </div>
  )
}

export default CalendarioCapacitacion
