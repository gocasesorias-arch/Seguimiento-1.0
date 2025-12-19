/**
 * Normaliza texto para comparaciones insensibles a:
 * - Mayúsculas/minúsculas
 * - Espacios extras
 * - Acentos y diacríticos
 *
 * @param {string} text - Texto a normalizar
 * @returns {string} Texto normalizado
 */
export function normalizeText(text) {
  if (!text) return ''

  return text
    .toString()
    .toLowerCase()
    .trim()
    // Normalizar espacios múltiples a uno solo
    .replace(/\s+/g, ' ')
    // Remover acentos y diacríticos
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

/**
 * Compara dos textos de forma normalizada
 *
 * @param {string} text1 - Primer texto
 * @param {string} text2 - Segundo texto
 * @returns {boolean} true si los textos son equivalentes después de normalizar
 */
export function compareNormalized(text1, text2) {
  return normalizeText(text1) === normalizeText(text2)
}

/**
 * Deduplica un array de strings basado en su forma normalizada
 * Mantiene la primera ocurrencia de cada forma normalizada única
 *
 * @param {Array<string>} items - Array de strings a deduplicar
 * @returns {Array<string>} Array sin duplicados normalizados
 */
export function deduplicateNormalized(items) {
  const seen = new Set()
  const result = []

  for (const item of items) {
    const normalized = normalizeText(item)
    if (!seen.has(normalized)) {
      seen.add(normalized)
      result.push(item)
    }
  }

  return result
}

/**
 * Filtra un array de strings que coincidan con un término de búsqueda (normalizado)
 *
 * @param {Array<string>} items - Array de strings a filtrar
 * @param {string} searchTerm - Término de búsqueda
 * @returns {Array<string>} Items que contienen el término de búsqueda
 */
export function filterByNormalizedText(items, searchTerm) {
  const normalizedSearch = normalizeText(searchTerm)
  return items.filter(item =>
    normalizeText(item).includes(normalizedSearch)
  )
}
