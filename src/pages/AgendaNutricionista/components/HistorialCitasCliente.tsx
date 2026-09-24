import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { localDateStringToDate } from '@/helpers/getDate'
import { citasDelCliente, obtenerEstado } from '../helpers/agendaHelpers'
import type { EventoAgendaProps } from '../store/agendaNutricionistaSlice'

type HistorialCitasClienteProps = {
  eventos: EventoAgendaProps[]
  /** Cliente seleccionado en el modal; sin cliente la columna queda desactivada */
  id_cli?: number
  /** Evento que se está editando: no se lista en su propio historial */
  idEvento: number
}

/** Columna del modal con las citas que tuvo (y tiene agendadas) el cliente seleccionado */
export const HistorialCitasCliente = ({ eventos, id_cli, idEvento }: HistorialCitasClienteProps) => {
  if (!id_cli) {
    return (
      <div className="agenda__historial agenda__historial--inactivo">
        Selecciona un cliente para ver sus citas
      </div>
    )
  }

  const citas = citasDelCliente(eventos, id_cli, idEvento)
  return (
    <div className="agenda__historial">
      <div className="fw-bold mb-2">Citas del cliente ({citas.length})</div>
      {citas.length === 0 && <div className="small">El cliente no tiene otras citas registradas</div>}
      <div className="agenda__historial-lista scroll-mode-actual">
        {citas.map((cita) => {
          const estado = obtenerEstado(cita.id_estado)
          return (
            <div key={cita.id} className="agenda__historial-item" style={{ borderLeftColor: estado.color }}>
              <div className="d-flex justify-content-between gap-2">
                <span className="fw-bold text-capitalize">
                  {format(localDateStringToDate(cita.fecha), "EEE d MMM yyyy", { locale: es })}
                </span>
                <span className="agenda__historial-estado" style={{ backgroundColor: estado.color }}>{estado.label}</span>
              </div>
              <div className="small">{cita.hora_inicio} - {cita.hora_fin} · {cita.label_nutricionista ?? ''}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
