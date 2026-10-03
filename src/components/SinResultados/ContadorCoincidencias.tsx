type ContadorCoincidenciasProps = {
  /** Cantidad de resultados de la búsqueda */
  total: number
  /** Mientras busca se muestra "Buscando..." */
  cargando?: boolean
}

/**
 * "N coincidencias exactas" al lado del buscador (en rojo si no hay ninguna).
 * Quien lo usa lo muestra solo cuando hay algo escrito. Estilos en _ContadorCoincidencias.scss.
 */
export const ContadorCoincidencias = ({ total, cargando = false }: ContadorCoincidenciasProps) => (
  <span
    className={`contador-coincidencias ${!cargando && total === 0 ? 'contador-coincidencias--cero' : ''}`}
    role="status"
    aria-live="polite"
  >
    {cargando ? 'Buscando...' : <><strong>{total}</strong> {total === 1 ? 'coincidencia exacta' : 'coincidencias exactas'}</>}
  </span>
)
