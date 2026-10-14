import { sumBy } from '@/helpers/reports'
import type { OpcionesSelect } from '@/types/props'
import type { VentaReporteProps } from '../store/reporteMetaSlice'

export type ResumenTipoCliente = {
  id_tipo_cli: number
  /** Nuevo, Renovación, Reinscripción... (terminología venta/cliente/tipo) */
  label: string
  /** Suma de montoTotal_membresia de esas ventas */
  montoTotal: number
  cantidad: number
}

const redondear2 = (monto: number) => Math.round(monto * 100) / 100

/** Monto y cantidad de ventas por tipo de cliente (venta.id_tipo_cli), en el orden de la terminología */
export const resumirPorTipoCliente = (tipos: OpcionesSelect[], ventas: VentaReporteProps[]): ResumenTipoCliente[] =>
  tipos.map((tipo) => {
    const delTipo = ventas.filter((venta) => venta.id_tipo_cli === Number(tipo.value))
    return {
      id_tipo_cli: Number(tipo.value),
      label: String(tipo.label),
      montoTotal: redondear2(sumBy(delTipo, (venta) => Number(venta.montoTotal_membresia) || 0)),
      cantidad: delTipo.length,
    }
  })
