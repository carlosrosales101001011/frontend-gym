import type { VentaProps } from '../store/ventaSlice'

/** Redondeo a céntimos para no arrastrar errores de punto flotante al comparar */
const redondear2 = (valor: number) => Math.round(valor * 100) / 100

/** Total de la venta, lo pagado, el saldo pendiente y el vuelto (pagado − total, si se pagó de más) */
export const calcularMontosVenta = ({ detalleventa_productos, detalleventa_membresias, detalleventa_pagos }: VentaProps) => {
  const total = redondear2(
    detalleventa_productos.reduce((acc, item) => acc + Number(item.precio_unitario) * item.cantidad, 0) + detalleventa_membresias.montoTotal
  )
  const pagado = redondear2(detalleventa_pagos.reduce((acc, pago) => acc + Number(pago.montoPagos), 0))
  return {
    total,
    pagado,
    saldoPendiente: Math.max(redondear2(total - pagado), 0),
    vuelto: Math.max(redondear2(pagado - total), 0),
  }
}
