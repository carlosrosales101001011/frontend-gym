import { groupBy } from '@/helpers/arrays'
import { sumBy } from '@/helpers/reports'
import type { PlanReporteVentasProps, VentaReporteVentasProps } from '../store/reporteVentasSlice'
import { ID_TODOS } from '../store/reporteVentasSlice'
import { montoMembresiaFila } from './resumenVentas'
import type { ItemBarra } from '@/components/ReporteBarras/barrasComparacion'

const duracion = (nMeses: number) => `${nMeses} ${nMeses === 1 ? 'mes' : 'meses'}`

/**
 * Lo vendido y la cantidad de membresías de cada plan (se cuentan membresías, no ventas).
 * Con un programa elegido solo cuentan sus membresías y el nombre es la duración ("3 meses");
 * con "Todos" el nombre lleva el programa ("Funcional · 3 meses"), porque cada programa tiene sus planes.
 */
export const agruparVentasPorPlan = (ventas: VentaReporteVentasProps[], planes: PlanReporteVentasProps[], idPrograma: number): ItemBarra[] => {
  // Cada membresía con lo que cuenta (por fecha de pago, su parte proporcional del pago)
  const membresias = ventas
    .flatMap((venta) => (venta.membresias ?? []).map((m) => ({ ...m, monto: montoMembresiaFila(venta, m) })))
    .filter((membresia) => idPrograma === ID_TODOS || membresia.id_programa === idPrograma)
  return Object.values(groupBy(membresias, (membresia) => membresia.id_plan)).map((membresiasPlan) => {
    const id = membresiasPlan[0].id_plan
    const plan = planes.find((p) => p.id === id)
    const nombre = !plan
      ? `Plan ${id}`
      : idPrograma === ID_TODOS ? `${plan.label_programa} · ${duracion(plan.nMeses)}` : duracion(plan.nMeses)
    return {
      id,
      nombre,
      monto: Math.round(sumBy(membresiasPlan, (membresia) => membresia.monto) * 100) / 100,
      cantidad: membresiasPlan.length,
    }
  })
}
