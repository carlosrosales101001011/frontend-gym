import { getFormatMoney } from '@/helpers/getFormatMoney'

/** Qué miden los gráficos del reporte: lo vendido (S/) o la cantidad de ventas */
export type MedidaReporte = 'monto' | 'cantidad'

/** Valor para mostrar: soles con 2 decimales (o la versión corta, para gráficos), o la cantidad entera */
export const formatearMedida = (valor: number, medida: MedidaReporte, is_version_cut = false) =>
  medida === 'monto' ? getFormatMoney(valor, { is_version_cut }) : String(valor)
