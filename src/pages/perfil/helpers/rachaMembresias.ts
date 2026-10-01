import { differenceInCalendarDays, max } from 'date-fns'
import { localDateStringToDate } from '@/helpers/getDate'

/** Días sin membresía que se toleran entre una y la siguiente sin cortar la racha (fin de semana, feriado) */
export const DIAS_TOLERANCIA = 3

/** Periodo de una membresía: desde su inicio hasta su fin real (con extensiones o congelamientos) */
export type PeriodoMembresia = {
  fecha_inicio: string
  fecha_fin: string
}

export type RachaMembresias = {
  /** Primer día activo de la racha actual */
  desde: Date
  /** Hasta cuándo está activo sin cortar (fin de la última membresía de la racha) */
  hasta: Date
  /** Membresías seguidas que lleva (solo las que ya empezaron) */
  cantidad: number
  /** Días desde el primer día activo hasta hoy */
  diasActivo: number
}

/**
 * Racha de membresías seguidas que incluye a hoy. Dos membresías son seguidas si entre el fin de una y el
 * inicio de la siguiente hay como mucho DIAS_TOLERANCIA días sin membresía
 * (ej. termina el sábado 30-05 y la otra empieza el lunes 02-06: 2 días sin membresía, sigue la racha).
 * Solo cuentan las que ya empezaron. Devuelve null si hoy no tiene una membresía activa.
 */
export const calcularRacha = (periodos: PeriodoMembresia[], hoy = new Date()): RachaMembresias | null => {
  const iniciadas = periodos
    .map((periodo) => ({ inicio: localDateStringToDate(periodo.fecha_inicio.slice(0, 10)), fin: localDateStringToDate(periodo.fecha_fin.slice(0, 10)) }))
    .filter(({ inicio }) => differenceInCalendarDays(inicio, hoy) <= 0)
    .sort((a, b) => a.inicio.getTime() - b.inicio.getTime())

  const racha = iniciadas.reduce<Omit<RachaMembresias, 'diasActivo'> | null>((anterior, { inicio, fin }) =>
    // Días sin membresía entre el fin de la anterior y el inicio de esta = diferencia - 1
    anterior && differenceInCalendarDays(inicio, anterior.hasta) - 1 <= DIAS_TOLERANCIA
      ? { desde: anterior.desde, hasta: max([anterior.hasta, fin]), cantidad: anterior.cantidad + 1 }
      : { desde: inicio, hasta: fin, cantidad: 1 }
  , null)
  // La última racha solo vale si sigue vigente hoy (hoy es a más tardar su último día)
  if (!racha || differenceInCalendarDays(racha.hasta, hoy) < 0) return null
  return { ...racha, diasActivo: differenceInCalendarDays(hoy, racha.desde) }
}
