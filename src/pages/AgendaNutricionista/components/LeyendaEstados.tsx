import { ESTADOS_EVENTO } from '../helpers/agendaHelpers'

/** Significado de cada color de evento (sale de ESTADOS_EVENTO, así no se desincroniza) */
export const LeyendaEstados = () => {
  return (
    <div className="d-flex flex-wrap justify-content-center gap-3">
      {ESTADOS_EVENTO.map((estado) => (
        <div key={estado.value} className="d-flex align-items-center gap-1">
          <span className="agenda__leyenda-color" style={{ backgroundColor: estado.color }} />
          <span className="small fw-bold">{estado.label}</span>
        </div>
      ))}
    </div>
  )
}
