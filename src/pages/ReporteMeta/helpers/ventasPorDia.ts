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

/** Día en que cuenta la venta: el de su pago en el periodo (reporte por fecha de pago) o su fecha de venta */
export const claveDiaVenta = (venta: VentaReporteProps) =>
  venta.fecha_pago ? venta.fecha_pago.slice(0, 10) : aClaveDia(new Date(venta.fecha_venta))

/** Lo vendido (montoTotal_membresia) en cada uno de los `dias`, en el mismo orden */
export const ventaDiaria = (dias: Date[], ventas: VentaReporteProps[]) => {
  const ventasPorDia = groupBy(ventas, claveDiaVenta)
  return dias.map((dia) => sumBy(ventasPorDia[aClaveDia(dia)] ?? [], (venta) => Number(venta.montoTotal_membresia) || 0))
}
