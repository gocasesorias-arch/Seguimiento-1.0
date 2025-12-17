// Mapping for Month Numbers to Names
export const monthMap = {
  1: 'Enero', 2: 'Febrero', 3: 'Marzo', 4: 'Abril',
  5: 'Mayo', 6: 'Junio', 7: 'Julio', 8: 'Agosto',
  9: 'Septiembre', 10: 'Octubre', 11: 'Noviembre', 12: 'Diciembre'
};

// Estados de cursos
export const ESTADOS = {
  PLANIFICACION: 'Planificación',
  EN_PROCESO: 'En Proceso',
  EN_EJECUCION: 'En Ejecución',
  REALIZADO: 'Realizado',
  SUSPENDIDO: 'Suspendido',
  POSTERGADO: 'Postergado'
};

// Hitos por estado
export const hitosPorEstado = {
  [ESTADOS.PLANIFICACION]: [
    "Definición de alcance y objetivos del curso",
    "Elaboración de presupuesto y recursos necesarios",
    "Identificación de participantes y responsables",
    "Aprobación del plan y calendario preliminar"
  ],
  [ESTADOS.EN_PROCESO]: [
    "Revisión de turnos y condiciones operativas",
    "Estructuración de fechas de ejecución",
    "Validación final de nóminas",
    "Preparación de materiales y recursos"
  ],
  [ESTADOS.EN_EJECUCION]: [
    "Confirmación de asistencia de participantes",
    "Ejecución de sesiones de capacitación",
    "Registro de asistencias y evaluaciones",
    "Cierre administrativo y encuestas de satisfacción"
  ],
  [ESTADOS.REALIZADO]: [
    "Revisión de resultados y métricas obtenidas",
    "Certificación y entrega de diplomas",
    "Evaluación de impacto en el desempeño",
    "Archivo de documentación y reportes finales"
  ]
};

// Colores por estado
export const coloresPorEstado = {
  [ESTADOS.REALIZADO]: 'bg-green-100 border-green-400 text-green-700',
  [ESTADOS.EN_EJECUCION]: 'bg-blue-100 border-blue-400 text-blue-700',
  [ESTADOS.EN_PROCESO]: 'bg-indigo-100 border-indigo-400 text-indigo-700',
  [ESTADOS.PLANIFICACION]: 'bg-gray-100 border-gray-400 text-gray-700',
  [ESTADOS.POSTERGADO]: 'bg-purple-100 border-purple-400 text-purple-700',
  [ESTADOS.SUSPENDIDO]: 'bg-red-100 border-red-400 text-red-700'
};

// Orden de estados
export const ordenEstados = [
  ESTADOS.PLANIFICACION,
  ESTADOS.EN_PROCESO,
  ESTADOS.EN_EJECUCION,
  ESTADOS.REALIZADO
];
