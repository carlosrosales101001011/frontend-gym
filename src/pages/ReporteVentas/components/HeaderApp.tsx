import { useEffect } from 'react'
import { Col, Row } from 'react-bootstrap'
import { InputCR } from '@/components/TextFields/InputCR'
import { InputSelectCR } from '@/components/TextFields/InputSelectCR'
import { useReporteVentasStore } from '../hook/useReporteVentasStore'

/** Header del reporte de ventas (en una card): rango de fechas y filtros de asesor, sucursal, programa, plan y origen */
export const HeaderApp = () => {
  const {
    fecha_inicio, fecha_fin, rangoValido,
    opcionesAsesores, opcionesSucursales, opcionesProgramas, opcionesPlanes, opcionesOrigenes,
    idAsesorSeleccionado, idSucursalSeleccionada, idProgramaSeleccionado, idPlanSeleccionado, idOrigenSeleccionado,
    inicializarFechas, cambiarFechas, obtenerAsesoresRango, obtenerSucursales, obtenerProgramas, obtenerPlanes, obtenerOrigenes,
    seleccionarAsesor, seleccionarSucursal, seleccionarPrograma, seleccionarPlan, seleccionarOrigen,
  } = useReporteVentasStore()

  useEffect(() => {
    inicializarFechas()
    obtenerSucursales()
    obtenerProgramas()
    obtenerPlanes()
    obtenerOrigenes()
  }, [])

  // Los asesores son los que vendieron en el rango: se recargan al cambiar las fechas
  useEffect(() => {
    if (rangoValido) obtenerAsesoresRango(fecha_inicio, fecha_fin)
  }, [fecha_inicio, fecha_fin])

  const errorFechas = fecha_inicio && fecha_fin && !rangoValido ? 'No puede ser antes de la fecha de inicio' : ''

  return (
    // sticky-header-app: se queda pegado debajo de la topbar al hacer scroll
    <div className="card-mode-actual rounded p-3 mb-3 sticky-header-app">
      {/* 7 filtros: en pantallas grandes se reparten el ancho en partes iguales (Col lg) */}
      <Row className="g-2 align-items-start">
        <Col lg md={4}>
          <InputCR
            type="date"
            label="Fecha inicio"
            value={fecha_inicio}
            onChange={(e) => cambiarFechas({ fecha_inicio: e.target.value })}
          />
        </Col>
        <Col lg md={4}>
          <InputCR
            type="date"
            label="Fecha fin"
            value={fecha_fin}
            min={fecha_inicio || undefined}
            onChange={(e) => cambiarFechas({ fecha_fin: e.target.value })}
            messageErrors={errorFechas}
          />
        </Col>
        <Col lg md={4}>
          {/* Solo asesores con ventas en el rango; por defecto "Todos" */}
          <InputSelectCR
            label="Asesor"
            name="id_asesor"
            options={opcionesAsesores}
            defaultValue={String(idAsesorSeleccionado)}
            onChange={(e) => seleccionarAsesor(Number(e.target.value) || 0)}
          />
        </Col>
        <Col lg md={4}>
          <InputSelectCR
            label="Sucursal"
            name="id_sucursal"
            options={opcionesSucursales}
            defaultValue={String(idSucursalSeleccionada)}
            onChange={(e) => seleccionarSucursal(Number(e.target.value) || 0)}
          />
        </Col>
        <Col lg md={4}>
          <InputSelectCR
            label="Programa"
            name="id_programa"
            options={opcionesProgramas}
            defaultValue={String(idProgramaSeleccionado)}
            onChange={(e) => seleccionarPrograma(Number(e.target.value) || 0)}
          />
        </Col>
        <Col lg md={4}>
          {/* Planes del programa elegido (label: "3 meses"); con programa "Todos" solo está "Todos" */}
          <InputSelectCR
            label="Plan"
            name="id_plan"
            options={opcionesPlanes}
            defaultValue={String(idPlanSeleccionado)}
            onChange={(e) => seleccionarPlan(Number(e.target.value) || 0)}
          />
        </Col>
        <Col lg md={4}>
          <InputSelectCR
            label="Origen"
            name="id_origen"
            options={opcionesOrigenes}
            defaultValue={String(idOrigenSeleccionado)}
            onChange={(e) => seleccionarOrigen(Number(e.target.value) || 0)}
          />
        </Col>
      </Row>
    </div>
  )
}
