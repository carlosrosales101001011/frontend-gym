import type { ReactNode } from 'react'
import IconCR, { type IconName } from '@/components/Icons/IconCR'

type CardResumenProps = {
  icono: IconName
  titulo: string
  valor: ReactNode
  /** Texto chico debajo del valor */
  detalle?: string
  /** Muestra un skeleton en lugar del valor */
  cargando?: boolean
}

/**
 * Card pequeña de un dato (ícono, título, valor grande y detalle), para resúmenes de reportes y listados.
 * Varias juntas van dentro de .card-resumen-grupo. Estilos en _CardResumen.scss.
 */
export const CardResumen = ({ icono, titulo, valor, detalle, cargando = false }: CardResumenProps) => (
  <div className="card-mode-actual rounded card-resumen">
    <span className="card-resumen__icono icono-modulo">
      <IconCR name={icono} size={18} className="" />
    </span>
    <div className="min-w-0">
      <div className="card-resumen__titulo">{titulo}</div>
      {cargando
        ? <span className="skeleton-cr d-block my-1" style={{ width: 90, height: 22 }} />
        : <div className="card-resumen__valor">{valor}</div>}
      {detalle && <div className="card-resumen__detalle">{detalle}</div>}
    </div>
  </div>
)
