import { useEffect } from 'react'
import { Col, Row } from 'react-bootstrap'
import { InputCR } from '@/components/TextFields/InputCR'
import { InputSelectCR } from '@/components/TextFields/InputSelectCR'
import { useReporteAsistenciaStore } from '../hook/useReporteAsistenciaStore'

/** Espera tras el último cambio de filtro antes de pedir el reporte (el horario se escribe letra por letra) */
const ESPERA_FILTROS_MS = 400

/**
 * Header del reporte de asistencias de clientes (en una card): fecha inicio y fin (de la asistencia, por defecto hoy),
 * programa y horario de la membresía. Cada cambio vuelve a pedir el reporte.
 */
export const HeaderApp = () => {
  const { filtros, opcionesProgramas, cambiarFiltro, obtenerProgramas, obtenerReporte } = useReporteAsistenciaStore()
  const rangoInvalido = !!filtros.fecha_inicio && !!filtros.fecha_fin && filtros.fecha_inicio > filtros.fecha_fin

  useEffect(() => {
    obtenerProgramas()
  }, [])

  useEffect(() => {
    if (rangoInvalido) return
    const ctrl = new AbortController()
    const espera = setTimeout(() => obtenerReporte(ctrl.signal), ESPERA_FILTROS_MS)
    return () => {
      clearTimeout(espera)
      ctrl.abort()
    }
  }, [filtros.fecha_inicio, filtros.fecha_fin, filtros.id_programa, filtros.horario])

  return (
    <div className="card-mode-actual rounded p-3 mb-3">
      <Row className="g-2 align-items-start">
        <Col lg={2} md={6}>
          <InputCR type="date" label="Fecha inicio" value={filtros.fecha_inicio}
            onChange={(e) => cambiarFiltro({ fecha_inicio: e.target.value })} />
        </Col>
        <Col lg={2} md={6}>
          <InputCR type="date" label="Fecha fin" value={filtros.fecha_fin}
            onChange={(e) => cambiarFiltro({ fecha_fin: e.target.value })}
            messageErrors={rangoInvalido ? 'La fecha fin es anterior a la de inicio' : ''} />
        </Col>
        <Col lg={3} md={6}>
          {/* key: se monta cuando llegan los programas, para que muestre el elegido */}
          <InputSelectCR
            key={opcionesProgramas.length}
            label="Programa"
            name="id_programa"
            options={opcionesProgramas}
            defaultValue={String(filtros.id_programa)}
            onChange={(e) => cambiarFiltro({ id_programa: Number(e.target.value) || 0 })}
          />
        </Col>
        <Col lg={2} md={6}>
          <InputCR label="Horario" placeholder=" " value={filtros.horario}
            onChange={(e) => cambiarFiltro({ horario: e.target.value })} />
        </Col>
      </Row>
    </div>
  )
}
