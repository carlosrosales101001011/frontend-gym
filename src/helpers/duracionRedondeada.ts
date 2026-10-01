const plural = (cantidad: number, singular: string, varios: string) => `${cantidad} ${cantidad === 1 ? singular : varios}`

/**
 * Días expresados en la unidad más grande que alcance, redondeando hacia abajo:
 * años (365 días), meses (4 semanas), semanas (7 días) y días.
 * ej. 7 → "1 semana", 28 → "1 mes", 42 (6 semanas) → "1 mes", 711 → "1 año".
 */
export const duracionRedondeada = (dias: number) => {
  const semanas = Math.floor(dias / 7)
  if (dias >= 365) return plural(Math.floor(dias / 365), 'año', 'años')
  // Tope 12: 52 semanas darían "13 meses" y todavía no es 1 año
  if (semanas >= 4) return plural(Math.min(Math.floor(semanas / 4), 12), 'mes', 'meses')
  if (semanas >= 1) return plural(semanas, 'semana', 'semanas')
  return plural(dias, 'día', 'días')
}
