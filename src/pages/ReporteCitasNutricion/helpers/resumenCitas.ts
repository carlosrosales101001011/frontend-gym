import { groupBy } from '@/helpers/arrays'
import { getPorcentaje } from '@/helpers/getPorcentaje'
import { normalizeText } from '@/helpers/strings'
import { obtenerEstado, type EstadoEvento } from '@/pages/AgendaNutricionista/helpers/agendaHelpers'
import { aClaveDia, diasDelPeriodo } from '@/pages/ReporteMeta/helpers/ventasPorDia'
import { formatDate } from '@/helpers/FormatDate'
import { franjaHora } from '@/pages/ReporteAsistenciaClientes/helpers/resumenAsistencia'
import type { CitaReporteProps } from '../store/reporteCitasSlice'

const redondear1 = (valor: number) => Math.round(valor * 10) / 10

/** true si la cita está en el estado con ese nombre (sin tildes ni mayúsculas: "atendido", "no asistio") */
const estaEn = (estados: EstadoEvento[], cita: CitaReporteProps, nombre: string) =>
  normalizeText(obtenerEstado(estados, cita.id_estado).label) === nombre

/**
 * Estados que se reportan, en el orden de la terminología: los que se asignan a citas (los bloqueados solo
 * si tienen citas) y, al final, los ids que tengan citas y ya no estén en la terminología ("Sin estado").
 */
export const estadosReportados = (estados: EstadoEvento[], citas: CitaReporteProps[]): EstadoEvento[] => {
  const conocidos = new Set(estados.map((estado) => estado.value))
  const desconocidos = [...new Set(citas.map((cita) => cita.id_estado))].filter((id) => !conocidos.has(id))
  return [
    ...estados.filter((estado) => !estado.bloqueado || citas.some((cita) => cita.id_estado === estado.value)),
    ...desconocidos.map((id) => obtenerEstado(estados, id)),
  ]
}

export type ResumenCitas = {
  atendidas: number
  noAsistio: number
  /** atendidas ÷ (atendidas + no asistió); null si aún no hay ninguna de las dos */
  asistencia: number | null
  /** Día con más citas atendidas (empate: el primero); null si no hay atendidas */
  mejorDia: { fecha: string, atendidas: number, citas: number } | null
}

/** Asistencia y mejor día de las citas (las confirmadas o reprogramadas aún no cuentan para la asistencia) */
export const calcularResumenCitas = (citas: CitaReporteProps[], estados: EstadoEvento[]): ResumenCitas => {
  const atendidas = citas.filter((cita) => estaEn(estados, cita, 'atendido'))
  const noAsistio = citas.filter((cita) => estaEn(estados, cita, 'no asistio')).length
  const porDia = groupBy(citas, (cita) => cita.fecha)
  const mejorDia = Object.entries(groupBy(atendidas, (cita) => cita.fecha))
    .map(([fecha, delDia]) => ({ fecha, atendidas: delDia.length, citas: porDia[fecha]?.length ?? 0 }))
    .sort((a, b) => b.atendidas - a.atendidas || a.fecha.localeCompare(b.fecha))[0] ?? null
  const evaluadas = atendidas.length + noAsistio
  return {
    atendidas: atendidas.length,
    noAsistio,
    asistencia: evaluadas ? redondear1(getPorcentaje(atendidas.length, evaluadas)) : null,
    mejorDia,
  }
}

/** Solo los estados que tienen citas (para los segmentos y la leyenda de los gráficos apilados) */
export const estadosConCitas = (estados: EstadoEvento[], citas: CitaReporteProps[]) =>
  estadosReportados(estados, citas).filter((estado) => citas.some((cita) => cita.id_estado === estado.value))

/** Cantidad de citas de un estado y el % que representa del total */
export type ConteoEstado = EstadoEvento & {
  cantidad: number
  participacion: number
}

export const contarPorEstado = (citas: CitaReporteProps[], estados: EstadoEvento[]): ConteoEstado[] => {
  const porEstado = groupBy(citas, (cita) => cita.id_estado)
  return estados.map((estado) => {
    const cantidad = porEstado[estado.value]?.length ?? 0
    return { ...estado, cantidad, participacion: redondear1(getPorcentaje(cantidad, citas.length)) }
  })
}

/** Fila de un gráfico apilado por estado: un día, un nutricionista o una hora */
export type FilaApilada = {
  id: string | number
  /** Texto del eje */
  nombre: string
  /** Texto completo para el tooltip y la tabla */
  titulo: string
  total: number
  /** Cantidad de citas por id_estado */
  porEstado: Record<number, number>
}

const apilar = (id: string | number, nombre: string, titulo: string, citas: CitaReporteProps[]): FilaApilada => ({
  id,
  nombre,
  titulo,
  total: citas.length,
  porEstado: Object.fromEntries(Object.entries(groupBy(citas, (cita) => cita.id_estado)).map(([idEstado, delEstado]) => [idEstado, delEstado.length])),
})

/** Todos los días del rango (también los que no tienen citas), con el día del mes en el eje */
export const citasPorDia = (citas: CitaReporteProps[], fecha_inicio: string, fecha_fin: string): FilaApilada[] => {
  const porDia = groupBy(citas, (cita) => cita.fecha)
  return diasDelPeriodo(fecha_inicio, fecha_fin).map((dia) => {
    const fecha = aClaveDia(dia)
    return apilar(fecha, String(dia.getDate()), formatDate(fecha, 'yyyy-mm-dd', 'DDDD dd [de] MMMM'), porDia[fecha] ?? [])
  })
}

/** Cada nutricionista con citas, de más a menos citas */
export const citasPorNutricionista = (citas: CitaReporteProps[]): FilaApilada[] =>
  Object.values(groupBy(citas, (cita) => cita.id_empl))
    .map((delNutricionista) => {
      const nombre = delNutricionista[0].label_nutricionista || 'Sin nutricionista'
      return apilar(delNutricionista[0].id_empl, nombre, nombre, delNutricionista)
    })
    .sort((a, b) => b.total - a.total)

/** Franjas de una hora (por la hora de inicio de la cita), desde la primera hasta la última con citas */
export const citasPorHora = (citas: CitaReporteProps[]): FilaApilada[] => {
  if (!citas.length) return []
  const porHora = groupBy(citas, (cita) => Number(cita.hora_inicio.slice(0, 2)))
  const horas = Object.keys(porHora).map(Number)
  const desde = Math.min(...horas)
  return Array.from({ length: Math.max(...horas) - desde + 1 }, (_, i) => {
    const hora = desde + i
    return apilar(hora, `${String(hora).padStart(2, '0')}:00`, franjaHora(hora), porHora[hora] ?? [])
  })
}
