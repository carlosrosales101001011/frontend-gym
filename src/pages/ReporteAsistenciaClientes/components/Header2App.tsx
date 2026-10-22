import { useState } from 'react'
import { CardResumen } from '@/components/CardResumen/CardResumen'
import { useReporteAsistenciaStore } from '../hook/useReporteAsistenciaStore'
import {
  detalleClientesAsistidos,
  diasDelRango,
  frecuenciaClientes,
} from '../helpers/resumenAsistencia'
import { ModalClientesReporte, type CardClientes } from './ModalClientesReporte'
import { Col, Row } from 'react-bootstrap'

/**
 * Segunda franja del reporte (resumen, con los filtros del header): clientes que asistieron, clientes con membresía vigente que no
 * asistieron y la hora pico; la frecuencia semanal de los que asistieron; y los clientes con membresía vigente
 * según cuánto llevan sin asistir (hasta la fecha fin). Click en una card: sus clientes en un modal.
 */
export const Header2App = () => {
  const { asistencias, resumen, filtros, cargando } = useReporteAsistenciaStore()
  const [cardAbierta, setCardAbierta] = useState<CardClientes | null>(null)
  const dias = diasDelRango(filtros.fecha_inicio, filtros.fecha_fin)
  const asistidos = detalleClientesAsistidos(asistencias, dias)
  const frecuencia = frecuenciaClientes(asistidos)
  const abrir = (card: CardClientes) => () => setCardAbierta(card)

  return (
    <>
      <div className="card-resumen-grupo">
        {/* <CardResumen
          icono="users"
          titulo="Clientes asistidos"
          valor={clientesAsistidos(asistencias)}
          detalle={`${asistencias.length} asistencias en el rango`}
          cargando={cargando}
          onClick={abrir('asistidos')}
        />
        <CardResumen
          icono="user"
          titulo="Clientes sin asistir"
          valor={resumen.clientes_sin_asistir}
          detalle="Con membresía vigente en el rango"
          cargando={cargando}
          onClick={abrir('sin_asistir')}
        />
        <CardResumen
          icono="reloj"
          titulo="Hora pico (promedio)"
          valor={pico ? franjaHora(pico.hora) : '—'}
          detalle={pico
            ? `${pico.promedioPorDia.toFixed(1)} asistencias por día · ${pico.asistencias} en ${dias} día${dias === 1 ? '' : 's'}`
            : 'Sin asistencias en el rango'}
          cargando={cargando}
          onClick={abrir('hora_pico')}
        /> */}
      </div>
      <div className=" mt-3">
        <Row  className="g-2">
          <Col lg={2}>
            <CardResumen
              icono="estrella"
              titulo="Clientes frecuentes"
              valor={frecuencia.frecuentes}
              detalle="≥ 3 asistencias por semana"
              cargando={cargando}
              onClick={abrir('frecuentes')}
            />
          </Col>
          <Col lg={2}>
            <CardResumen
              icono="check"
              titulo="Clientes regulares"
              valor={frecuencia.regulares}
              detalle="2 asistencias por semana"
              cargando={cargando}
              onClick={abrir('regulares')}
            />
          </Col>
          <Col lg={2}>
            <CardResumen
              icono="calendar"
              titulo="Baja frecuencia"
              valor={frecuencia.baja}
              detalle="1 asistencia por semana"
              cargando={cargando}
              onClick={abrir('baja')}
            />
          </Col>
          <Col lg={2}>
            <CardResumen
              icono="notificaciones"
              titulo="En riesgo"
              valor={resumen.clientes_en_riesgo}
              detalle="7–13 días sin asistir"
              cargando={cargando}
              onClick={abrir('en_riesgo')}
            />
          </Col>
          <Col lg={2}>
            <CardResumen
              icono="times"
              titulo="Críticos"
              valor={resumen.clientes_criticos}
              detalle="≥ 14 días sin asistir"
              cargando={cargando}
              onClick={abrir('criticos')}
            />
          </Col>
          <Col lg={2}>
            <CardResumen
              icono="membresia"
              titulo="Nunca asistieron"
              valor={resumen.clientes_nunca_asistieron}
              detalle="Con membresía y 0 marcaciones"
              cargando={cargando}
              onClick={abrir('nunca')}
            />
          </Col>
        </Row>
      </div>
      <ModalClientesReporte card={cardAbierta} onHide={() => setCardAbierta(null)} />
    </>
  )
}
