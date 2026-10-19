import { useEffect } from 'react'
import { Col, Row } from 'react-bootstrap'
import { InputCR } from '@/components/TextFields/InputCR'
import { InputSelectCR } from '@/components/TextFields/InputSelectCR'
import { useReporteCitasStore } from '../hook/useReporteCitasStore'

/** Header del reporte de citas (en una card): rango de fechas y filtros de nutricionista y estado */
export const HeaderApp = () => {
  const {
    fecha_inicio, fecha_fin, rangoValido, opcionesNutricionistas, opcionesEstados, idNutricionistaSeleccionado, idEstadoSeleccionado,
    inicializarFechas, cambiarFechas, obtenerEstados, obtenerNutricionistasRango, seleccionarNutricionista, seleccionarEstado,
  } = useReporteCitasStore()

  useEffect(() => {
    inicializarFechas()
    obtenerEstados()
  }, [])

  // Los nutricionistas son los que tienen citas en el rango: se recargan al cambiar las fechas
  useEffect(() => {
    if (rangoValido) obtenerNutricionistasRango(fecha_inicio, fecha_fin)
  }, [fecha_inicio, fecha_fin])

  const errorFechas = fecha_inicio && fecha_fin && !rangoValido ? 'No puede ser antes de la fecha de inicio' : ''

  return (
    // sticky-header-app: se queda pegado debajo de la topbar al hacer scroll
    <div className="card-mode-actual rounded p-3 mb-3 sticky-header-app">
      <Row className="g-2 align-items-start">
        <Col lg={3} md={6}>
          <InputCR
            type="date"
            label="Fecha inicio"
            value={fecha_inicio}
            onChange={(e) => cambiarFechas({ fecha_inicio: e.target.value })}
          />
        </Col>
        <Col lg={3} md={6}>
          <InputCR
            type="date"
            label="Fecha fin"
            value={fecha_fin}
            min={fecha_inicio || undefined}
            onChange={(e) => cambiarFechas({ fecha_fin: e.target.value })}
            messageErrors={errorFechas}
          />
        </Col>
        <Col lg={3} md={6}>
          {/* Solo nutricionistas con citas en el rango; por defecto "Todos" */}
          <InputSelectCR
            label="Nutricionista"
            name="id_nutricionista"
            options={opcionesNutricionistas}
            defaultValue={String(idNutricionistaSeleccionado)}
            onChange={(e) => seleccionarNutricionista(Number(e.target.value) || 0)}
          />
        </Col>
        <Col lg={3} md={6}>
          <InputSelectCR
            label="Estado"
            name="id_estado"
            options={opcionesEstados}
            defaultValue={String(idEstadoSeleccionado)}
            onChange={(e) => seleccionarEstado(Number(e.target.value) || 0)}
          />
        </Col>
      </Row>
    </div>
  )
}
