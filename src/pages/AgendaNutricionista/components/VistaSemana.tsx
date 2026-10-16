import { useEffect, useRef } from 'react'
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
import { SkeletonEventosCalendario } from '@/components/Calendario/SkeletonEventosCalendario'

/** Mantener presionada una flecha: cada cuánto vuelve a desplazar */
const REPETIR_DESPLAZAMIENTO_MS = 250

type VistaSemanaProps = {
  fecha: Date
  eventos: EventoAgendaProps[]
  /** Mientras se piden las citas: skeleton en lugar de los eventos y no se puede agendar */
  cargando?: boolean
  /** Duración de cada cita: la grilla se divide en slots de este tamaño */
  minutosxcli: number
  /** Click en un slot libre: día y hora de inicio ("HH:mm") de la cita */
  onSeleccionarSlot: (dia: Date, hora: string) => void
  onSeleccionarEvento: (evento: EventoAgendaProps) => void
  onVerDia: (dia: Date) => void
  /** Cita con borde brillante (coincidencia actual del buscador) */
  idResaltado?: number
}

export const VistaSemana = ({ fecha, eventos, cargando = false, minutosxcli, onSeleccionarSlot, onSeleccionarEvento, onVerDia, idResaltado }: VistaSemanaProps) => {
  const dias = diasDeLaSemana(fecha)
  const slots = slotsDelDia(minutosxcli)

  // Flechas de la columna de horas: desplazan 1 hora el contenedor con scroll (el padre de la grilla)
  const raiz = useRef<HTMLDivElement>(null)
  const repeticion = useRef<number | undefined>(undefined)
  const altoHora = (60 / minutosxcli) * ALTO_SLOT
  const desplazar = (sentido: 1 | -1) => raiz.current?.parentElement?.scrollBy({ top: sentido * altoHora, behavior: 'smooth' })
  const detener = () => window.clearInterval(repeticion.current)
  const iniciar = (sentido: 1 | -1) => {
    detener()
    desplazar(sentido)
    repeticion.current = window.setInterval(() => desplazar(sentido), REPETIR_DESPLAZAMIENTO_MS)
  }
  useEffect(() => detener, [])
  const propsFlecha = (sentido: 1 | -1) => ({
    type: 'button' as const,
    className: 'agenda__semana-flecha',
    onPointerDown: () => iniciar(sentido),
    onPointerUp: detener,
    onPointerLeave: detener,
    title: sentido === -1 ? 'Subir 1 hora' : 'Bajar 1 hora',
    'aria-label': sentido === -1 ? 'Subir 1 hora' : 'Bajar 1 hora',
  })

  /** Posición vertical del evento según su hora de inicio y fin */
  const estiloEvento = (evento: EventoAgendaProps) => {
    const pxPorMinuto = ALTO_SLOT / minutosxcli
    const top = (aMinutos(evento.hora_inicio) - HORA_INICIO_AGENDA * 60) * pxPorMinuto
    const alto = (aMinutos(evento.hora_fin) - aMinutos(evento.hora_inicio)) * pxPorMinuto
    return { top: top + 1, height: alto - 2 }
  }

  return (
    <div className="agenda__semana" ref={raiz}>
      {/* Esquina de la columna de horas (al lado del lunes): ▲ y ▼ juntas, fijas arriba */}
      <div className="agenda__semana-cabecera agenda__semana-cabecera--flecha">
        <button {...propsFlecha(-1)}>▲</button>
        <button {...propsFlecha(1)}>▼</button>
      </div>
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
      {dias.map((dia, indiceDia) => (
        <div key={dia.toISOString()} className={classNames('agenda__semana-columna', { 'agenda__semana-columna--hoy': isToday(dia) })}>
          {slots.map((hora) => (
            <div
              key={hora}
              className={classNames('agenda__semana-slot', { 'agenda__semana-slot--hora': hora.endsWith(':00') })}
              style={{ height: ALTO_SLOT }}
              onClick={() => { if (!cargando) onSeleccionarSlot(dia, hora) }}
              title={cargando ? 'Cargando citas…' : `Agendar cita a las ${hora}`}
            >
              {hora}
            </div>
          ))}
          {isToday(dia) && <LineaHoraActual minutosxcli={minutosxcli} />}
          {cargando && <SkeletonEventosCalendario variante="semana" altoColumna={slots.length * ALTO_SLOT} indice={indiceDia} />}
          {/* Los slots ocupados quedan tapados por su evento (que abre la edición) */}
          {!cargando && eventosDelDia(eventos, dia).map((evento) => (
            <EventoChip
              key={evento.id}
              evento={evento}
              onClick={onSeleccionarEvento}
              dosLineas
              resaltado={evento.id === idResaltado}
              style={{ position: 'absolute', left: 2, right: 2, ...estiloEvento(evento) }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
