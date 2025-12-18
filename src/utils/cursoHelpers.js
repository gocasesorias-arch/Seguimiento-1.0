/**
 * Normaliza un curso del formato crudo (Column1, Column2) a formato semántico
 */
export const normalizarCurso = (cursoRaw) => {
  return {
    // Identificación
    id: cursoRaw.Column1 || '',
    año: parseInt(cursoRaw.Column2) || 0,
    idGerencia: cursoRaw.Column3 || '',

    // Estado y gestión
    estado: cursoRaw.Column4 || 'Sin estado',
    liderProceso: cursoRaw.Column5 || '',
    usuarioResponsable: cursoRaw.Column6 || '',
    responsableOTIC: cursoRaw.Column7 || '',
    observaciones: cursoRaw.Column8 || '',

    // Organización - NORMALIZAR VP A MAYÚSCULAS
    vp: (cursoRaw.Column9 || '').toUpperCase(),
    gerencia: cursoRaw.Column10 || '',

    // Detalles del curso
    tipoPlan: cursoRaw.Column11 || '',
    subtipo: cursoRaw.Column12 || '',
    nombre: cursoRaw.Column13 || 'Sin nombre',
    objetivo: cursoRaw.Column14 || 'Sin descripción',
    horas: parseInt(cursoRaw.Column15) || 0,
    tipoCargo: cursoRaw.Column16 || '',
    dirigidoA: cursoRaw.Column17 || '',

    // Participantes y costos
    valorPersona: parseInt(cursoRaw['18348']) || 0,
    participacionReal: parseInt(cursoRaw.Column19) || 0,

    // Proveedor y modalidad
    otecSugerido: cursoRaw.Column20 || '',
    modalidad: cursoRaw.Column21 || '',
    planEmergente: cursoRaw.Column22 || '',
    internoExterno: cursoRaw.Column23 || '',
    abiertoCerrado: cursoRaw.Column24 || '',
    moduloPlanificador: cursoRaw.Column25 || '',

    // Fechas y ejecución
    mesInicio: parseInt(cursoRaw['0']) || 0,
    detalleEjecucion: cursoRaw.Column27 || '',

    // Datos mensuales (simplificado)
    participantesPorMes: {
      enero: parseInt(cursoRaw['139']) || 0,
      febrero: parseInt(cursoRaw['182']) || 0,
      marzo: parseInt(cursoRaw['2663']) || 0,
      abril: parseInt(cursoRaw['1928']) || 0,
      mayo: parseInt(cursoRaw['2247']) || 0,
      junio: parseInt(cursoRaw['2494']) || 0,
      julio: parseInt(cursoRaw['2252']) || 0,
      agosto: parseInt(cursoRaw['2866']) || 0,
      septiembre: parseInt(cursoRaw['1600']) || 0,
      octubre: parseInt(cursoRaw['1666']) || 0,
      noviembre: parseInt(cursoRaw['261']) || 0,
      diciembre: parseInt(cursoRaw['50']) || 0
    },

    // Mantener datos raw para compatibilidad
    _raw: cursoRaw
  }
}

/**
 * Obtiene el nombre del mes a partir del número
 */
export const obtenerNombreMes = (numeroMes) => {
  const meses = {
    1: 'Enero', 2: 'Febrero', 3: 'Marzo', 4: 'Abril',
    5: 'Mayo', 6: 'Junio', 7: 'Julio', 8: 'Agosto',
    9: 'Septiembre', 10: 'Octubre', 11: 'Noviembre', 12: 'Diciembre'
  }
  return meses[numeroMes] || 'Sin mes'
}

/**
 * Obtiene el color para un estado
 */
export const obtenerColorEstado = (estado) => {
  const colores = {
    'Realizado': 'bg-green-100 text-green-800 border-green-300',
    'En Ejecución': 'bg-blue-100 text-blue-800 border-blue-300',
    'En Proceso': 'bg-indigo-100 text-indigo-800 border-indigo-300',
    'Planificación': 'bg-gray-100 text-gray-800 border-gray-300',
    'Suspendido': 'bg-red-100 text-red-800 border-red-300',
    'Postergado': 'bg-purple-100 text-purple-800 border-purple-300'
  }
  return colores[estado] || 'bg-gray-100 text-gray-800 border-gray-300'
}

/**
 * Valida que un curso tenga los campos mínimos requeridos
 */
export const validarCurso = (curso) => {
  const errores = []

  if (!curso.nombre || curso.nombre === 'Sin nombre') {
    errores.push('El curso debe tener un nombre')
  }

  if (!curso.vp) {
    errores.push('El curso debe tener una VP asignada')
  }

  if (!curso.gerencia) {
    errores.push('El curso debe tener una Gerencia asignada')
  }

  if (!curso.estado) {
    errores.push('El curso debe tener un estado')
  }

  if (curso.horas <= 0) {
    errores.push('El curso debe tener horas definidas')
  }

  return {
    esValido: errores.length === 0,
    errores
  }
}

/**
 * Formatea un número como moneda chilena
 */
export const formatearMoneda = (valor) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP'
  }).format(valor)
}
