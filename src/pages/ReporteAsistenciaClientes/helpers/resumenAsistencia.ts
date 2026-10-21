import { differenceInCalendarDays, parseISO } from 'date-fns'
import type { AsistenciaReporteProps } from '../store/reporteAsistenciaSlice'

/** Clientes distintos que asistieron (en las asistencias del reporte) */
export const clientesAsistidos = (asistencias: AsistenciaReporteProps[]) =>
  new Set(asistencias.map((a) => a.id_persona)).size

/** Días del rango, ambos inclusive (mínimo 1) */
export const diasDelRango = (fecha_inicio: string, fecha_fin: string) =>
  fecha_inicio && fecha_fin ? Math.max(1, differenceInCalendarDays(parseISO(fecha_fin), parseISO(fecha_inicio)) + 1) : 1

export type HoraPico = {
  /** Hora de inicio de la franja (0-23) */
  hora: number
  /** Asistencias en esa franja en todo el rango */
  asistencias: number
  /** asistencias / días del rango */
  promedioPorDia: number
}

/** Franja de una hora con más asistencias (hora local de la asistencia) y su promedio por día; null si no hay */
export const horaPico = (asistencias: AsistenciaReporteProps[], dias: number): HoraPico | null => {
  if (!asistencias.length) return null
  const porHora = new Map<number, number>()
  for (const a of asistencias) {
    const hora = new Date(a.fecha_registro).getHours()
    porHora.set(hora, (porHora.get(hora) ?? 0) + 1)
  }
  // Empate: la más temprana
  const [hora, cantidad] = [...porHora.entries()].sort((x, y) => y[1] - x[1] || x[0] - y[0])[0]
  return { hora, asistencias: cantidad, promedioPorDia: cantidad / dias }
}

export type FrecuenciaClientes = {
  /** ≥ 3 asistencias por semana */
  frecuentes: number
  /** 2 asistencias por semana */
  regulares: number
  /** 1 asistencia por semana (o menos) */
  baja: number
}

/**
 * Clientes que asistieron según su promedio de asistencias por semana en el rango (días distintos con asistencia /
 * semanas del rango; un rango menor a 7 días cuenta como una semana).
 */
export const frecuenciaClientes = (asistencias: AsistenciaReporteProps[], dias: number): FrecuenciaClientes => {
  const diasPorCliente = new Map<number, Set<string>>()
  for (const a of asistencias) {
    const diasCliente = diasPorCliente.get(a.id_persona) ?? new Set<string>()
    diasCliente.add(new Date(a.fecha_registro).toDateString())
    diasPorCliente.set(a.id_persona, diasCliente)
  }
  const semanas = Math.max(1, dias / 7)
  const frecuencia: FrecuenciaClientes = { frecuentes: 0, regulares: 0, baja: 0 }
  for (const diasCliente of diasPorCliente.values()) {
    const porSemana = diasCliente.size / semanas
    if (porSemana >= 3) frecuencia.frecuentes++
    else if (porSemana >= 2) frecuencia.regulares++
    else frecuencia.baja++
  }
  return frecuencia
}

/** 7 -> "07:00 - 08:00" */
export const franjaHora = (hora: number) =>
  `${String(hora).padStart(2, '0')}:00 - ${String((hora + 1) % 24).padStart(2, '0')}:00`
