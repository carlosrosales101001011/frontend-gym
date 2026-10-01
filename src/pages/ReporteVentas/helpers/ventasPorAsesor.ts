import { groupBy } from '@/helpers/arrays'
import { sumBy } from '@/helpers/reports'
import type { VentaReporteVentasProps } from '../store/reporteVentasSlice'
import { montoVendidoVenta, type FiltroMembresia } from './resumenVentas'
import type { ItemBarra } from './barrasComparacion'

/** Lo vendido y la cantidad de ventas de cada asesor */
export const agruparVentasPorAsesor = (ventas: VentaReporteVentasProps[], filtro: FiltroMembresia): ItemBarra[] =>
  Object.values(groupBy(ventas, (venta) => venta.id_empl)).map((ventasAsesor) => ({
    id: ventasAsesor[0].id_empl,
    nombre: ventasAsesor[0].label_nombres_apellidos_empl || 'Sin asesor',
    monto: Math.round(sumBy(ventasAsesor, (venta) => montoVendidoVenta(venta, filtro)) * 100) / 100,
    cantidad: ventasAsesor.length,
  }))
