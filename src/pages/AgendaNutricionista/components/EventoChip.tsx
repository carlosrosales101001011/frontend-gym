import type { CSSProperties } from 'react'
import classNames from 'classnames'
import IconCR from '@/components/Icons/IconCR'
import { useAppSelector } from '@/stores/Store'
import { duracionEvento, esEventoBloqueado, obtenerEstado, TEXTO_EVENTO_BLOQUEADO } from '../helpers/agendaHelpers'
import type { EventoAgendaProps } from '../store/agendaNutricionistaSlice'

type EventoChipProps = {
  evento: EventoAgendaProps
  onClick: (evento: EventoAgendaProps) => void
  style?: CSSProperties
  /** Horario arriba y nombre del cliente abajo (vista semana); si no, todo en una línea (vista mes) */
  dosLineas?: boolean
}

/** Evento dentro del calendario, pintado con el color de su estado */
export const EventoChip = ({ evento, onClick, style, dosLineas = false }: EventoChipProps) => {
  const { estados } = useAppSelector((state) => state.AGENDA_NUTRICIONISTA)
  const estado = obtenerEstado(estados, evento.id_estado)
  const bloqueado = esEventoBloqueado(estados, evento)
  return (
    <button
      type="button"
      className={classNames('agenda__evento', { 'agenda__evento--bloqueado': bloqueado, 'agenda__evento--dos-lineas': dosLineas })}
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
      {/* Inicio - fin · duración; el cliente al lado (mes) o abajo (semana) */}
      <span className="agenda__evento-horario">
        <span className="fw-bold">{evento.hora_inicio} - {evento.hora_fin}</span>
        <span className="opacity-75"> · {duracionEvento(evento)} min</span>
      </span>{' '}
      <span className="agenda__evento-nombre">{bloqueado ? TEXTO_EVENTO_BLOQUEADO : evento.label_cliente}</span>
    </button>
  )
}
