import type { CSSProperties } from 'react'
import classNames from 'classnames'
import IconCR from '@/components/Icons/IconCR'
import { esEventoBloqueado, obtenerEstado, TEXTO_EVENTO_BLOQUEADO } from '../helpers/agendaHelpers'
import type { EventoAgendaProps } from '../store/agendaNutricionistaSlice'

type EventoChipProps = {
  evento: EventoAgendaProps
  onClick: (evento: EventoAgendaProps) => void
  style?: CSSProperties
}

/** Evento dentro del calendario, pintado con el color de su estado */
export const EventoChip = ({ evento, onClick, style }: EventoChipProps) => {
  const estado = obtenerEstado(evento.id_estado)
  const bloqueado = esEventoBloqueado(evento)
  return (
    <button
      type="button"
      className={classNames('agenda__evento', { 'agenda__evento--bloqueado': bloqueado })}
      style={{ backgroundColor: estado.color, ...style }}
      title={bloqueado
        ? `${evento.hora_inicio} - ${evento.hora_fin} · ${TEXTO_EVENTO_BLOQUEADO} (no editable)`
        : `${evento.hora_inicio} - ${evento.hora_fin} · ${evento.label_cliente ?? ''} · ${evento.label_nutricionista ?? ''} · ${estado.label}`}
      onClick={(e) => {
        // Evita que el click llegue a la celda del día / slot de atrás
        e.stopPropagation()
        onClick(evento)
      }}
    >
      {bloqueado && <IconCR name="lock" size={9} className="me-1" />}
      <span className="fw-bold">{evento.hora_inicio}</span> {bloqueado ? TEXTO_EVENTO_BLOQUEADO : evento.label_cliente}
    </button>
  )
}
