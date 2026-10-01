import { runningTotal } from '@/helpers/reports'
import { repartirEnPartesIguales } from '@/pages/GestionMeta/helpers/repartirMonto'
import type { VentaReporteProps } from '../store/reporteMetaSlice'
import { aClaveDia, diasDelPeriodo, ventaDiaria } from './ventasPorDia'

/** Punto del gráfico "Meta acumulada vs venta real" (un día del periodo de la meta) */
export type PuntoMetaVsVenta = {
  /** yyyy-MM-dd */
  fecha: string
  /** Día del mes, para el eje X */
  dia: number
  /** Meta acumulada hasta este día */
  meta: number
  /** Venta acumulada hasta este día; null en días futuros (la línea se corta en hoy) */
  ventas: number | null
}

/**
 * Serie por día, del primer al último día de la meta:
 * - meta: el monto se reparte en partes iguales entre todos los días (céntimos exactos) y se acumula.
 * - ventas: montoTotal_membresia vendido cada día, acumulado; solo hasta hoy.
 */
export const armarSerieMetaVsVenta = (
  fecha_inicio: string,
  fecha_fin: string,
  montoMeta: number,
  ventas: VentaReporteProps[],
): PuntoMetaVsVenta[] => {
  const dias = diasDelPeriodo(fecha_inicio, fecha_fin)
  const metaAcumulada = runningTotal(repartirEnPartesIguales(montoMeta, dias.length))
  const ventaAcumulada = runningTotal(ventaDiaria(dias, ventas))

  const hoy = aClaveDia(new Date())
  return dias.map((dia, i) => {
    const fecha = aClaveDia(dia)
    return {
      fecha,
      dia: dia.getDate(),
      meta: Math.round(metaAcumulada[i] * 100) / 100,
      ventas: fecha <= hoy ? Math.round(ventaAcumulada[i] * 100) / 100 : null,
    }
  })
}
