// Calendario de Capacitacion Chile 2026 — Constants

export const ANIO = 2026

export const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

export const MESES_CORTOS = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
]

export const DIAS_SEMANA = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom']

// Feriados Chile 2026 — 16 nacionales + 2 regionales
export const FERIADOS = {
  '2026-01-01': { nombre: 'Ano Nuevo', irrenunciable: true, regional: null },
  '2026-04-03': { nombre: 'Viernes Santo', irrenunciable: false, regional: null },
  '2026-04-04': { nombre: 'Sabado Santo', irrenunciable: false, regional: null },
  '2026-05-01': { nombre: 'Dia del Trabajo', irrenunciable: true, regional: null },
  '2026-05-21': { nombre: 'Glorias Navales', irrenunciable: false, regional: null },
  '2026-06-07': { nombre: 'Asalto y Toma del Morro de Arica', irrenunciable: false, regional: 'Arica y Parinacota' },
  '2026-06-21': { nombre: 'Pueblos Indigenas', irrenunciable: false, regional: null },
  '2026-06-29': { nombre: 'San Pedro y San Pablo', irrenunciable: false, regional: null },
  '2026-07-16': { nombre: 'Virgen del Carmen', irrenunciable: false, regional: null },
  '2026-08-15': { nombre: 'Asuncion de la Virgen', irrenunciable: false, regional: null },
  '2026-08-20': { nombre: 'Natalicio O\'Higgins', irrenunciable: false, regional: 'Chillan y Chillan Viejo' },
  '2026-09-18': { nombre: 'Independencia', irrenunciable: true, regional: null },
  '2026-09-19': { nombre: 'Glorias del Ejercito', irrenunciable: true, regional: null },
  '2026-10-12': { nombre: 'Encuentro Dos Mundos', irrenunciable: false, regional: null },
  '2026-10-31': { nombre: 'Iglesias Evang. y Prot.', irrenunciable: false, regional: null },
  '2026-11-01': { nombre: 'Todos los Santos', irrenunciable: false, regional: null },
  '2026-12-08': { nombre: 'Inmaculada Concepcion', irrenunciable: false, regional: null },
  '2026-12-25': { nombre: 'Navidad', irrenunciable: true, regional: null }
}

// VP color mapping — Tailwind classes
export const VP_COLORS = {
  'VP Mina': { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-400', borderLeft: 'border-l-blue-500', badge: 'bg-blue-100 text-blue-700 border-blue-200' },
  'VP Procesos': { bg: 'bg-green-50', text: 'text-green-800', border: 'border-green-400', borderLeft: 'border-l-green-500', badge: 'bg-green-100 text-green-700 border-green-200' },
  'VP Finanzas y Administracion': { bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-400', borderLeft: 'border-l-red-500', badge: 'bg-red-100 text-red-700 border-red-200' },
  'VP RRHH': { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-400', borderLeft: 'border-l-purple-500', badge: 'bg-purple-100 text-purple-700 border-purple-200' },
  'VP Sustentabilidad': { bg: 'bg-orange-50', text: 'text-orange-800', border: 'border-orange-400', borderLeft: 'border-l-orange-500', badge: 'bg-orange-100 text-orange-700 border-orange-200' },
  'Otra': { bg: 'bg-gray-50', text: 'text-gray-800', border: 'border-gray-400', borderLeft: 'border-l-gray-500', badge: 'bg-gray-100 text-gray-700 border-gray-200' }
}

export const VP_OPTIONS = [
  'VP Mina',
  'VP Procesos',
  'VP Finanzas y Administracion',
  'VP RRHH',
  'VP Sustentabilidad',
  'Otra'
]

export const getVPColors = (vp) => {
  return VP_COLORS[vp] || VP_COLORS['Otra']
}

// 10 demo courses from spec
export const CURSOS_DEMO = [
  {
    id: 'demo1',
    nombre: 'Operacion Segura de Grua Puente',
    proveedor: 'ASIMET',
    fecha: '2026-01-15',
    hora: '08:00',
    participantes: 20,
    duracion: 16,
    vp: 'VP Mina',
    gerencia: 'Gerencia de Operaciones Mina'
  },
  {
    id: 'demo2',
    nombre: 'Mantencion Preventiva Equipos',
    proveedor: 'EPIROC',
    fecha: '2026-01-15',
    hora: '14:00',
    participantes: 12,
    duracion: 8,
    vp: 'VP Procesos',
    gerencia: 'Gerencia de Mantenimiento'
  },
  {
    id: 'demo3',
    nombre: 'Excel Avanzado para Reporteria',
    proveedor: 'USACH',
    fecha: '2026-01-22',
    hora: '09:00',
    participantes: 25,
    duracion: 16,
    vp: 'VP Finanzas y Administracion',
    gerencia: 'Gerencia de Finanzas'
  },
  {
    id: 'demo4',
    nombre: 'Liderazgo y Gestion de Equipos',
    proveedor: 'Fundacion Chile',
    fecha: '2026-02-10',
    hora: '09:00',
    participantes: 15,
    duracion: 24,
    vp: 'VP RRHH',
    gerencia: 'Gerencia de Desarrollo Organizacional'
  },
  {
    id: 'demo5',
    nombre: 'Primeros Auxilios y RCP',
    proveedor: 'Cruz Roja',
    fecha: '2026-02-18',
    hora: '08:30',
    participantes: 30,
    duracion: 8,
    vp: 'VP Mina',
    gerencia: 'Gerencia de Seguridad'
  },
  {
    id: 'demo6',
    nombre: 'Normativa Ambiental Minera',
    proveedor: 'SGS Chile',
    fecha: '2026-03-05',
    hora: '09:00',
    participantes: 18,
    duracion: 16,
    vp: 'VP Sustentabilidad',
    gerencia: 'Gerencia de Medio Ambiente'
  },
  {
    id: 'demo7',
    nombre: 'Conduccion Defensiva CAEX',
    proveedor: 'ASIMET',
    fecha: '2026-03-12',
    hora: '07:00',
    participantes: 24,
    duracion: 8,
    vp: 'VP Mina',
    gerencia: 'Gerencia de Operaciones Mina'
  },
  {
    id: 'demo8',
    nombre: 'Power BI para Gestion Minera',
    proveedor: 'Microsoft',
    fecha: '2026-04-08',
    hora: '09:00',
    participantes: 20,
    duracion: 24,
    vp: 'VP Finanzas y Administracion',
    gerencia: 'Gerencia de TI'
  },
  {
    id: 'demo9',
    nombre: 'Trabajo en Altura Fisica',
    proveedor: 'Mutual de Seguridad',
    fecha: '2026-05-14',
    hora: '08:00',
    participantes: 16,
    duracion: 8,
    vp: 'VP Procesos',
    gerencia: 'Gerencia de Procesos Planta'
  },
  {
    id: 'demo10',
    nombre: 'Gestion de Riesgos Operacionales',
    proveedor: 'DNV',
    fecha: '2026-06-18',
    hora: '09:00',
    participantes: 22,
    duracion: 16,
    vp: 'VP Mina',
    gerencia: 'Gerencia de Planificacion'
  }
]
