import { groupBy } from '@/helpers/arrays'
import { sumBy } from '@/helpers/reports'
import type { VentaReporteVentasProps } from '../store/reporteVentasSlice'
import { montoVendidoVenta, type FiltroMembresia } from './resumenVentas'
import type { ItemBarra } from './barrasComparacion'

/** Lo vendido y la cantidad de ventas de cada origen */
export const agruparVentasPorOrigen = (ventas: VentaReporteVentasProps[], filtro: FiltroMembresia): ItemBarra[] =>
  Object.values(groupBy(ventas, (venta) => venta.id_origen)).map((ventasOrigen) => ({
    id: ventasOrigen[0].id_origen,
    nombre: ventasOrigen[0].label_origen || 'Sin origen',
    monto: Math.round(sumBy(ventasOrigen, (venta) => montoVendidoVenta(venta, filtro)) * 100) / 100,
    cantidad: ventasOrigen.length,
  }))
