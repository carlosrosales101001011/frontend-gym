import { eachDayOfInterval } from 'date-fns'
import { formatDate } from '@/helpers/FormatDate'
import { localDateStringToDate } from '@/helpers/getDate'
import { groupBy } from '@/helpers/arrays'
import { sumBy } from '@/helpers/reports'
import type { VentaReporteProps } from '../store/reporteMetaSlice'

/** Fecha -> "yyyy-MM-dd" (clave para agrupar y comparar días) */
export const aClaveDia = (fecha: Date) => formatDate(fecha, 'yyyy-mm-dd', 'yyyy-mm-dd')

/** Todos los días del periodo de la meta, del primero al último (incluidos) */
export const diasDelPeriodo = (fecha_inicio: string, fecha_fin: string) =>
  eachDayOfInterval({ start: localDateStringToDate(fecha_inicio), end: localDateStringToDate(fecha_fin) })

/** Lo vendido (montoTotal_membresia) en cada uno de los `dias`, en el mismo orden */
export const ventaDiaria = (dias: Date[], ventas: VentaReporteProps[]) => {
  const ventasPorDia = groupBy(ventas, (venta) => aClaveDia(new Date(venta.fecha_venta)))
  return dias.map((dia) => sumBy(ventasPorDia[aClaveDia(dia)] ?? [], (venta) => Number(venta.montoTotal_membresia) || 0))
}
