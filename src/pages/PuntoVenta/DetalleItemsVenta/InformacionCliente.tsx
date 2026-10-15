import { useEffect } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { InputCR } from '@/components/TextFields/InputCR'
import { InputSelectCR } from '@/components/TextFields/InputSelectCR'
import { useTerminologiaPersona } from '@/hook/usePropiedadesStore'
import { useVentasStore } from '../hook/useVentasStore'
import { BuscadorPersona } from '@/components/BuscadorPersona/BuscadorPersona'
import { BotonClienteNuevo } from '../components/BotonClienteNuevo'

const ID_TIPO_COLABORADOR = 1
const ID_TIPO_CLIENTE = 2

export const InformacionCliente = () => {
  const { cargar: cargarComprobantes, data: dataComprobantes } = useTerminologiaPersona('tipoComprobantes')
  const { cargar: cargarOrigenVenta, data: dataOrigenVenta } = useTerminologiaPersona('origenVenta')
  const { cargar: cargarTipoCliente, data: dataTipoCliente } = useTerminologiaPersona('tipoClienteVenta')
  const { venta, sucursales, obtenerOpSucursales, clienteSeleccionado, onSelectCliente, asesorSeleccionado, onSelectAsesor, onActualizarVenta } = useVentasStore()

  useEffect(() => {
    obtenerOpSucursales()
    cargarComprobantes()
    cargarOrigenVenta()
    cargarTipoCliente()
  }, [])

  return (
    <Card className="card-mode-actual">
      <Card.Body>
        <Card.Title style={{ fontSize: '17px' }} className="fw-bolder">
          Información de la venta
        </Card.Title>

        <div className="mb-3">
          <InputCR
            type='date'
            label='Fecha de venta'
            value={venta.fecha_venta}
            onChange={(e) => onActualizarVenta('fecha_venta', e.target.value)}
            required
          />
        </div>

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

        {/* Buscador de cliente y, a su lado, "+" para crear uno nuevo */}
        <div className="mb-3 d-flex align-items-end gap-2">
          <div className="flex-grow-1 min-w-0">
            <BuscadorPersona
              idTipo={ID_TIPO_CLIENTE}
              label='Cliente'
              placeholder='Buscar Cliente por nombre, DNI o Telefono'
              value={clienteSeleccionado}
              onSelect={onSelectCliente}
            />
          </div>
          <BotonClienteNuevo soloIcono />
        </div>

        {/* Mismo formulario que el paso "Detalle de la venta": siempre editable */}
        <Row>
          <Col lg={12}>
            <InputSelectCR
              options={dataTipoCliente}
              label='Tipo de cliente'
              defaultValue={String(venta.id_tipo_cli)}
              onChange={(e) => onActualizarVenta('id_tipo_cli', Number(e.target.value))}
            />
          </Col>
          <Col lg={12}>
            <InputSelectCR
              options={dataOrigenVenta}
              label='Origen'
              defaultValue={String(venta.id_origen)}
              onChange={(e) => onActualizarVenta('id_origen', Number(e.target.value))}
              required
            />
          </Col>
          <Col lg={12}>
            <InputSelectCR
              options={sucursales}
              label='Sucursal'
              defaultValue={String(venta.id_sucursal)}
              onChange={(e) => onActualizarVenta('id_sucursal', Number(e.target.value))}
              required
            />
          </Col>
          <Col lg={12}>
            <InputSelectCR
              options={dataComprobantes}
              label='Tipo de comprobante'
              defaultValue={String(venta.id_tipo_comprobante)}
              onChange={(e) => onActualizarVenta('id_tipo_comprobante', Number(e.target.value))}
            />
          </Col>
          <Col lg={12}>
            <InputCR
              type='normal'
              label='Comprobante'
              value={venta.n_comprobante}
              onChange={(e) => onActualizarVenta('n_comprobante', e.target.value)}
            />
          </Col>
          <Col lg={12}>
            <InputCR
              type='text-area'
              label='Observacion'
              value={venta.observacion}
              onChange={(e) => onActualizarVenta('observacion', e.target.value)}
            />
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )
}
