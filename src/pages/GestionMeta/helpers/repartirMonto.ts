// Reparto de la meta de programas entre asesores.
// Se trabaja en enteros (céntimos para montos, centésimas para porcentajes) para que las sumas
// den exacto (sin errores de redondeo). Los sobrantes se asignan por "mayor residuo".

const aCentimos = (monto: number) => Math.round((Number(monto) || 0) * 100)

/**
 * Convierte valores exactos (con decimales) a enteros que suman `objetivo`:
 * se toma la parte entera de cada uno y lo que falta se reparte a los de mayor parte decimal.
 */
const mayorResiduo = (exactos: number[], objetivo: number) => {
  const enteros = exactos.map(Math.floor)
  let faltante = objetivo - enteros.reduce((a, b) => a + b, 0)
  exactos
    .map((valor, i) => ({ i, residuo: valor - Math.floor(valor) }))
    .sort((a, b) => b.residuo - a.residuo || a.i - b.i)
    .forEach(({ i }) => {
      if (faltante > 0) { enteros[i]++; faltante-- }
    })
  return enteros
}

/** Suma de los montos de los asesores (lo que se muestra en monto_programa) */
export const sumarMontos = (montos: number[]) =>
  montos.reduce((total, monto) => total + aCentimos(monto), 0) / 100

/** Suma de porcentajes con 2 decimales (100 = reparto completo) */
export const sumarPorcentajes = (porcentajes: number[]) => sumarMontos(porcentajes)

/**
 * Parte `total` en `partes` montos iguales. Los céntimos que sobran van a los primeros:
 * 100 entre 3 => [33.34, 33.33, 33.33]
 */
export const repartirEnPartesIguales = (total: number, partes: number) => {
  if (partes <= 0) return []
  const totalCentimos = aCentimos(total)
  const base = Math.floor(totalCentimos / partes)
  const sobrante = totalCentimos - base * partes
  return Array.from({ length: partes }, (_, i) => (base + (i < sobrante ? 1 : 0)) / 100)
}

/**
 * Monto de cada asesor según su porcentaje del total.
 * Si los porcentajes suman 100, la suma de los montos es exactamente el total.
 */
export const repartirPorPorcentajes = (total: number, porcentajes: number[]) => {
  const totalCentimos = aCentimos(total)
  const exactos = porcentajes.map((p) => totalCentimos * (Number(p) || 0) / 100)
  const objetivo = Math.round(exactos.reduce((a, b) => a + b, 0))
  return mayorResiduo(exactos, objetivo).map((c) => c / 100)
}

/**
 * Porcentaje de cada monto sobre la suma, con 2 decimales y sumando exactamente 100.
 * Si todo está en 0, se reparte en partes iguales.
 */
export const porcentajesDesdeMontos = (montos: number[]) => {
  const centimos = montos.map(aCentimos)
  const total = centimos.reduce((a, b) => a + b, 0)
  if (total === 0) return repartirEnPartesIguales(100, montos.length)
  return mayorResiduo(centimos.map((c) => c * 10000 / total), 10000).map((p) => p / 100)
}
