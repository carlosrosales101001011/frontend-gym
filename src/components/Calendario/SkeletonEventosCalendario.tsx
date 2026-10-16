/**
 * Skeleton de eventos para calendarios (mientras se piden los eventos). Usa la clase .skeleton-cr; los estilos
 * propios están en _SkeletonEventosCalendario.scss. El dibujo no es aleatorio: depende de `indice` (columna o día),
 * así no "salta" en cada render.
 *
 * - variante "semana": bloques sueltos dentro de la columna de un día (la columna debe ser position: relative).
 * - variante "mes": barritas dentro de la celda de un día.
 * - variante "dia": filas de la lista del día.
 */
type SkeletonEventosCalendarioProps =
  | {
      variante: 'semana'
      /** Alto total de la columna en px (todos los slots del día) */
      altoColumna: number
      /** Columna (0 = primer día): cambia dónde caen los bloques */
      indice: number
    }
  | {
      variante: 'mes'
      /** Celda del mes: cambia cuántas barritas tiene (1 a 3) */
      indice: number
    }
  | {
      variante: 'dia'
      /** Filas a mostrar (default: 4) */
      filas?: number
    }

/** Posición (fracción del alto) y alto (fracción) de los bloques de la vista semana; se rotan por columna */
const BLOQUES_SEMANA: [number, number][] = [
  [0.06, 0.05], [0.22, 0.07], [0.41, 0.05], [0.63, 0.06], [0.82, 0.05],
]

export const SkeletonEventosCalendario = (props: SkeletonEventosCalendarioProps) => {
  if (props.variante === 'semana') {
    const { altoColumna, indice } = props
    // Cada columna usa 3 de los 5 bloques, empezando en un lugar distinto
    const bloques = [0, 2, 3].map((paso) => BLOQUES_SEMANA[(indice + paso) % BLOQUES_SEMANA.length])
    return (
      <>
        {bloques.map(([top, alto], i) => (
          <span
            key={i}
            className="skeleton-cr skeleton-eventos-calendario__bloque"
            style={{ top: Math.round(top * altoColumna), height: Math.max(20, Math.round(alto * altoColumna)) }}
            aria-hidden="true"
          />
        ))}
      </>
    )
  }

  if (props.variante === 'mes') {
    const cantidad = (props.indice % 3) + 1
    return (
      <div className="skeleton-eventos-calendario__mes" aria-hidden="true">
        {Array.from({ length: cantidad }, (_, i) => (
          <span key={i} className="skeleton-cr" style={{ height: 16, width: i === cantidad - 1 ? '70%' : '100%' }} />
        ))}
      </div>
    )
  }

  const filas = props.filas ?? 4
  return (
    <div className="d-flex flex-column gap-2" aria-label="Cargando eventos">
      {Array.from({ length: filas }, (_, i) => (
        <div key={i} className="skeleton-eventos-calendario__fila card-mode-actual">
          <div style={{ minWidth: 120 }}>
            <span className="skeleton-cr" style={{ width: 100, height: 16 }} />
            <span className="skeleton-cr mt-2" style={{ width: 50, height: 10 }} />
          </div>
          <div className="flex-grow-1">
            <span className="skeleton-cr" style={{ width: '45%', height: 14 }} />
            <span className="skeleton-cr mt-2" style={{ width: '30%', height: 10 }} />
          </div>
          <span className="skeleton-cr" style={{ width: 80, height: 22, borderRadius: 999 }} />
        </div>
      ))}
    </div>
  )
}
