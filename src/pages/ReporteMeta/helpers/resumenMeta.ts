import { sumBy } from '@/helpers/reports'
import { repartirEnPartesIguales } from '@/pages/GestionMeta/helpers/repartirMonto'
import type { VentaReporteProps } from '../store/reporteMetaSlice'
import { aClaveDia, diasDelPeriodo, ventaDiaria } from './ventasPorDia'

export type MejorDiaVenta = {
  /** yyyy-MM-dd */
  fecha: string
  /** Lo vendido ese día */
  monto: number
  /** Cuánto superó a la meta del día */
  excedente: number
}

export type ResumenMeta = {
  /** Meta completa del periodo */
  metaTotal: number
  /** Meta del día: la meta repartida en partes iguales entre todos los días */
  metaPorDia: number
  /** Cantidad de días del periodo */
  cantidadDias: number
  /** Venta acumulada total del periodo (montoTotal_membresia) */
  ventaTotal: number
  /** Día con más venta, solo si superó a la meta del día; null si ningún día la superó */
  mejorDia: MejorDiaVenta | null
}

const redondear2 = (monto: number) => Math.round(monto * 100) / 100

/** Datos del Header2App: meta total, meta por día, venta total y mejor día de venta */
export const calcularResumenMeta = (
  fecha_inicio: string,
  fecha_fin: string,
  montoMeta: number,
  ventas: VentaReporteProps[],
): ResumenMeta => {
  const dias = diasDelPeriodo(fecha_inicio, fecha_fin)
  const ventasDelDia = ventaDiaria(dias, ventas)
  const cuotaDiaria = repartirEnPartesIguales(montoMeta, dias.length)

  // Día con más venta (ante empate, el primero); cuenta solo si superó a su meta del día
  const indiceMejor = ventasDelDia.reduce((mejor, monto, i) => (monto > ventasDelDia[mejor] ? i : mejor), 0)
  const superoMeta = dias.length > 0 && ventasDelDia[indiceMejor] > cuotaDiaria[indiceMejor]

  return {
    metaTotal: montoMeta,
    metaPorDia: dias.length > 0 ? redondear2(montoMeta / dias.length) : 0,
    cantidadDias: dias.length,
    ventaTotal: redondear2(sumBy(ventasDelDia, (monto) => monto)),
    mejorDia: superoMeta
      ? {
          fecha: aClaveDia(dias[indiceMejor]),
          monto: redondear2(ventasDelDia[indiceMejor]),
          excedente: redondear2(ventasDelDia[indiceMejor] - cuotaDiaria[indiceMejor]),
        }
      : null,
  }
}
