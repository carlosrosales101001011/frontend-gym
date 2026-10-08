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

/** 7 -> "07:00 - 08:00" */
export const franjaHora = (hora: number) =>
  `${String(hora).padStart(2, '0')}:00 - ${String((hora + 1) % 24).padStart(2, '0')}:00`
