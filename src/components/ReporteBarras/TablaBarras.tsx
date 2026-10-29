import { DataTableSimple2, type ColumnaSimple2 } from '@/components/DataTableSimple/DataTableSimple2'
import type { BarraComparacion } from './barrasComparacion'
import { formatearMedida, type MedidaReporte } from './medidaReporte'

type TablaBarrasProps = {
  barras: BarraComparacion[]
  medida: MedidaReporte
  /** Elemento elegido en el header: agrega la columna "% de alcance"; null = sin elegido */
  idElegido: number | null
  /** Título de la primera columna: "Vendedor", "Origen" o "Programa" */
  etiquetaColumna: string
  /** Click en una fila (ej. para filtrar el reporte por ella) */
  onClickFila?: (barra: BarraComparacion) => void
}

/**
 * Tabla de las cards de barras del reporte de ventas: nombre, monto o cantidad, participación del total
 * y, si hay un elegido, el % de alcance (solo en las filas que vendieron más que el elegido).
 */
export const TablaBarras = ({ barras, medida, idElegido, etiquetaColumna, onClickFila }: TablaBarrasProps) => {
  const columnas: ColumnaSimple2<BarraComparacion>[] = [
    {
      id: 'nombre',
      header: etiquetaColumna,
      render: (barra) => <span className={barra.id === idElegido ? 'fw-bold' : ''}>{barra.nombre}</span>,
      sortValue: (barra) => barra.nombre,
      searchValue: (barra) => barra.nombre,
    },
    {
      id: 'valor',
      header: medida === 'monto' ? 'Monto' : 'Cantidad',
      render: (barra) => formatearMedida(barra.valor, medida),
      sortValue: (barra) => barra.valor,
    },
    {
      id: 'participacion',
      header: 'Participación',
      render: (barra) => `${barra.participacion}%`,
      sortValue: (barra) => barra.participacion,
    },
    ...(idElegido !== null ? [{
      id: 'alcance',
      header: '% de alcance',
      render: (barra: BarraComparacion) => barra.alcance !== null ? `${barra.alcance}%` : '—',
      sortValue: (barra: BarraComparacion) => barra.alcance ?? -1,
    }] : []),
  ]
  // Sin buscador ni "Mostrando": solo la tabla con su paginación
  // La fila del elegido va en amarillo (fila-elegida)
  return (
    <DataTableSimple2 data={barras} columns={columnas} mostrarBuscador={false} mostrarTamanoPagina={false} onRowClick={onClickFila}
      rowClassName={(barra) => (barra.id === idElegido ? 'fila-elegida' : undefined)} />
  )
}
