import { useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { CardResumen } from '@/components/CardResumen/CardResumen'
import { useReporteAsistenciaStore } from '../hook/useReporteAsistenciaStore'
import {
  asistenciasDelDiaSemana,
  asistidosPorDia,
  asistidosPorDiaSemana,
  detalleClientesAsistidos,
  diasDelRango,
  pluralDiaSemana,
  type AsistidosDiaSemana,
} from '../helpers/resumenAsistencia'
import { GraficoAsistidosPorDia } from './GraficoAsistidosPorDia'
import { ModalClientesReporte } from './ModalClientesReporte'

/**
 * Cuerpo del reporte (con los filtros del header): gráfico de clientes asistidos por día y, al lado, el recuento por
 * día de la semana (lunes a sábado). Click en un día: sus clientes en un modal.
 */
export const BodyApp = () => {
  const { asistencias, filtros, cargando } = useReporteAsistenciaStore()
  const [diaAbierto, setDiaAbierto] = useState<AsistidosDiaSemana | null>(null)
  const porDiaSemana = asistidosPorDiaSemana(asistidosPorDia(asistencias, filtros.fecha_inicio, filtros.fecha_fin))
  const dias = diasDelRango(filtros.fecha_inicio, filtros.fecha_fin)
  const clientesDiaAbierto = diaAbierto ? detalleClientesAsistidos(asistenciasDelDiaSemana(asistencias, diaAbierto.dia), dias) : []

  return (
    <Row className="g-3 mt-0">
      <Col lg={8}>
        <GraficoAsistidosPorDia />
      </Col>
      <Col lg={4}>
        <Row className="g-2">
          {porDiaSemana.map((d) => (
            <Col xs={6} key={d.dia}>
              <CardResumen
                icono="calendar"
                titulo={d.nombre}
                valor={d.clientes}
                detalle={d.dias
                  ? `${(d.clientes / d.dias).toFixed(1)} por día · ${d.dias} ${d.dias === 1 ? d.nombre.toLowerCase() : pluralDiaSemana(d.nombre)}`
                  : 'Sin días en el rango'}
                cargando={cargando}
                onClick={() => setDiaAbierto(d)}
              />
            </Col>
          ))}
        </Row>
      </Col>
      <ModalClientesReporte
        card={diaAbierto ? 'dia_semana' : null}
        onHide={() => setDiaAbierto(null)}
        diaSemana={diaAbierto ? { nombre: diaAbierto.nombre, clientes: clientesDiaAbierto } : undefined}
      />
    </Row>
  )
}
