import { useState, useEffect, useRef } from 'react'
import { XIcon } from './CalendarioIcons'
import { VP_OPTIONS } from '../../data/calendarioConstants'

const EMPTY_FORM = {
  nombre: '',
  proveedor: '',
  fecha: '',
  hora: '09:00',
  participantes: '',
  duracion: '8',
  vp: '',
  gerencia: ''
}

const CursoFormModal = ({ curso, fechaPrefill, onSave, onDelete, onClose }) => {
  const isEdit = !!curso
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [confirmDelete, setConfirmDelete] = useState(false)
  const modalRef = useRef(null)

  useEffect(() => {
    if (curso) {
      setForm({
        nombre: curso.nombre || '',
        proveedor: curso.proveedor || '',
        fecha: curso.fecha || '',
        hora: curso.hora || '09:00',
        participantes: String(curso.participantes || ''),
        duracion: String(curso.duracion || '8'),
        vp: curso.vp || '',
        gerencia: curso.gerencia || ''
      })
    } else if (fechaPrefill) {
      setForm({ ...EMPTY_FORM, fecha: fechaPrefill })
    }
  }, [curso, fechaPrefill])

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  const validate = () => {
    const e = {}
    if (!form.nombre || form.nombre.length < 3) e.nombre = 'Nombre requerido (min 3 caracteres)'
    if (!form.proveedor || form.proveedor.length < 2) e.proveedor = 'Proveedor requerido'
    if (!form.fecha || !/^2026-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(form.fecha)) e.fecha = 'Fecha valida en 2026 requerida'
    if (!form.hora || !/^\d{2}:\d{2}$/.test(form.hora)) e.hora = 'Hora invalida'
    const p = parseInt(form.participantes)
    if (!p || p < 1 || p > 999) e.participantes = 'Entre 1 y 999'
    const d = parseInt(form.duracion)
    if (!d || d < 1 || d > 200) e.duracion = 'Entre 1 y 200 horas'
    if (!form.vp) e.vp = 'Seleccione VP'
    if (!form.gerencia || form.gerencia.length < 2) e.gerencia = 'Gerencia requerida'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSave({
      ...(curso ? { id: curso.id } : {}),
      nombre: form.nombre.trim(),
      proveedor: form.proveedor.trim(),
      fecha: form.fecha,
      hora: form.hora,
      participantes: parseInt(form.participantes),
      duracion: parseInt(form.duracion),
      vp: form.vp,
      gerencia: form.gerencia.trim()
    })
  }

  const handleBackdropClick = (e) => {
    if (e.target === modalRef.current) onClose()
  }

  const inputClass = (field) =>
    `w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-colors ${
      errors[field]
        ? 'border-red-300 focus:ring-red-100 focus:border-red-500'
        : 'border-slate-200 focus:ring-blue-100 focus:border-blue-500'
    }`

  return (
    <div
      ref={modalRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 p-4"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-800">
            {isEdit ? 'Editar Curso' : 'Nuevo Curso'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <XIcon size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* Section: Informacion del Curso */}
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Informacion del Curso</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre del Curso</label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => handleChange('nombre', e.target.value)}
                  className={inputClass('nombre')}
                  placeholder="Ej: Operacion Segura de Grua Puente"
                  maxLength={200}
                />
                {errors.nombre && <p className="text-xs text-red-500 mt-1">{errors.nombre}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Proveedor</label>
                <input
                  type="text"
                  value={form.proveedor}
                  onChange={(e) => handleChange('proveedor', e.target.value)}
                  className={inputClass('proveedor')}
                  placeholder="Ej: ASIMET"
                  maxLength={100}
                />
                {errors.proveedor && <p className="text-xs text-red-500 mt-1">{errors.proveedor}</p>}
              </div>
            </div>
          </div>

          {/* Section: Programacion */}
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Programacion</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Fecha</label>
                <input
                  type="date"
                  value={form.fecha}
                  onChange={(e) => handleChange('fecha', e.target.value)}
                  className={inputClass('fecha')}
                  min="2026-01-01"
                  max="2026-12-31"
                />
                {errors.fecha && <p className="text-xs text-red-500 mt-1">{errors.fecha}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Hora</label>
                <input
                  type="time"
                  value={form.hora}
                  onChange={(e) => handleChange('hora', e.target.value)}
                  className={inputClass('hora')}
                />
                {errors.hora && <p className="text-xs text-red-500 mt-1">{errors.hora}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Participantes</label>
                <input
                  type="number"
                  value={form.participantes}
                  onChange={(e) => handleChange('participantes', e.target.value)}
                  className={inputClass('participantes')}
                  min="1"
                  max="999"
                  placeholder="20"
                />
                {errors.participantes && <p className="text-xs text-red-500 mt-1">{errors.participantes}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Duracion (horas)</label>
                <input
                  type="number"
                  value={form.duracion}
                  onChange={(e) => handleChange('duracion', e.target.value)}
                  className={inputClass('duracion')}
                  min="1"
                  max="200"
                  placeholder="8"
                />
                {errors.duracion && <p className="text-xs text-red-500 mt-1">{errors.duracion}</p>}
              </div>
            </div>
          </div>

          {/* Section: Organizacion */}
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Organizacion</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Vicepresidencia</label>
                <select
                  value={form.vp}
                  onChange={(e) => handleChange('vp', e.target.value)}
                  className={inputClass('vp')}
                >
                  <option value="">Seleccionar VP...</option>
                  {VP_OPTIONS.map(vp => (
                    <option key={vp} value={vp}>{vp}</option>
                  ))}
                </select>
                {errors.vp && <p className="text-xs text-red-500 mt-1">{errors.vp}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Gerencia</label>
                <input
                  type="text"
                  value={form.gerencia}
                  onChange={(e) => handleChange('gerencia', e.target.value)}
                  className={inputClass('gerencia')}
                  placeholder="Ej: Gerencia de Operaciones Mina"
                  maxLength={150}
                />
                {errors.gerencia && <p className="text-xs text-red-500 mt-1">{errors.gerencia}</p>}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-200">
            {isEdit ? (
              <div>
                {confirmDelete ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-red-600">Confirmar?</span>
                    <button
                      type="button"
                      onClick={() => onDelete(curso.id)}
                      className="px-3 py-1.5 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors font-semibold"
                    >
                      Eliminar
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(false)}
                      className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs rounded-lg hover:bg-slate-200 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    className="px-3 py-1.5 text-red-600 hover:bg-red-50 text-xs rounded-lg transition-colors font-medium"
                  >
                    Eliminar curso
                  </button>
                )}
              </div>
            ) : (
              <div />
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 text-slate-600 text-sm rounded-xl hover:bg-slate-200 transition-colors font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-700 transition-colors font-semibold"
              >
                {isEdit ? 'Guardar Cambios' : 'Crear Curso'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CursoFormModal
