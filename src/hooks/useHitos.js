import { useState, useEffect } from 'react'
import {
  Circle, CheckCircle, Clock, AlertCircle,
  XCircle, Award, ChevronRight, ChevronLeft
} from 'lucide-react'

/**
 * Hook para gestión de hitos
 */
export const useHitos = (cursos) => {
  const [progresoHitos, setProgresoHitos] = useState({})

  // Cargar progreso desde localStorage
  useEffect(() => {
    const saved = localStorage.getItem('progresoHitos')
    if (saved) {
      try {
        setProgresoHitos(JSON.parse(saved))
      } catch (e) {
        console.error('Error cargando progreso:', e)
      }
    }
  }, [])

  // Guardar progreso en localStorage
  useEffect(() => {
    if (Object.keys(progresoHitos).length > 0) {
      localStorage.setItem('progresoHitos', JSON.stringify(progresoHitos))
    }
  }, [progresoHitos])

  const toggleHito = (cursoIndex, hitoIndex) => {
    setProgresoHitos(prev => {
      const cursoProgreso = prev[cursoIndex] || {
        hitos: [false, false, false, false],
        estadoActual: cursos[cursoIndex]?.estado || cursos[cursoIndex]?.Column4
      }

      const nuevosHitos = [...cursoProgreso.hitos]
      nuevosHitos[hitoIndex] = !nuevosHitos[hitoIndex]

      // Si todos los hitos están completos, avanzar al siguiente estado
      const todosCompletados = nuevosHitos.every(h => h)
      let nuevoEstado = cursoProgreso.estadoActual

      if (todosCompletados) {
        const estadoActual = cursoProgreso.estadoActual
        const flujoEstados = ['Pendiente', 'Planificado', 'En Proceso', 'Programado', 'En Ejecución', 'Realizado']
        const indexActual = flujoEstados.indexOf(estadoActual)

        if (indexActual >= 0 && indexActual < flujoEstados.length - 1) {
          nuevoEstado = flujoEstados[indexActual + 1]
          // Reset hitos para el nuevo estado
          return {
            ...prev,
            [cursoIndex]: {
              hitos: [false, false, false, false],
              estadoActual: nuevoEstado
            }
          }
        }
      }

      return {
        ...prev,
        [cursoIndex]: {
          ...cursoProgreso,
          hitos: nuevosHitos,
          estadoActual: nuevoEstado
        }
      }
    })
  }

  const cambiarEstadoEspecial = (cursoIndex, nuevoEstado) => {
    setProgresoHitos(prev => ({
      ...prev,
      [cursoIndex]: {
        hitos: [false, false, false, false],
        estadoActual: nuevoEstado
      }
    }))
  }

  return { progresoHitos, toggleHito, cambiarEstadoEspecial }
}

/**
 * Obtener hitos según el estado
 */
export const obtenerHitosPorEstado = (estado) => {
  const hitosPorEstado = {
    'Pendiente': [
      'Identificar necesidad de capacitación',
      'Definir objetivos de aprendizaje',
      'Estimar presupuesto inicial',
      'Obtener aprobación preliminar'
    ],
    'Planificado': [
      'Seleccionar proveedor OTEC',
      'Definir contenidos y metodología',
      'Establecer fechas y horarios',
      'Confirmar participantes'
    ],
    'En Proceso': [
      'Preparar materiales de capacitación',
      'Coordinar logística (sala, equipos)',
      'Enviar convocatorias a participantes',
      'Validar requisitos técnicos'
    ],
    'Programado': [
      'Confirmar asistencia de participantes',
      'Realizar pruebas de conexión (si es online)',
      'Preparar evaluaciones pre-curso',
      'Coordinar con facilitador/instructor'
    ],
    'En Ejecución': [
      'Registro de asistencia diaria',
      'Seguimiento de avance del curso',
      'Recopilación de feedback intermedio',
      'Aplicación de evaluaciones'
    ],
    'Realizado': [
      'Aplicar evaluación final',
      'Procesar certificados de aprobación',
      'Recopilar encuestas de satisfacción',
      'Generar informe de cierre'
    ],
    'Suspendido': [
      'Documentar motivo de suspensión',
      'Notificar a participantes',
      'Evaluar posibilidad de retomar',
      'Actualizar registros'
    ],
    'Postergado': [
      'Documentar motivo de postergación',
      'Definir nueva fecha tentativa',
      'Notificar a involucrados',
      'Mantener recursos reservados'
    ]
  }

  return hitosPorEstado[estado] || [
    'Hito 1',
    'Hito 2',
    'Hito 3',
    'Hito 4'
  ]
}

/**
 * Obtener color según estado
 */
export const obtenerColorPorEstado = (estado) => {
  const colores = {
    'Pendiente': 'bg-gray-100 text-gray-700 border-gray-300',
    'Planificado': 'bg-blue-100 text-blue-700 border-blue-300',
    'En Proceso': 'bg-indigo-100 text-indigo-700 border-indigo-300',
    'Programado': 'bg-yellow-100 text-yellow-700 border-yellow-300',
    'En Ejecución': 'bg-orange-100 text-orange-700 border-orange-300',
    'Realizado': 'bg-green-100 text-green-700 border-green-300',
    'Suspendido': 'bg-red-100 text-red-700 border-red-300',
    'Postergado': 'bg-purple-100 text-purple-700 border-purple-300'
  }

  return colores[estado] || 'bg-gray-100 text-gray-700 border-gray-300'
}

/**
 * Definición de hitos del sistema
 */
export const hitos = [
  {
    id: 1,
    nombre: 'Pendiente',
    estado: 'Pendiente',
    icon: Circle,
    color: 'bg-gray-100 border-gray-400 text-gray-700',
    descripcion: 'Curso identificado pero no planificado',
    subHitos: [
      'Identificar necesidad',
      'Definir objetivos',
      'Estimar presupuesto',
      'Obtener aprobación'
    ]
  },
  {
    id: 2,
    nombre: 'Planificado',
    estado: 'Planificado',
    icon: CheckCircle,
    color: 'bg-blue-100 border-blue-400 text-blue-700',
    descripcion: 'Curso planificado y aprobado',
    subHitos: [
      'Seleccionar OTEC',
      'Definir contenidos',
      'Establecer fechas',
      'Confirmar participantes'
    ]
  },
  {
    id: 3,
    nombre: 'En Preparación',
    estado: 'En Proceso',
    icon: Clock,
    color: 'bg-indigo-100 border-indigo-400 text-indigo-700',
    descripcion: 'Preparando materiales y logística',
    subHitos: [
      'Preparar materiales',
      'Coordinar logística',
      'Enviar convocatorias',
      'Validar requisitos'
    ]
  },
  {
    id: 4,
    nombre: 'Programado',
    estado: 'Programado',
    icon: AlertCircle,
    color: 'bg-yellow-100 border-yellow-400 text-yellow-700',
    descripcion: 'Curso programado con fecha definida',
    subHitos: [
      'Confirmar asistencia',
      'Pruebas de conexión',
      'Evaluaciones pre-curso',
      'Coordinar facilitador'
    ]
  },
  {
    id: 5,
    nombre: 'En Ejecución',
    estado: 'En Ejecución',
    icon: Clock,
    color: 'bg-orange-100 border-orange-400 text-orange-700',
    descripcion: 'Curso en desarrollo',
    subHitos: [
      'Registro asistencia',
      'Seguimiento avance',
      'Feedback intermedio',
      'Aplicar evaluaciones'
    ]
  },
  {
    id: 6,
    nombre: 'Realizado',
    estado: 'Realizado',
    icon: Award,
    color: 'bg-green-100 border-green-400 text-green-700',
    descripcion: 'Curso finalizado exitosamente',
    subHitos: [
      'Evaluación final',
      'Procesar certificados',
      'Encuestas satisfacción',
      'Informe de cierre'
    ]
  }
]

/**
 * Estados especiales (fuera del flujo normal)
 */
export const estadosEspeciales = [
  {
    nombre: 'Suspendido',
    estado: 'Suspendido',
    icon: XCircle,
    color: 'bg-red-100 border-red-400 text-red-700',
    descripcion: 'Curso suspendido temporalmente'
  },
  {
    nombre: 'Postergado',
    estado: 'Postergado',
    icon: Clock,
    color: 'bg-purple-100 border-purple-400 text-purple-700',
    descripcion: 'Curso reprogramado para otra fecha'
  }
]
