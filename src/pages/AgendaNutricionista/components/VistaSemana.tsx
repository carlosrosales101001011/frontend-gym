import classNames from 'classnames'
import { format, isToday } from 'date-fns'
import { es } from 'date-fns/locale'
import {
  ALTO_SLOT,
  aMinutos,
  diasDeLaSemana,
  eventosDelDia,
  HORA_INICIO_AGENDA,
  slotsDelDia,
} from '../helpers/agendaHelpers'
import type { EventoAgendaProps } from '../store/agendaNutricionistaSlice'
import { EventoChip } from './EventoChip'
import { LineaHoraActual } from './LineaHoraActual'

type VistaSemanaProps = {
  fecha: Date
  eventos: EventoAgendaProps[]
  /** Duración de cada cita: la grilla se divide en slots de este tamaño */
  minutosxcli: number
  /** Click en un slot libre: día y hora de inicio ("HH:mm") de la cita */
  onSeleccionarSlot: (dia: Date, hora: string) => void
  onSeleccionarEvento: (evento: EventoAgendaProps) => void
  onVerDia: (dia: Date) => void
}

export const VistaSemana = ({ fecha, eventos, minutosxcli, onSeleccionarSlot, onSeleccionarEvento, onVerDia }: VistaSemanaProps) => {
  const dias = diasDeLaSemana(fecha)
  const slots = slotsDelDia(minutosxcli)

  /** Posición vertical del evento según su hora de inicio y fin */
  const estiloEvento = (evento: EventoAgendaProps) => {
    const pxPorMinuto = ALTO_SLOT / minutosxcli
    const top = (aMinutos(evento.hora_inicio) - HORA_INICIO_AGENDA * 60) * pxPorMinuto
    const alto = (aMinutos(evento.hora_fin) - aMinutos(evento.hora_inicio)) * pxPorMinuto
    return { top: top + 1, height: alto - 2 }
  }

  return (
    <div className="agenda__semana">
      <div className="agenda__semana-cabecera" />
      {dias.map((dia) => (
        <button
          key={dia.toISOString()}
          type="button"
          className={classNames('agenda__semana-cabecera text-capitalize', { 'agenda__semana-cabecera--hoy': isToday(dia) })}
          onClick={() => onVerDia(dia)}
          title="Ver eventos del día"
        >
          {format(dia, 'EEEE d', { locale: es })}
        </button>
      ))}

      <div>
        {slots.map((hora) => (
          <div key={hora} className="agenda__semana-hora" style={{ height: ALTO_SLOT }}>
            {/* Hora en punto grande; los demás pasos solo sus minutos, en gris */}
            {hora.endsWith(':00')
              ? <span className="agenda__semana-hora-punta">{hora}</span>
              : <span className="agenda__semana-hora-min">:{hora.slice(3)}</span>}
          </div>
        ))}
      </div>
      {dias.map((dia) => (
        <div key={dia.toISOString()} className={classNames('agenda__semana-columna', { 'agenda__semana-columna--hoy': isToday(dia) })}>
          {slots.map((hora) => (
            <div
              key={hora}
              className={classNames('agenda__semana-slot', { 'agenda__semana-slot--hora': hora.endsWith(':00') })}
              style={{ height: ALTO_SLOT }}
              onClick={() => onSeleccionarSlot(dia, hora)}
              title={`Agendar cita a las ${hora}`}
            >
              {hora}
            </div>
          ))}
          {isToday(dia) && <LineaHoraActual minutosxcli={minutosxcli} />}
          {/* Los slots ocupados quedan tapados por su evento (que abre la edición) */}
          {eventosDelDia(eventos, dia).map((evento) => (
            <EventoChip
              key={evento.id}
              evento={evento}
              onClick={onSeleccionarEvento}
              dosLineas
              style={{ position: 'absolute', left: 2, right: 2, ...estiloEvento(evento) }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
