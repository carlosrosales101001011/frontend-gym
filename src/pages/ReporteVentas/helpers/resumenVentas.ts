import { groupBy, uniqueById } from '@/helpers/arrays'
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
 * Lo que cuenta una membresía de la fila:
 * - por fecha de venta: su monto (montoTotal).
 * - por fecha de pago: la parte del pago que le toca, proporcional a su peso entre las membresías de la venta
 *   (ej. venta con Funcional 600 y Yoga 400, pago de 500 -> Funcional 300 y Yoga 200). Si las membresías no
 *   tienen monto, el pago se reparte en partes iguales. Así lo repartido suma exactamente el pago.
 */
export const montoMembresiaFila = (venta: VentaReporteVentasProps, membresia: MembresiaVentaReporteProps) => {
  if (!venta.pago) return Number(membresia.montoTotal) || 0
  const membresias = venta.membresias ?? []
  const totalMembresias = sumBy(membresias, (m) => Number(m.montoTotal) || 0)
  return totalMembresias > 0
    ? venta.pago.monto * (Number(membresia.montoTotal) || 0) / totalMembresias
    : venta.pago.monto / Math.max(membresias.length, 1)
}

/**
 * Lo que suma una fila en el reporte (base de "Total vendido/ingresado", cards y gráficos):
 * por fecha de venta, sus membresías; por fecha de pago, lo pagado. Con programa y/o plan elegidos,
 * solo la parte de las membresías que los cumplen.
 */
export const montoVendidoVenta = (venta: VentaReporteVentasProps, filtro: FiltroMembresia) =>
  sinFiltroMembresia(filtro)
    ? (venta.pago ? venta.pago.monto : Number(venta.montoTotal_membresia) || 0)
    : sumBy((venta.membresias ?? []).filter((m) => cumpleFiltroMembresia(m, filtro)), (m) => montoMembresiaFila(venta, m))

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
  // Pagado / no pagado son de cada venta una sola vez (por fecha de pago, una venta con dos pagos son dos filas)
  const ventasUnicas = uniqueById(ventas)

  // Deuda por cliente: se suman sus ventas del rango y cuenta si queda algo por pagar
  const deudaPorCliente = Object.values(groupBy(ventasUnicas, (venta) => venta.id_cli)).map((ventasCliente) => sumBy(ventasCliente, deudaVenta))

  return {
    totalVendido: redondear2(totalVendido),
    numeroClientes: new Set(ventas.map((venta) => venta.id_cli)).size,
    montoPagado: redondear2(sumBy(ventasUnicas, (venta) => Number(venta.montoPagos) || 0)),
    montoNoPagado: redondear2(sumBy(ventasUnicas, deudaVenta)),
    clientesConDeuda: deudaPorCliente.filter((deuda) => redondear2(deuda) > 0).length,
  }
}
