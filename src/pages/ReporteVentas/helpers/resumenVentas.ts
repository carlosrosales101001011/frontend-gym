import { groupBy } from '@/helpers/arrays'
import { sumBy } from '@/helpers/reports'
import type { MembresiaVentaReporteProps, VentaReporteVentasProps } from '../store/reporteVentasSlice'
import { ID_TODOS } from '../store/reporteVentasSlice'

export type ResumenVentas = {
  /** Membresías vendidas (con un programa elegido, solo las de ese programa) */
  totalVendido: number
  /** Clientes distintos con ventas */
  numeroClientes: number
  /** Lo pagado de esas ventas */
  montoPagado: number
  /** Lo que falta pagar: total real de cada venta (membresías + productos) − lo pagado */
  montoNoPagado: number
  /** Clientes distintos que aún deben algo */
  clientesConDeuda: number
}

const redondear2 = (monto: number) => Math.round(monto * 100) / 100

/** Programa y plan elegidos en el header (ID_TODOS = sin filtrar); se aplican sobre las membresías de cada venta */
export type FiltroMembresia = { idPrograma: number, idPlan: number }

const sinFiltroMembresia = ({ idPrograma, idPlan }: FiltroMembresia) => idPrograma === ID_TODOS && idPlan === ID_TODOS

/** La membresía cumple el programa y el plan elegidos */
export const cumpleFiltroMembresia = (membresia: MembresiaVentaReporteProps, { idPrograma, idPlan }: FiltroMembresia) =>
  (idPrograma === ID_TODOS || membresia.id_programa === idPrograma) && (idPlan === ID_TODOS || membresia.id_plan === idPlan)

/** La venta incluye al menos una membresía que cumple el filtro (sin filtro: todas las ventas) */
export const ventaCumpleFiltroMembresia = (venta: VentaReporteVentasProps, filtro: FiltroMembresia) =>
  sinFiltroMembresia(filtro) || (venta.membresias ?? []).some((membresia) => cumpleFiltroMembresia(membresia, filtro))

/**
 * Lo vendido en una venta para el reporte: solo membresías; con programa y/o plan elegidos,
 * solo las membresías que los cumplen. (Base de "Total vendido" y de los gráficos.)
 */
export const montoVendidoVenta = (venta: VentaReporteVentasProps, filtro: FiltroMembresia) =>
  sinFiltroMembresia(filtro)
    ? Number(venta.montoTotal_membresia) || 0
    : sumBy((venta.membresias ?? []).filter((m) => cumpleFiltroMembresia(m, filtro)), (m) => Number(m.montoTotal) || 0)

/** Deuda de una venta: su total real (membresías + productos, con descuento) menos lo pagado; nunca negativa */
const deudaVenta = (venta: VentaReporteVentasProps) =>
  Math.max((Number(venta.montoTotal_membresia) || 0) + (Number(venta.montoTotal_productos) || 0) - (Number(venta.montoPagos) || 0), 0)

/**
 * Datos del Header2App del reporte de ventas, sobre las ventas ya filtradas.
 * "Total vendido" es solo membresías; pagado / no pagado usan el total real de la venta porque los pagos
 * cubren membresías y productos (por eso total vendido no tiene por qué ser pagado + no pagado).
 */
export const calcularResumenVentas = (ventas: VentaReporteVentasProps[], filtro: FiltroMembresia): ResumenVentas => {
  const totalVendido = sumBy(ventas, (venta) => montoVendidoVenta(venta, filtro))

  // Deuda por cliente: se suman sus ventas del rango y cuenta si queda algo por pagar
  const deudaPorCliente = Object.values(groupBy(ventas, (venta) => venta.id_cli)).map((ventasCliente) => sumBy(ventasCliente, deudaVenta))

  return {
    totalVendido: redondear2(totalVendido),
    numeroClientes: new Set(ventas.map((venta) => venta.id_cli)).size,
    montoPagado: redondear2(sumBy(ventas, (venta) => Number(venta.montoPagos) || 0)),
    montoNoPagado: redondear2(sumBy(ventas, deudaVenta)),
    clientesConDeuda: deudaPorCliente.filter((deuda) => redondear2(deuda) > 0).length,
  }
}
