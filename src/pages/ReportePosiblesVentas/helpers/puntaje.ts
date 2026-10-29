import { peso } from '../formPeso'
import { DIAS_ASISTENCIA, type MembresiaAsistenciaProps } from '../hook/useMembresiasSeguimiento'

/** Puntaje de una métrica: su fórmula con los números del cliente y los puntos que aporta (sobre 100) */
export type PuntajeMetrica = { formula: string, puntos: number }

const recortar = (valor: number) => Math.min(1, Math.max(0, valor))
const numero = (valor: number) => valor.toLocaleString('es-PE', { maximumFractionDigits: 1 })
const porcentaje = (valor: number) => `${Math.round(valor * 100)}%`

/** valor (0–1) × peso, en puntos sobre 100 */
const ponderar = (expresion: string, valor: number, pesoMetrica: number): PuntajeMetrica => {
  const puntos = valor * pesoMetrica * 100
  return { formula: `${expresion} × ${porcentaje(pesoMetrica)} = ${numero(puntos)}`, puntos }
}

/** Días asistidos en los últimos 30 días / 30 */
export const puntajeAsistencia = (row: MembresiaAsistenciaProps) =>
  ponderar(`${row.dias_asistidos}/${DIAS_ASISTENCIA}`, recortar(row.dias_asistidos / DIAS_ASISTENCIA), peso.asistenciaUltimos30dias)

/** 1 − días desde el último entrenamiento / 30 (30 o más, o nunca asistió: 0) */
export const puntajeRecencia = (row: MembresiaAsistenciaProps) => {
  if (row.dias_desde_ultima === null) return ponderar('0', 0, peso.recensiaAsistencia)
  const dias = Math.min(row.dias_desde_ultima, DIAS_ASISTENCIA)
  return ponderar(`(1 − ${dias}/${DIAS_ASISTENCIA})`, 1 - dias / DIAS_ASISTENCIA, peso.recensiaAsistencia)
}

/** 0.5 + diferencia de días / 30, recortado entre 0 y 1 (igual que antes: 0.5) */
export const puntajeTendencia = (row: MembresiaAsistenciaProps) => {
  const valor = 0.5 + row.tendencia / DIAS_ASISTENCIA
  const expresion = `(0.5 ${row.tendencia < 0 ? '−' : '+'} ${numero(Math.abs(row.tendencia))}/${DIAS_ASISTENCIA})`
  if (valor > 1) return ponderar(`mín(1, ${expresion})`, 1, peso.tendenciaAsistencia)
  if (valor < 0) return ponderar(`máx(0, ${expresion})`, 0, peso.tendenciaAsistencia)
  return ponderar(expresion, valor, peso.tendenciaAsistencia)
}

/** Tiene alguna renovación anterior: 1; ninguna: 0 */
export const puntajeRenovaciones = (row: MembresiaAsistenciaProps) => {
  const valor = row.renovaciones_anteriores > 0 ? 1 : 0
  return ponderar(String(valor), valor, peso.renovacionesAnteriores)
}

/** Clases consumidas / días hábiles (lunes a sábado) de toda la membresía; sin inicio conocido: 0 */
export const puntajeUsoSesiones = (row: MembresiaAsistenciaProps) => {
  if (!row.sesiones_totales) return ponderar('0', 0, peso.usoSesiones)
  return ponderar(`${row.clases_consumidas}/${row.sesiones_totales}`, recortar(row.clases_consumidas / row.sesiones_totales), peso.usoSesiones)
}

/** Suma de los puntos de las 5 métricas (sobre 100) */
export const puntajeTotal = (row: MembresiaAsistenciaProps) =>
  [puntajeAsistencia, puntajeRecencia, puntajeTendencia, puntajeRenovaciones, puntajeUsoSesiones]
    .reduce((total, puntaje) => total + puntaje(row).puntos, 0)
