import { groupBy } from '@/helpers/arrays'
import { sumBy } from '@/helpers/reports'
import type { OpcionesSelect } from '@/types/props'
import type { VentaReporteVentasProps } from '../store/reporteVentasSlice'
import type { ItemBarra } from './barrasComparacion'
import { ID_TODOS } from '../store/reporteVentasSlice'

/**
 * Lo vendido y la cantidad de membresías de cada programa.
 * Una venta puede tener varias membresías (de uno o varios programas): se cuentan las membresías,
 * no las ventas. Los nombres salen de las opciones de programas del header.
 * Con un plan elegido, solo cuentan las membresías de ese plan.
 */
export const agruparVentasPorPrograma = (ventas: VentaReporteVentasProps[], programas: OpcionesSelect[], idPlan: number): ItemBarra[] => {
  const membresias = ventas.flatMap((venta) => venta.membresias ?? []).filter((m) => idPlan === ID_TODOS || m.id_plan === idPlan)
  return Object.values(groupBy(membresias, (membresia) => membresia.id_programa)).map((membresiasPrograma) => {
    const id = membresiasPrograma[0].id_programa
    return {
      id,
      nombre: programas.find((programa) => programa.value === id)?.label ?? `Programa ${id}`,
      monto: Math.round(sumBy(membresiasPrograma, (membresia) => Number(membresia.montoTotal) || 0) * 100) / 100,
      cantidad: membresiasPrograma.length,
    }
  })
}
