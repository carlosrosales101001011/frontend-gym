import { Col, Row } from 'react-bootstrap'
import { useReporteMetaStore } from '../hook/useReporteMetaStore'
import { MetaAcumuladaVsVenta } from '../layouts/MetaAcumuladaVsVenta'
import { RitmoEquipo } from '../layouts/RitmoEquipo'

/** Cuerpo del reporte de metas: layouts que dependen del periodo de la meta elegida en el header */
export const BodyApp = () => {
  const { metaSeleccionada } = useReporteMetaStore()

  if (!metaSeleccionada) return null

  return (
    <Row className="g-3">
      <Col lg={8}>
        <MetaAcumuladaVsVenta fecha_inicio={metaSeleccionada.fecha_inicio} fecha_fin={metaSeleccionada.fecha_fin} />
      </Col>
      <Col lg={4}>
        <RitmoEquipo fecha_inicio={metaSeleccionada.fecha_inicio} fecha_fin={metaSeleccionada.fecha_fin} />
      </Col>
    </Row>
  )
}
