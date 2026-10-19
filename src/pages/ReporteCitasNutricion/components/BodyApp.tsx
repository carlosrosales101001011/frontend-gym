import { Col, Row } from 'react-bootstrap'
import { useReporteCitasStore } from '../hook/useReporteCitasStore'
import { CitasPorDia } from '../layouts/CitasPorDia'
import { CitasPorEstado } from '../layouts/CitasPorEstado'
import { CitasPorNutricionista } from '../layouts/CitasPorNutricionista'
import { CitasPorHora } from '../layouts/CitasPorHora'

/** Cuerpo del reporte de citas: layouts que dependen del rango de fechas del header */
export const BodyApp = () => {
  const { fecha_inicio, fecha_fin, rangoValido } = useReporteCitasStore()

  if (!rangoValido) return null

  return (
    <>
      <Row className="g-3 mb-3">
        <Col lg={8}>
          <CitasPorDia fecha_inicio={fecha_inicio} fecha_fin={fecha_fin} />
        </Col>
        <Col lg={4}>
          <CitasPorEstado fecha_inicio={fecha_inicio} fecha_fin={fecha_fin} />
        </Col>
        <Col lg={6}>
          <CitasPorNutricionista fecha_inicio={fecha_inicio} fecha_fin={fecha_fin} />
        </Col>
        <Col lg={6}>
          <CitasPorHora fecha_inicio={fecha_inicio} fecha_fin={fecha_fin} />
        </Col>
      </Row>
    </>
  )
}
