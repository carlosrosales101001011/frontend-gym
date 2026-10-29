import { useEffect } from 'react'
import { Col, Row } from 'react-bootstrap'
import IconCR from '@/components/Icons/IconCR'
import { InputSelectCR } from '@/components/TextFields/InputSelectCR'
import InputSwitchCR from '@/components/TextFields/InputSwitchCR'
import { useReporteMetaStore } from '../hook/useReporteMetaStore'
import { formatDate } from '@/helpers/FormatDate'

/**
 * Header del reporte de metas (en una card): seleccionables de meta y asesor, rango de fechas, monto de programas
 * y si el periodo es por fecha de pago o de venta
 */
export const HeaderApp = () => {
  const { opcionesMetas, idMetaSeleccionada, metaSeleccionada, opcionesAsesores, idAsesorSeleccionado, porFechaPago, obtenerMetas, seleccionarMeta, seleccionarAsesor, cambiarPorFechaPago } = useReporteMetaStore()

  useEffect(() => {
    obtenerMetas()
  }, [])

  return (
    <div className="card-mode-actual rounded p-3 mb-3">
      <Row className="g-2 align-items-center">
        <Col lg={2} md={6}>
          <InputSelectCR
            label="Meta"
            name="id_meta"
            options={opcionesMetas}
            defaultValue={String(idMetaSeleccionada)}
            onChange={(e) => seleccionarMeta(Number(e.target.value) || 0)}
          />
        </Col>
        <Col lg={2} md={6}>
          {/* Asesores involucrados en la meta; por defecto "Todos" */}
          <InputSelectCR
            label="Asesor"
            name="id_asesor"
            options={opcionesAsesores}
            defaultValue={String(idAsesorSeleccionado)}
            onChange={(e) => seleccionarAsesor(Number(e.target.value) || 0)}
          />
        </Col>
        {metaSeleccionada && (
          <Col xs="auto">
            {/* Mismo alto que el seleccionable (32px) para que queden alineados */}
            <div className="d-inline-flex align-items-center gap-2 px-3 rounded-pill bg-primary bg-opacity-10 border border-primary border-opacity-25" style={{ height: 32 }}>
              <IconCR name="calendar" size={14} className="text-primary" />
              <span className="fw-semibold text-primary">
                {formatDate(metaSeleccionada.fecha_inicio, 'yyyy-mm-dd', 'd MMMM yyyy')}
                {' - '}
                {formatDate(metaSeleccionada.fecha_fin, 'yyyy-mm-dd', 'd MMMM yyyy')}
              </span>
            </div>
          </Col>
        )}
      </Row>
      {/* Habilitado (por defecto): el periodo se aplica a la fecha de pago; deshabilitado: a la fecha de venta */}
      <InputSwitchCR
        name="por_fecha_pago"
        label={porFechaPago ? 'Con fecha de pago' : 'Con fecha de venta'}
        defaultValue={porFechaPago}
        onChange={(e) => cambiarPorFechaPago(e.target.checked)}
        wrapperClassName="mb-0 mt-2"
      />
    </div>
  )
}
