import classNames from 'classnames'
import { format, isSameMonth, isToday } from 'date-fns'
import { diasDelMes, diasDeLaSemana, eventosDelDia } from '../helpers/agendaHelpers'
import type { EventoAgendaProps } from '../store/agendaNutricionistaSlice'
import { EventoChip } from './EventoChip'
import { es } from 'date-fns/locale'
import { SkeletonEventosCalendario } from '@/components/Calendario/SkeletonEventosCalendario'

/** Cantidad de eventos visibles por celda; el resto se ve en la vista día */
const MAX_EVENTOS_POR_DIA = 3

type VistaMesProps = {
  fecha: Date
  eventos: EventoAgendaProps[]
  /** Mientras se piden las citas: skeleton en lugar de los eventos y no se puede ir a agendar */
  cargando?: boolean
  /** Click en la celda del día (ej: ir a la semana para agendar) */
  onSeleccionarDia: (dia: Date) => void
  onSeleccionarEvento: (evento: EventoAgendaProps) => void
  onVerDia: (dia: Date) => void
  /** Cita con borde brillante (coincidencia actual del buscador) */
  idResaltado?: number
}

export const VistaMes = ({ fecha, eventos, cargando = false, onSeleccionarDia, onSeleccionarEvento, onVerDia, idResaltado }: VistaMesProps) => {
  return (
    <div className="agenda__mes">
      {diasDeLaSemana(fecha).map((dia) => (
        <div key={dia.toISOString()} className="agenda__mes-cabecera text-capitalize">
          {format(dia, 'EEEE', { locale: es })}
        </div>
      ))}
      {diasDelMes(fecha).map((dia, indiceDia) => {
        const eventosDia = eventosDelDia(eventos, dia)
        const ocultos = eventosDia.length - MAX_EVENTOS_POR_DIA
        return (
          <div
            key={dia.toISOString()}
            className={classNames('agenda__mes-dia', {
              'agenda__mes-dia--fuera': !isSameMonth(dia, fecha),
              'agenda__mes-dia--hoy': isToday(dia),
            })}
            onClick={() => { if (!cargando) onSeleccionarDia(dia) }}
            title={cargando ? 'Cargando citas…' : 'Click para agendar en la semana de este día'}
          >
            <button
              type="button"
              className={classNames('agenda__numero-dia', { 'agenda__numero-dia--hoy': isToday(dia) })}
              onClick={(e) => { e.stopPropagation(); onVerDia(dia) }}
              title="Ver eventos del día"
            >
              {format(dia, 'd')}
            </button>
            {/* Solo los días del mes tienen citas (el rango pedido es el mes) */}
            {cargando && isSameMonth(dia, fecha) && <SkeletonEventosCalendario variante="mes" indice={indiceDia} />}
            {!cargando && eventosDia.slice(0, MAX_EVENTOS_POR_DIA).map((evento) => (
              <EventoChip key={evento.id} evento={evento} onClick={onSeleccionarEvento} resaltado={evento.id === idResaltado} />
            ))}
            {!cargando && ocultos > 0 && (
              <button
                type="button"
                className="agenda__ver-mas"
                onClick={(e) => { e.stopPropagation(); onVerDia(dia) }}
              >
                +{ocultos} más
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
