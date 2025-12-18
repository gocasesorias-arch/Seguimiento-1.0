/**
 * Normaliza un curso del formato crudo (columnas nombradas) a formato semántico
 */
export const normalizarCurso = (cursoRaw) => {
  const mesInicioRaw = cursoRaw['Mes Inicio '] ?? cursoRaw['Mes Inicio']

  return {
    // Identificación
    id: cursoRaw['ID POWERBI'] || '',
    año: parseInt(cursoRaw['Año']) || 0,
    idGerencia: cursoRaw['ID Gerencia'] || '',

    // Estado y gestión
    estado: cursoRaw['Estado Actividad'] || 'Sin estado',
    liderProceso: cursoRaw['Líder Proceso área'] || '',
    usuarioResponsable: cursoRaw['Usuario Responsable Capacitación CMDIC'] || '',
    responsableOTIC: cursoRaw['PDC Responsable OTIC'] || '',
    observaciones: cursoRaw['OBS'] || '',

    // Organización - NORMALIZAR VP A MAYÚSCULAS
    vp: (cursoRaw['VP'] || '').toUpperCase(),
    gerencia: cursoRaw['Gerencia'] || '',

    // Detalles del curso
    tipoPlan: cursoRaw['Tipo de Plan'] || '',
    subtipo: cursoRaw['Subtipo'] || '',
    nombre: cursoRaw['nombre'] || 'Sin nombre',
    objetivo: cursoRaw['Objetivo Curso'] || 'Sin descripción',
    horas: parseInt(cursoRaw['Horas Curso']) || 0,
    tipoCargo: cursoRaw['Tipo de Cargo (Job Code)'] || '',
    dirigidoA: cursoRaw['Dirigido a'] || '',

    // Participantes y costos
    totalParticipantesProgramados: parseInt(cursoRaw['Total Participantes Programados']) || 0,
    participacionReal: parseInt(cursoRaw['Participación Real']) || 0,
    valorPersona: parseInt(cursoRaw['Valor Persona']) || 0,
    inversionTotal: parseInt(cursoRaw['Inversión Total']) || 0,

    // Proveedor y modalidad
    otecSugerido: cursoRaw['OTEC Sugerido'] || '',
    modalidad: cursoRaw['Modalidad'] || '',
    planEmergente: cursoRaw['Plan/Emergente'] || '',
    internoExterno: cursoRaw['Interno/Externo'] || '',
    abiertoCerrado: cursoRaw['Abierto/Cerrado'] || '',
    moduloPlanificador: cursoRaw['Módulo Planificador Clikma'] || '',

    // Fechas y ejecución
    mesInicio: parseInt(mesInicioRaw) || 0,
    detalleEjecucion: cursoRaw['Ejecucion - detalle'] || '',

    // Datos mensuales (simplificado)
    participantesPorMes: {
      enero: parseInt(cursoRaw['Ene']) || 0,
      febrero: parseInt(cursoRaw['Feb']) || 0,
      marzo: parseInt(cursoRaw['Mar']) || 0,
      abril: parseInt(cursoRaw['Abr']) || 0,
      mayo: parseInt(cursoRaw['May']) || 0,
      junio: parseInt(cursoRaw['Jun']) || 0,
      julio: parseInt(cursoRaw['Jul']) || 0,
      agosto: parseInt(cursoRaw['Ago']) || 0,
      septiembre: parseInt(cursoRaw['Sept']) || 0,
      octubre: parseInt(cursoRaw['Oct']) || 0,
      noviembre: parseInt(cursoRaw['Nov']) || 0,
      diciembre: parseInt(cursoRaw['Dic']) || 0
    },

    // Distribución de inversión mensual
    inversionPorMes: {
      enero: parseInt(cursoRaw['Enero']) || 0,
      febrero: parseInt(cursoRaw['Febrero']) || 0,
      marzo: parseInt(cursoRaw['Marzo']) || 0,
      abril: parseInt(cursoRaw['Abril']) || 0,
      mayo: parseInt(cursoRaw['Mayo']) || 0,
      junio: parseInt(cursoRaw['Junio']) || 0,
      julio: parseInt(cursoRaw['Julio']) || 0,
      agosto: parseInt(cursoRaw['Agosto']) || 0,
      septiembre: parseInt(cursoRaw['Septiembre']) || 0,
      octubre: parseInt(cursoRaw['Octubre']) || 0,
      noviembre: parseInt(cursoRaw['Noviembre']) || 0,
      diciembre: parseInt(cursoRaw['Diciembre']) || 0
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
