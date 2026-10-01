import { getPorcentaje } from '@/helpers/getPorcentaje'
import { sumBy } from '@/helpers/reports'
import { repartirEnPartesIguales } from '@/pages/GestionMeta/helpers/repartirMonto'
import type { VentaReporteProps } from '../store/reporteMetaSlice'
import { aClaveDia, diasDelPeriodo, ventaDiaria } from './ventasPorDia'

export type RitmoEquipo = {
  /** Venta acumulada total del periodo (montoTotal_membresia) */
  ventaAcumulada: number
  /** % de la venta acumulada sobre la meta total (puede pasar de 100) */
  porcentaje: number
  /** Ya pasó el último día de la meta */
  periodoTerminado: boolean
  /** En curso: días que faltan, contando hoy */
  diasRestantes: number
  /** En curso: lo que hay que vender por día para llegar a la meta (0 si ya se alcanzó) */
  porDia: number
  /** Terminado: días en que lo vendido ese día alcanzó la cuota diaria */
  diasLogrados: number
  /** Terminado: días en que lo vendido ese día no alcanzó la cuota diaria */
  diasNoLogrados: number
}

/**
 * Ritmo frente a la meta total del periodo.
 * La cuota diaria es la meta repartida en partes iguales entre todos los días (céntimos exactos).
 */
export const calcularRitmoEquipo = (
  fecha_inicio: string,
  fecha_fin: string,
  montoMeta: number,
  ventas: VentaReporteProps[],
): RitmoEquipo => {
  const dias = diasDelPeriodo(fecha_inicio, fecha_fin)
  const ventasDelDia = ventaDiaria(dias, ventas)
  const ventaAcumulada = Math.round(sumBy(ventasDelDia, (monto) => monto) * 100) / 100

  const hoy = aClaveDia(new Date())
  const periodoTerminado = hoy > aClaveDia(dias[dias.length - 1])
  // Días que faltan: de hoy (o del inicio, si la meta aún no empieza) hasta el último día
  const diasRestantes = periodoTerminado ? 0 : dias.filter((dia) => aClaveDia(dia) >= hoy).length
  const faltante = Math.max(montoMeta - ventaAcumulada, 0)

  const cuotaDiaria = repartirEnPartesIguales(montoMeta, dias.length)
  const diasLogrados = ventasDelDia.filter((venta, i) => venta >= cuotaDiaria[i]).length

  return {
    ventaAcumulada,
    porcentaje: getPorcentaje(ventaAcumulada, montoMeta),
    periodoTerminado,
    diasRestantes,
    porDia: diasRestantes > 0 ? Math.round((faltante / diasRestantes) * 100) / 100 : 0,
    diasLogrados,
    diasNoLogrados: dias.length - diasLogrados,
  }
}
