import { Col, Row } from 'react-bootstrap'
import { CardBarrasReporte } from '@/components/ReporteBarras/CardBarrasReporte'
import type { ClienteActivoProps } from '../hook/useClientesActivos'
import { agruparClientes, DIMENSIONES, filtrarClientes, type DimensionCliente, type FiltrosClientes } from '../helpers/resumenClientesActivos'
import { TablaClientesActivos } from '../layouts/TablaClientesActivos'

type BodyAppProps = {
  /** Todos los clientes activos (sin filtrar) */
  clientes: ClienteActivoProps[]
  filtros: FiltrosClientes
  /** Click en una fila de la tabla de una card: filtra por ese grupo (o lo quita si ya estaba) */
  onFiltrar: (dimension: DimensionCliente, grupo: string) => void
  loading: boolean
  error: string
}

/** Cards de barras del cuerpo: título y ancho (lg) de cada una */
const CARDS: { dimension: DimensionCliente, titulo: string, lg: number }[] = [
  { dimension: 'programa', titulo: 'Clientes por programa', lg: 4 },
  { dimension: 'asesor', titulo: 'Clientes por asesor', lg: 4 },
  { dimension: 'vencimiento', titulo: 'Clientes por vencimiento', lg: 4 },
  { dimension: 'genero', titulo: 'Clientes por género', lg: 4 },
  { dimension: 'edad', titulo: 'Clientes por edad', lg: 4 },
  { dimension: 'estadoCivil', titulo: 'Clientes por estado civil', lg: 4 },
  { dimension: 'distrito', titulo: 'Clientes por distrito', lg: 12 },
]

/**
 * Cuerpo del reporte: cards de barras (monto / cantidad, gráfica / tabla) por dimensión y la tabla de clientes.
 * Cada card usa todos los filtros menos el suyo (compara todos sus grupos y resalta el elegido); la tabla de
 * clientes usa todos.
 */
export const BodyApp = ({ clientes, filtros, onFiltrar, loading, error }: BodyAppProps) => (
  <Row className="g-3">
    {CARDS.map(({ dimension, titulo, lg }) => {
      const items = agruparClientes(filtrarClientes(clientes, filtros, dimension), dimension)
      const elegido = items.find((item) => item.nombre === filtros[dimension])
      return (
        <Col key={dimension} lg={lg}>
          <CardBarrasReporte
            titulo={titulo}
            items={items}
            etiquetaColumna={DIMENSIONES[dimension].nombre}
            ordenFijo={!!DIMENSIONES[dimension].tramos}
            idElegido={elegido?.id ?? null}
            onClickFila={(barra) => onFiltrar(dimension, barra.nombre)}
            // Cada card abre en Cantidad (cuántos clientes); Monto: lo vendido en sus membresías
            medidaInicial="cantidad"
            loading={loading}
            error={error}
            textoCargando="Cargando clientes"
            textoVacio="No hay clientes activos con estos filtros."
          />
        </Col>
      )
    })}
    <Col xs={12}>
      <TablaClientesActivos clientes={filtrarClientes(clientes, filtros)} loading={loading} error={error} />
    </Col>
  </Row>
)
