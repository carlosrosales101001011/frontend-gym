import { getPorcentaje } from '@/helpers/getPorcentaje'
import { sumBy } from '@/helpers/reports'
import { formatearMedida, type MedidaReporte } from './medidaReporte'

/** Lo vendido y la cantidad de ventas de un grupo (un asesor, un origen, ...) */
export type ItemBarra = {
  id: number
  nombre: string
  /** Lo vendido (misma base que "Total vendido") */
  monto: number
  /** Cantidad de ventas */
  cantidad: number
}

export type BarraComparacion = {
  id: number
  nombre: string
  /** Valor de la barra según la medida elegida (monto o cantidad) */
  valor: number
  /** Texto al final de la barra (montos en versión corta: S/ 4 mil) */
  etiqueta: string
  /** % que representa del total de la card (todas suman 100) */
  participacion: number
  /** % de alcance del elegido sobre este valor; null si no hay elegido o si no vendió más que el elegido */
  alcance: number | null
}

/**
 * Barras según la medida, de mayor a menor. Etiqueta:
 * - sin elegido, para el elegido y para quienes tienen igual o menos: solo el valor;
 * - para quienes tienen MÁS que el elegido: "[valor] ([diferencia] | [% de alcance])", donde
 *   diferencia = lo que le falta al elegido y % de alcance = elegido ÷ ese valor.
 *   ej. monto: "S/ 4.2 mil (S/ 1.5 mil | 65.5%)" · cantidad: "12 (3 | 75%)".
 */
export const prepararBarras = (items: ItemBarra[], medida: MedidaReporte, idElegido: number | null): BarraComparacion[] => {
  const total = sumBy(items, (item) => item[medida])
  const barras = items
    .map((item) => ({
      id: item.id,
      nombre: item.nombre,
      valor: item[medida],
      etiqueta: '',
      participacion: Math.round(getPorcentaje(item[medida], total) * 10) / 10,
      alcance: null as number | null,
    }))
    .sort((a, b) => b.valor - a.valor)
  const elegido = barras.find((barra) => barra.id === idElegido)
  return barras.map((barra) => {
    if (!elegido || barra.valor <= elegido.valor) return { ...barra, etiqueta: formatearMedida(barra.valor, medida, true) }
    const faltante = Math.round((barra.valor - elegido.valor) * 100) / 100
    const alcance = Math.round(getPorcentaje(elegido.valor, barra.valor) * 10) / 10
    return { ...barra, alcance, etiqueta: `${formatearMedida(barra.valor, medida, true)} (${formatearMedida(faltante, medida, true)} | ${alcance}%)` }
  })
}
