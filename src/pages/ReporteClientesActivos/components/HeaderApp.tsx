import { BadgeCR } from '@/components/Badge/BadgeCR'
import { DIMENSIONES, type DimensionCliente, type FiltrosClientes } from '../helpers/resumenClientesActivos'

type HeaderAppProps = {
  filtros: FiltrosClientes
  onQuitar: (dimension: DimensionCliente) => void
  onLimpiar: () => void
}

/** Filtros elegidos haciendo click en las tablas de las cards, como badges con equis ("Distrito: Rimac"); sin filtros no se muestra */
export const HeaderApp = ({ filtros, onQuitar, onLimpiar }: HeaderAppProps) => {
  const elegidos = Object.entries(filtros) as [DimensionCliente, string][]
  if (!elegidos.length) return null

  // BadgeCR identifica por número: el índice del filtro. sticky-header-app: se queda debajo de la topbar al hacer scroll
  return (
    <div className="card-mode-actual rounded p-3 mb-3 d-flex flex-wrap align-items-center gap-2 sticky-header-app">
      <span className="small fw-semibold opacity-75 me-1">Filtrado por:</span>
      {elegidos.map(([dimension, grupo], i) => (
        <BadgeCR key={dimension} id={i} label={`${DIMENSIONES[dimension].nombre}: ${grupo}`} onRemove={() => onQuitar(dimension)} />
      ))}
      {elegidos.length > 1 && (
        <button type="button" className="btn btn-link btn-sm p-0 ms-1" onClick={onLimpiar}>Quitar todos</button>
      )}
    </div>
  )
}
