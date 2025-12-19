import fs from 'fs'

const MONTH_KEY_MAP = {
  Ene: '139',
  Feb: '182',
  Mar: '2663',
  Abril: '1928',
  Mayo: '2247',
  Jun: '2494',
  Jul: '2252',
  Ago: '2866',
  Sept: '1600',
  Oct: '1666',
  Nov: '261',
  Dic: '50'
}

const MONTH_NAME_TO_NUMBER = {
  january: 1,
  february: 2,
  march: 3,
  april: 4,
  may: 5,
  june: 6,
  july: 7,
  august: 8,
  september: 9,
  october: 10,
  november: 11,
  december: 12,
  enero: 1,
  febrero: 2,
  marzo: 3,
  abril: 4,
  mayo: 5,
  junio: 6,
  julio: 7,
  agosto: 8,
  septiembre: 9,
  setiembre: 9,
  octubre: 10,
  noviembre: 11,
  diciembre: 12
}

const parseNumber = (value) => {
  if (value === null || value === undefined) return 0
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0
  const cleaned = String(value)
    .replace(/[\u00A0\s]+/g, '')
    .replace(/[$.,]/g, '')
  const parsed = Number(cleaned)
  return Number.isFinite(parsed) ? parsed : 0
}

const normalizeText = (value, { upper = false } = {}) => {
  if (value === null || value === undefined) return null
  const cleaned = String(value)
    .replace(/\s+/g, ' ')
    .trim()

  if (!cleaned) return null
  return upper ? cleaned.toUpperCase() : cleaned
}

const getMesInicio = (cursoRaw) => {
  const mesNumero = parseNumber(cursoRaw['0'])
  if (mesNumero) return mesNumero

  const mesTexto = normalizeText(cursoRaw.Column27)
  if (!mesTexto) return 0

  const mes = MONTH_NAME_TO_NUMBER[mesTexto.toLowerCase()] || 0
  return mes
}

const buildDistribucion = (cursoRaw, valorPersona) => {
  const distribucion = {}
  const costos = {}

  Object.entries(MONTH_KEY_MAP).forEach(([mes, key]) => {
    const participantes = parseNumber(cursoRaw[key])
    distribucion[mes] = participantes
    costos[mes] = participantes > 0 && valorPersona > 0 ? participantes * valorPersona : 0
  })

  return { distribucion, costos }
}

const normalizarCurso = (cursoRaw, index, metadataAnio) => {
  const valorPersona = parseNumber(cursoRaw['18348'])
  const { distribucion, costos } = buildDistribucion(cursoRaw, valorPersona)
  const totalParticipantesDistribucion = Object.values(distribucion).reduce((acc, val) => acc + val, 0)
  const participantesTotales = totalParticipantesDistribucion > 0 ? totalParticipantesDistribucion : parseNumber(cursoRaw.Column19)

  const vp = normalizeText(cursoRaw.Column9, { upper: true }) || 'SIN VP'
  const gerencia = normalizeText(cursoRaw.Column10, { upper: true }) || 'SIN GERENCIA'
  const nombre = normalizeText(cursoRaw.Column13) || 'SIN NOMBRE'
  const anio = parseNumber(cursoRaw.Column2) || metadataAnio || 0

  return {
    id: normalizeText(cursoRaw.Column1) || `CUR-${String(index + 1).padStart(4, '0')}`,
    nombre,
    objetivo: normalizeText(cursoRaw.Column14) || null,
    vp,
    gerencia,
    anio,
    estado: normalizeText(cursoRaw.Column4, { upper: true }) || null,
    tipoPlan: normalizeText(cursoRaw.Column11) || null,
    subtipo: normalizeText(cursoRaw.Column12) || null,
    responsableOtic: normalizeText(cursoRaw.Column7) || null,
    liderProceso: normalizeText(cursoRaw.Column6) || null,
    modalidad: normalizeText(cursoRaw.Column21) || null,
    internoExterno: normalizeText(cursoRaw.Column23) || null,
    horas: parseNumber(cursoRaw.Column15),
    valorPersona,
    participantes: participantesTotales,
    mesInicio: getMesInicio(cursoRaw),
    planEmergente: normalizeText(cursoRaw.Column22) || null,
    costosMensuales: costos,
    distribucionParticipantes: distribucion
  }
}

const calcularAnioDominante = (cursos) => {
  const conteo = cursos.reduce((acc, curso) => {
    const anio = parseNumber(curso.Column2)
    if (anio) {
      acc[anio] = (acc[anio] || 0) + 1
    }
    return acc
  }, {})

  return Number(
    Object.entries(conteo)
      .sort((a, b) => b[1] - a[1])
      .map(([anio]) => anio)[0]
  )
}

const validarCursos = (cursos) => {
  const faltantes = cursos.filter(
    (curso) => !curso.vp || !curso.gerencia || !curso.nombre || !curso.anio
  )

  if (faltantes.length) {
    const ids = faltantes.map((curso) => curso.id).join(', ')
    throw new Error(`Cursos con datos obligatorios faltantes: ${ids}`)
  }
}

const main = () => {
  const [inputPath = 'cursos_raw.json', outputPath = 'cursos.json'] = process.argv.slice(2)

  const rawData = JSON.parse(fs.readFileSync(inputPath, 'utf8'))
  if (!Array.isArray(rawData)) {
    throw new Error('El archivo de entrada debe ser un array de objetos crudos')
  }

  const datos = rawData[0]?.Column1?.includes('ID POWERBI') ? rawData.slice(1) : rawData
  const anioDominante = calcularAnioDominante(datos)

  const cursos = datos.map((cursoRaw, index) => normalizarCurso(cursoRaw, index, anioDominante))

  validarCursos(cursos)

  const metadata = {
    anio: anioDominante,
    fechaGeneracion: new Date().toISOString(),
    totalCursos: cursos.length
  }

  fs.writeFileSync(outputPath, JSON.stringify({ metadata, cursos }, null, 2))
  console.log(`✅ Archivo normalizado generado en ${outputPath} con ${cursos.length} cursos`)
}

main()
