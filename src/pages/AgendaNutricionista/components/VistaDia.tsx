import classNames from 'classnames'
import IconCR from '@/components/Icons/IconCR'
import { esEventoBloqueado, eventosDelDia, obtenerEstado, TEXTO_EVENTO_BLOQUEADO } from '../helpers/agendaHelpers'
import type { EventoAgendaProps } from '../store/agendaNutricionistaSlice'

type VistaDiaProps = {
  fecha: Date
  eventos: EventoAgendaProps[]
  onSeleccionarEvento: (evento: EventoAgendaProps) => void
}

/** Lista de los eventos del día ordenados por hora */
export const VistaDia = ({ fecha, eventos, onSeleccionarEvento }: VistaDiaProps) => {
  const eventosDia = eventosDelDia(eventos, fecha)

  if (eventosDia.length === 0) {
    return <div className="text-center py-5">No hay eventos para este día</div>
  }

  return (
    <div className="d-flex flex-column gap-2">
      {eventosDia.map((evento) => {
        const estado = obtenerEstado(evento.id_estado)
        const bloqueado = esEventoBloqueado(evento)
        return (
          <div
            key={evento.id}
            className={classNames('agenda__dia-item card-mode-actual', { 'item-hover-actual': !bloqueado, 'agenda__dia-item--bloqueado': bloqueado })}
            style={{ borderLeftColor: estado.color }}
            onClick={() => onSeleccionarEvento(evento)}
          >
            <div className="fw-bold fs-5" style={{ minWidth: 120 }}>
              {evento.hora_inicio} - {evento.hora_fin}
            </div>
            {bloqueado ? (
              <div className="flex-grow-1 fw-bold d-flex align-items-center gap-2">
                <IconCR name="lock" size={14} /> {TEXTO_EVENTO_BLOQUEADO}
              </div>
            ) : (
              <div className="flex-grow-1">
                <div className="fw-bold">{evento.label_cliente}</div>
                <div className="small">Nutricionista: {evento.label_nutricionista}</div>
              </div>
            )}
            <span className="agenda__estado" style={{ backgroundColor: estado.color }}>
              {estado.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
