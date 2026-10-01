import { getFormatMoney } from '@/helpers/getFormatMoney'
import type { DetalleMembresiaVentaProps } from '../store/ventaSlice'

/** Redondeo a céntimos (el backend acepta máximo 2 decimales) */
const redondear2 = (valor: number) => Math.round(valor * 100) / 100

/** Montos de la membresía con descuento: montoTotal = precio del plan − descuento */
export const calcularMontosMembresia = (precio: number, descuento: number) => ({
  montoSinDescuento: redondear2(precio),
  montoDescuento: redondear2(descuento),
  montoTotal: redondear2(precio - descuento),
})

/**
 * Mensaje de error del descuento, o '' si es válido.
 * No puede superar el descuento máximo del plan (0 = sin límite) ni el precio del plan.
 */
export const errorDescuentoMembresia = ({ montoDescuento, montoSinDescuento, max_descuento_plan }: DetalleMembresiaVentaProps) => {
  if (max_descuento_plan > 0 && montoDescuento > max_descuento_plan) return `El descuento máximo del plan es ${getFormatMoney(max_descuento_plan)}`
  if (montoDescuento > montoSinDescuento) return `El descuento no puede superar el precio del plan (${getFormatMoney(montoSinDescuento)})`
  return ''
}
