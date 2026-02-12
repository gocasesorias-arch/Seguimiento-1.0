import { useState, useEffect, useCallback } from 'react'
import { CURSOS_DEMO } from '../data/calendarioConstants'

const STORAGE_KEY = 'pac2026_courses'

export const useCalendarioCursos = () => {
  const [cursos, setCursos] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch (e) {
      console.error('Error loading calendar courses:', e)
    }
    return CURSOS_DEMO
  })

  // Persist to localStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cursos))
  }, [cursos])

  const generarId = () => {
    const timestamp = Date.now()
    const random = Math.random().toString(16).substring(2, 6)
    return `c_${timestamp}_${random}`
  }

  const addCurso = useCallback((cursoData) => {
    const nuevo = { ...cursoData, id: generarId() }
    setCursos(prev => [...prev, nuevo])
    return nuevo
  }, [])

  const updateCurso = useCallback((id, updates) => {
    setCursos(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c))
  }, [])

  const deleteCurso = useCallback((id) => {
    setCursos(prev => prev.filter(c => c.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setCursos([])
  }, [])

  const exportarJSON = useCallback(() => {
    const exportData = {
      version: 1,
      year: 2026,
      exportedAt: new Date().toISOString(),
      courses: cursos
    }
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `PAC_2026_Cursos_${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [cursos])

  const importarJSON = useCallback((jsonString, mode = 'replace') => {
    try {
      const data = JSON.parse(jsonString)
      let coursesToImport

      if (Array.isArray(data)) {
        coursesToImport = data
      } else if (data.courses && Array.isArray(data.courses)) {
        coursesToImport = data.courses
      } else {
        return { success: false, error: 'Formato JSON invalido' }
      }

      // Validate each course has required fields
      const valid = coursesToImport.every(c => c.nombre && c.fecha && c.vp)
      if (!valid) {
        return { success: false, error: 'Algunos cursos no tienen campos requeridos' }
      }

      if (mode === 'replace') {
        setCursos(coursesToImport)
      } else {
        setCursos(prev => [...prev, ...coursesToImport])
      }

      return { success: true, count: coursesToImport.length }
    } catch (e) {
      return { success: false, error: e.message }
    }
  }, [])

  return { cursos, addCurso, updateCurso, deleteCurso, clearAll, exportarJSON, importarJSON }
}
