import { differenceInCalendarDays, eachDayOfInterval, parseISO } from 'date-fns'
import { formatDate } from '@/helpers/FormatDate'
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

export type NivelFrecuencia = keyof FrecuenciaClientes

/** Un cliente que asistió, con lo que hizo en el rango */
export type ClienteAsistido = {
  id_persona: number
  label_nombres_apellidos_persona: string
  /** Días distintos con asistencia (1 asistencia por día) */
  dias_asistidos: number
  /** dias_asistidos / semanas del rango */
  por_semana: number
  nivel: NivelFrecuencia
  /** La más reciente (ISO) */
  ultima_asistencia: string
  /** La más antigua (ISO); en un solo día, a qué hora llegó */
  primera_asistencia: string
}

/**
 * Clientes que asistieron (por nombre) y su nivel según su promedio de asistencias por semana en el rango (días
 * distintos con asistencia / semanas del rango; un rango menor a 7 días cuenta como una semana).
 */
export const detalleClientesAsistidos = (asistencias: AsistenciaReporteProps[], dias: number): ClienteAsistido[] => {
  const porCliente = new Map<number, { nombre: string, dias: Set<string>, ultima: string, primera: string }>()
  for (const a of asistencias) {
    const cliente = porCliente.get(a.id_persona)
      ?? { nombre: a.label_nombres_apellidos_persona, dias: new Set<string>(), ultima: a.fecha_registro, primera: a.fecha_registro }
    cliente.dias.add(new Date(a.fecha_registro).toDateString())
    if (a.fecha_registro > cliente.ultima) cliente.ultima = a.fecha_registro
    if (a.fecha_registro < cliente.primera) cliente.primera = a.fecha_registro
    porCliente.set(a.id_persona, cliente)
  }
  const semanas = Math.max(1, dias / 7)
  return [...porCliente.entries()]
    .map(([id_persona, c]) => {
      const por_semana = c.dias.size / semanas
      const nivel: NivelFrecuencia = por_semana >= 3 ? 'frecuentes' : por_semana >= 2 ? 'regulares' : 'baja'
      return {
        id_persona, label_nombres_apellidos_persona: c.nombre,
        dias_asistidos: c.dias.size, por_semana, nivel, ultima_asistencia: c.ultima, primera_asistencia: c.primera,
      }
    })
    .sort((x, y) => x.label_nombres_apellidos_persona.localeCompare(y.label_nombres_apellidos_persona))
}

/** Cuántos clientes que asistieron hay en cada nivel (ver detalleClientesAsistidos) */
export const frecuenciaClientes = (clientes: ClienteAsistido[]): FrecuenciaClientes => {
  const frecuencia: FrecuenciaClientes = { frecuentes: 0, regulares: 0, baja: 0 }
  for (const c of clientes) frecuencia[c.nivel]++
  return frecuencia
}

/** Asistencias registradas en la franja que empieza a esa hora (hora local) */
export const asistenciasDeLaHora = (asistencias: AsistenciaReporteProps[], hora: number) =>
  asistencias.filter((a) => new Date(a.fecha_registro).getHours() === hora)

/** 7 -> "07:00 - 08:00" */
export const franjaHora = (hora: number) =>
  `${String(hora).padStart(2, '0')}:00 - ${String((hora + 1) % 24).padStart(2, '0')}:00`

export type PuntoAsistidosDia = {
  /** yyyy-mm-dd */
  fecha: string
  /** dd/mm, para el eje */
  dia: string
  /** Clientes distintos que asistieron ese día (varias marcaciones de uno en el día cuentan una vez); null si es futuro */
  clientes: number | null
}

/** Clientes que asistieron en cada día del rango (ambos inclusive), con los días sin asistencias en 0 */
export const asistidosPorDia = (asistencias: AsistenciaReporteProps[], fecha_inicio: string, fecha_fin: string): PuntoAsistidosDia[] => {
  if (!fecha_inicio || !fecha_fin || fecha_inicio > fecha_fin) return []
  const clientesPorDia = new Map<string, Set<number>>()
  for (const a of asistencias) {
    const fecha = formatDate(new Date(a.fecha_registro), 'yyyy-mm-dd', 'yyyy-mm-dd')
    const clientes = clientesPorDia.get(fecha) ?? new Set<number>()
    clientes.add(a.id_persona)
    clientesPorDia.set(fecha, clientes)
  }
  const hoy = formatDate(new Date(), 'yyyy-mm-dd', 'yyyy-mm-dd')
  return eachDayOfInterval({ start: parseISO(fecha_inicio), end: parseISO(fecha_fin) }).map((d) => {
    const fecha = formatDate(d, 'yyyy-mm-dd', 'yyyy-mm-dd')
    return {
      fecha,
      dia: formatDate(d, 'yyyy-mm-dd', 'dd/mm/yyyy').slice(0, 5),
      clientes: fecha <= hoy ? clientesPorDia.get(fecha)?.size ?? 0 : null,
    }
  })
}

/** Días de la semana del recuento (getDay: 1 = lunes ... 6 = sábado) */
export const DIAS_SEMANA = [
  { dia: 1, nombre: 'Lunes' },
  { dia: 2, nombre: 'Martes' },
  { dia: 3, nombre: 'Miércoles' },
  { dia: 4, nombre: 'Jueves' },
  { dia: 5, nombre: 'Viernes' },
  { dia: 6, nombre: 'Sábado' },
] as const

export type AsistidosDiaSemana = {
  dia: number
  nombre: string
  /** Suma de los clientes de cada uno de esos días (un cliente que viene todos los lunes cuenta cada lunes) */
  clientes: number
  /** Cuántos de esos días ya pasaron en el rango */
  dias: number
}

/** Recuento por día de la semana a partir de la serie diaria (ver asistidosPorDia); los días futuros no cuentan */
export const asistidosPorDiaSemana = (serie: PuntoAsistidosDia[]): AsistidosDiaSemana[] =>
  DIAS_SEMANA.map(({ dia, nombre }) => {
    const puntos = serie.filter((p) => p.clientes !== null && parseISO(p.fecha).getDay() === dia)
    return { dia, nombre, clientes: puntos.reduce((total, p) => total + (p.clientes ?? 0), 0), dias: puntos.length }
  })

/** Asistencias registradas en ese día de la semana (getDay, hora local) */
export const asistenciasDelDiaSemana = (asistencias: AsistenciaReporteProps[], dia: number) =>
  asistencias.filter((a) => new Date(a.fecha_registro).getDay() === dia)

/** "Lunes" -> "lunes", "Sábado" -> "sábados" (los que terminan en s no cambian) */
export const pluralDiaSemana = (nombre: string) => `${nombre.toLowerCase()}${nombre.endsWith('s') ? '' : 's'}`

/** Asistencias registradas ese día (yyyy-mm-dd, hora local) */
export const asistenciasDelDia = (asistencias: AsistenciaReporteProps[], fecha: string) =>
  asistencias.filter((a) => formatDate(new Date(a.fecha_registro), 'yyyy-mm-dd', 'yyyy-mm-dd') === fecha)

/**
 * Deja 1 asistencia por cliente por día (hora local): la primera marcación del día, a la que llegó. Las demás
 * marcaciones de ese día no cuentan en ninguna parte del reporte. Mantiene el orden (más reciente primero).
 */
export const unaAsistenciaPorClienteDia = (asistencias: AsistenciaReporteProps[]) => {
  const primeraPorClienteDia = new Map<string, AsistenciaReporteProps>()
  for (const a of asistencias) {
    const clave = `${a.id_persona}|${new Date(a.fecha_registro).toDateString()}`
    const actual = primeraPorClienteDia.get(clave)
    if (!actual || new Date(a.fecha_registro) < new Date(actual.fecha_registro)) primeraPorClienteDia.set(clave, a)
  }
  const unicas = new Set(primeraPorClienteDia.values())
  return asistencias.filter((a) => unicas.has(a))
}
