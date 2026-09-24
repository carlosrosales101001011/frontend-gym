import { useEffect, useState } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { InputCR } from '@/components/TextFields/InputCR'
import { InputSelectCR } from '@/components/TextFields/InputSelectCR'
import { useTerminologiaPersona } from '@/hook/usePropiedadesStore'
import { useVentasStore } from '../hook/useVentasStore'
import { BuscadorPersona } from '@/components/BuscadorPersona/BuscadorPersona'

const ID_TIPO_COLABORADOR = 1
const ID_TIPO_CLIENTE = 2

type CampoEditable = 'id_origen' | 'id_sucursal' | 'id_tipo_comprobante' | 'n_comprobante' | 'observacion'

const CampoInfo = ({ label, valor, onDoubleClick }: { label: string, valor: string, onDoubleClick: () => void }) => (
  <div className="mb-2" onDoubleClick={onDoubleClick} style={{ cursor: 'pointer' }}>
    <div className="small text-uppercase" style={{ opacity: 0.6, fontSize: '11px' }}>{label}</div>
    <div className="fw-bold" style={{ fontSize: '14px' }}>{valor || '-'}</div>
  </div>
)

export const InformacionCliente = () => {
  const { cargar: cargarComprobantes, data: dataComprobantes } = useTerminologiaPersona('tipoComprobantes')
  const { cargar: cargarOrigenVenta, data: dataOrigenVenta } = useTerminologiaPersona('origenVenta')
  const { venta, sucursales, clienteSeleccionado, onSelectCliente, asesorSeleccionado, onSelectAsesor, onActualizarVenta } = useVentasStore()
  const [campoEditando, setCampoEditando] = useState<CampoEditable | null>(null)

  useEffect(() => {
    cargarComprobantes()
    cargarOrigenVenta()
  }, [])

  const labelOrigen = dataOrigenVenta.find((opcion) => opcion.value === venta.id_origen)?.label ?? ''
  const labelSucursal = sucursales.find((opcion) => opcion.value === venta.id_sucursal)?.label ?? ''
  const labelComprobante = dataComprobantes.find((opcion) => opcion.value === venta.id_tipo_comprobante)?.label ?? ''

  const cerrarEdicion = () => setCampoEditando(null)

  return (
    <Card className="card-mode-actual">
      <Card.Body>
        <Card.Title style={{ fontSize: '17px' }} className="fw-bolder">
          Información de la venta
        </Card.Title>

        <div className="mb-3">
          <BuscadorPersona
            idTipo={ID_TIPO_COLABORADOR}
            label='Asesor / Vendedor'
            placeholder='Buscar Asesor por nombre, DNI o Telefono'
            value={asesorSeleccionado}
            onSelect={onSelectAsesor}
            soloNombre
          />
        </div>

        <div className="mb-3">
          <BuscadorPersona
            idTipo={ID_TIPO_CLIENTE}
            label='Cliente'
            placeholder='Buscar Cliente por nombre, DNI o Telefono'
            value={clienteSeleccionado}
            onSelect={onSelectCliente}
          />
        </div>

        <Row>
          <Col lg={6}>
            {campoEditando === 'id_origen' ? (
              <InputSelectCR
                options={dataOrigenVenta}
                label='Origen'
                defaultValue={String(venta.id_origen)}
                onChange={(e) => onActualizarVenta('id_origen', Number(e.target.value))}
                autoFocus
                onBlur={cerrarEdicion}
              />
            ) : (
              <CampoInfo label="Origen" valor={labelOrigen} onDoubleClick={() => setCampoEditando('id_origen')} />
            )}
          </Col>
          <Col lg={6}>
            {campoEditando === 'id_sucursal' ? (
              <InputSelectCR
                options={sucursales}
                label='Sucursal'
                defaultValue={String(venta.id_sucursal)}
                onChange={(e) => onActualizarVenta('id_sucursal', Number(e.target.value))}
                autoFocus
                onBlur={cerrarEdicion}
              />
            ) : (
              <CampoInfo label="Sucursal" valor={labelSucursal} onDoubleClick={() => setCampoEditando('id_sucursal')} />
            )}
          </Col>
          <Col lg={6}>
            {campoEditando === 'id_tipo_comprobante' ? (
              <InputSelectCR
                options={dataComprobantes}
                label='Tipo de comprobante'
                defaultValue={String(venta.id_tipo_comprobante)}
                onChange={(e) => onActualizarVenta('id_tipo_comprobante', Number(e.target.value))}
                autoFocus
                onBlur={cerrarEdicion}
              />
            ) : (
              <CampoInfo label="Tipo de comprobante" valor={labelComprobante} onDoubleClick={() => setCampoEditando('id_tipo_comprobante')} />
            )}
          </Col>
          <Col lg={6}>
            {campoEditando === 'n_comprobante' ? (
              <InputCR
                type='normal'
                label='Comprobante'
                value={venta.n_comprobante}
                onChange={(e) => onActualizarVenta('n_comprobante', e.target.value)}
                autoFocus
                onBlur={cerrarEdicion}
              />
            ) : (
              <CampoInfo label="N° comprobante" valor={venta.n_comprobante} onDoubleClick={() => setCampoEditando('n_comprobante')} />
            )}
          </Col>
          <Col lg={12}>
            {campoEditando === 'observacion' ? (
              <InputCR
                type='text-area'
                label='Observacion'
                value={venta.observacion}
                onChange={(e) => onActualizarVenta('observacion', e.target.value)}
                autoFocus
                onBlur={cerrarEdicion}
              />
            ) : (
              <CampoInfo label="Observación" valor={venta.observacion} onDoubleClick={() => setCampoEditando('observacion')} />
            )}
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )
}
