/** Opciones de registros por página de las tablas */
export const OPCIONES_POR_PAGINA = [10, 20, 50, 100]

/** Elemento de la barra de páginas: un número de página o un salto ("...") */
export type ItemPagina = number | '...'

/**
 * Páginas a mostrar en la barra, siempre 7 lugares como máximo para que no salte de ancho:
 * la primera, la última y las vecinas de la actual, con "..." donde se saltan páginas.
 * Ej. (página 6 de 20): 1 … 5 6 7 … 20
 */
export const paginasVisibles = (pagina: number, totalPaginas: number): ItemPagina[] => {
  if (totalPaginas <= 7) return Array.from({ length: totalPaginas }, (_, i) => i + 1)
  if (pagina <= 4) return [1, 2, 3, 4, 5, '...', totalPaginas]
  if (pagina >= totalPaginas - 3) return [1, '...', totalPaginas - 4, totalPaginas - 3, totalPaginas - 2, totalPaginas - 1, totalPaginas]
  return [1, '...', pagina - 1, pagina, pagina + 1, '...', totalPaginas]
}

/** Rango de registros que se ven en la página (ej. 21–40); { desde: 0, hasta: 0 } si no hay registros */
export const rangoPagina = (pagina: number, porPagina: number, total: number) => {
  if (total <= 0) return { desde: 0, hasta: 0 }
  const desde = (pagina - 1) * porPagina + 1
  return { desde: Math.min(desde, total), hasta: Math.min(pagina * porPagina, total) }
}
