import { Col, Row } from 'react-bootstrap'
import { useReporteVentasStore } from '../hook/useReporteVentasStore'
import { VentasPorAsesor } from '../layouts/VentasPorAsesor'
import { VentasPorOrigen } from '../layouts/VentasPorOrigen'
import { VentasPorPrograma } from '../layouts/VentasPorPrograma'
import { VentasPorPlan } from '../layouts/VentasPorPlan'

/** Cuerpo del reporte de ventas: layouts que dependen del rango de fechas del header */
export const BodyApp = () => {
  const { fecha_inicio, fecha_fin, rangoValido } = useReporteVentasStore()

  if (!rangoValido) return null

  return (
    <>
      <Row className="g-3 mb-3">
        <Col lg={6}>
          <VentasPorAsesor fecha_inicio={fecha_inicio} fecha_fin={fecha_fin} />
        </Col>
        <Col lg={6}>
          <VentasPorOrigen fecha_inicio={fecha_inicio} fecha_fin={fecha_fin} />
        </Col>
        <Col lg={4}>
          <VentasPorPrograma fecha_inicio={fecha_inicio} fecha_fin={fecha_fin} />
        </Col>
        <Col lg={4}>
          <VentasPorPlan fecha_inicio={fecha_inicio} fecha_fin={fecha_fin} />
        </Col>
      </Row>
    </>
  )
}
