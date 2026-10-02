import IconCR from "@/components/Icons/IconCR"
import { formatDate } from "@/helpers/FormatDate"
import { getFormatMoney } from "@/helpers/getFormatMoney"
import { diasVencidos } from "@/helpers/diasMembresia"
import type { MembresiaActualProps } from "../hook/useMembresiaActual"

type CardMembresiaAsistenciaProps = {
  membresia: MembresiaActualProps | null
  cargando: boolean
}

/**
 * Membresía actual del cliente al registrar su asistencia: programa, plan y vencimiento.
 * Verde si la venta está pagada; rojo si falta pagar (con cuánto falta). Estilos en _cardMembresiaAsistencia.scss
 */
export const CardMembresiaAsistencia = ({ membresia, cargando }: CardMembresiaAsistenciaProps) => {
  if (cargando) {
    return (
      <div className="card-membresia-asistencia" aria-hidden="true">
        <span className="skeleton-cr" style={{ width: '55%', height: 14 }} />
        <span className="skeleton-cr mt-2" style={{ width: '35%', height: 11 }} />
        <span className="skeleton-cr mt-3" style={{ width: '45%', height: 11 }} />
      </div>
    )
  }

  if (!membresia) {
    return <div className="card-membresia-asistencia card-membresia-asistencia--sin">Sin membresía registrada</div>
  }

  const vencida = diasVencidos(membresia.fecha_vencimiento) > 0
  const falta = Math.max(0, membresia.montoTotal - membresia.montoPagado)
  const estado = membresia.pagado ? 'pagada' : 'deuda'

  return (
    <div className={`card-membresia-asistencia card-membresia-asistencia--${estado}`}>
      <div className="d-flex align-items-start justify-content-between gap-2">
        <div className="overflow-hidden">
          <div className="card-membresia-asistencia__programa">{membresia.label_programa || 'Sin programa'}</div>
          <div className="card-membresia-asistencia__plan">
            {[membresia.label_plan, membresia.label_horario].filter(Boolean).join(' · ') || 'Sin plan'}
          </div>
        </div>
        <span className="card-membresia-asistencia__estado">
          <IconCR name={membresia.pagado ? 'check' : 'times'} size={11} className="" />
          {membresia.pagado ? 'Pagada' : `Falta pagar ${getFormatMoney(falta)}`}
        </span>
      </div>
      <div className="card-membresia-asistencia__pie">
        {vencida ? 'Venció el ' : 'Vence el '}
        {formatDate(membresia.fecha_vencimiento, 'yyyy-mm-dd', 'dd/mm/yyyy')}
        {membresia.label_venta && ` · Comprobante ${membresia.label_venta}`}
      </div>
    </div>
  )
}
