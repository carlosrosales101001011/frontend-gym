import { useAppSelector } from '@/stores/Store'

/** Significado de cada color de evento (los estados de la terminología, así no se desincroniza) */
export const LeyendaEstados = () => {
  const { estados } = useAppSelector((state) => state.AGENDA_NUTRICIONISTA)
  return (
    <div className="d-flex flex-wrap justify-content-center gap-3">
      {estados.map((estado) => (
        <div key={estado.value} className="d-flex align-items-center gap-1">
          <span className="agenda__leyenda-color" style={{ backgroundColor: estado.color }} />
          <span className="small fw-bold">{estado.label}</span>
        </div>
      ))}
    </div>
  )
}
