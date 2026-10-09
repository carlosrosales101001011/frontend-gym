import { CardResumen } from '@/components/CardResumen/CardResumen'
import { useQueryParams } from '@/hook/useQueryParams'
import { querys } from '@/types/parametros'
import { useAsistenciasStore } from '../hook/useAsistenciasStore'
import { useResumenAsistencias } from '../hook/useResumenAsistencias'
import { Col, Row } from 'react-bootstrap'

/**
 * Cards del rango de fechas elegido (debajo del filtro, arriba de la tabla): clientes asistidos, clientes con
 * membresía vigente sin asistir y colaboradores asistidos. Se actualizan al registrar o eliminar una asistencia.
 */
export const ResumenAsistencias = () => {
  const { get } = useQueryParams()
  const fechaInicio = get(querys.fechaInicio)
  const fechaFin = get(querys.fechaFin)
  // La lista de la tabla cambia al buscar, registrar o eliminar: se usa como señal para refrescar
  const { asistencias } = useAsistenciasStore()
  const { resumen, cargando } = useResumenAsistencias(fechaInicio, fechaFin, asistencias)

  return (
    <div className=" mb-3">
      <Row>
        <Col lg={4} md={6} sm={12}>
        <CardResumen icono="users" titulo="Clientes asistidos" valor={resumen?.clientes_asistidos ?? 0} detalle="" cargando={cargando} />
        </Col>
        <Col lg={4} md={6} sm={12}>
        <CardResumen icono="user" titulo="Clientes sin asistir" valor={resumen?.clientes_sin_asistir ?? 0} detalle="" cargando={cargando} />
        </Col>
        <Col lg={4} md={6} sm={12}>
        <CardResumen icono="user" titulo="Colaboradores asistidos" valor={resumen?.colaboradores_asistidos ?? 0} detalle="" cargando={cargando} />
        </Col>
      </Row>
    </div>
  )
}
