import IconCR from '@/components/Icons/IconCR'
import { OPCIONES_POR_PAGINA, paginasVisibles, rangoPagina } from '@/helpers/paginacion'

type PaginacionCRProps = {
  /** Página actual (empieza en 1) */
  pagina: number
  /** Registros por página */
  porPagina: number
  /** Total de registros (de todas las páginas) */
  total: number
  /** Cantidad de páginas si la calcula quien la usa; si no, sale de total / porPagina */
  totalPaginas?: number
  onCambiarPagina: (pagina: number) => void
  /** Sin él no se muestra el selector de registros por página */
  onCambiarPorPagina?: (porPagina: number) => void
  opcionesPorPagina?: number[]
  className?: string
}

/**
 * Paginación de las tablas: "Mostrando 21–40 de 76", registros por página y la barra de páginas.
 * Solo dibuja: quién la usa guarda la página (en la URL, en estado...). Estilos en _PaginacionCR.scss.
 */
export const PaginacionCR = ({
  pagina, porPagina, total, totalPaginas: totalPaginasProp, onCambiarPagina, onCambiarPorPagina,
  opcionesPorPagina = OPCIONES_POR_PAGINA, className = '',
}: PaginacionCRProps) => {
  const totalPaginas = Math.max(1, totalPaginasProp ?? Math.ceil(total / (porPagina || 1)))
  const actual = Math.min(Math.max(1, pagina), totalPaginas)
  const { desde, hasta } = rangoPagina(actual, porPagina, total)

  const ir = (p: number) => {
    if (p < 1 || p > totalPaginas || p === actual) return
    onCambiarPagina(p)
  }

  return (
    <nav className={`paginacion-cr tfoot-actual ${className}`} aria-label="Paginación">
      <div className="paginacion-cr__info">
        <span>
          Mostrando <strong>{desde}–{hasta}</strong> de <strong>{total}</strong>
        </span>
        {onCambiarPorPagina && (
          <label className="paginacion-cr__por-pagina">
            Filas por página
            <select
              className="paginacion-cr__select"
              value={porPagina}
              onChange={(e) => onCambiarPorPagina(Number(e.target.value))}
            >
              {opcionesPorPagina.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
        )}
      </div>

      <div className="paginacion-cr__paginas">
        <button type="button" className="paginacion-cr__boton" onClick={() => ir(actual - 1)}
          disabled={actual === 1} aria-label="Página anterior" title="Anterior">
          <IconCR name="arrowLeft" size={16} />
        </button>
        {paginasVisibles(actual, totalPaginas).map((p, i) =>
          p === '...' ? (
            <span key={`salto-${i}`} className="paginacion-cr__salto">…</span>
          ) : (
            <button
              key={p}
              type="button"
              className={`paginacion-cr__boton ${p === actual ? 'paginacion-cr__boton--actual' : ''}`}
              onClick={() => ir(p)}
              aria-current={p === actual ? 'page' : undefined}
            >
              {p}
            </button>
          )
        )}
        <button type="button" className="paginacion-cr__boton" onClick={() => ir(actual + 1)}
          disabled={actual === totalPaginas} aria-label="Página siguiente" title="Siguiente">
          <IconCR name="arrowRight" size={16} />
        </button>
      </div>
    </nav>
  )
}
