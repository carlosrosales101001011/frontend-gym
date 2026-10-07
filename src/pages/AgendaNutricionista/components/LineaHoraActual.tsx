import { format } from 'date-fns'
import { useFechaActual } from '@/hook/useFechaActual'
import { ALTO_SLOT, HORA_FIN_AGENDA, HORA_INICIO_AGENDA } from '../helpers/agendaHelpers'

type LineaHoraActualProps = {
  /** Duración de cada slot: define cuántos px ocupa cada minuto (igual que los eventos) */
  minutosxcli: number
}

/**
 * Línea de la hora actual en la columna de hoy (vista semana); se mueve cada minuto.
 * Fuera del horario de atención no se muestra. Estilos en _agenda.scss (.agenda__ahora).
 */
export const LineaHoraActual = ({ minutosxcli }: LineaHoraActualProps) => {
  const ahora = useFechaActual()
  const minutos = ahora.getHours() * 60 + ahora.getMinutes()
  if (minutos < HORA_INICIO_AGENDA * 60 || minutos > HORA_FIN_AGENDA * 60) return null

  const top = (minutos - HORA_INICIO_AGENDA * 60) * (ALTO_SLOT / minutosxcli)
  return (
    <div className="agenda__ahora" style={{ top }} aria-label={`Hora actual: ${format(ahora, 'HH:mm')}`}>
      <span className="agenda__ahora-hora">{format(ahora, 'HH:mm')}</span>
    </div>
  )
}
