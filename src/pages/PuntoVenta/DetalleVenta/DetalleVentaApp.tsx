import { InputCR } from '@/components/TextFields/InputCR'
import { InputSelectCR } from '@/components/TextFields/InputSelectCR'
import { useMemo } from 'react'
import { Col, Row } from 'react-bootstrap'
import { useTerminologiaPersona } from '@/hook/usePropiedadesStore'
import { BuscadorPersona } from '@/components/BuscadorPersona/BuscadorPersona'
import { CardHistorialVentas } from './CardHistorialVentas'
import { useVentasStore } from '../hook/useVentasStore'

const ID_TIPO_COLABORADOR = 1
const ID_TIPO_CLIENTE = 2

export const DetalleVentaApp = () => {
  const { cargar: cargarComprobantes, data: dataComprobantes } = useTerminologiaPersona('tipoComprobantes')
  const { cargar: cargarOrigenVenta, data: dataOrigenVenta } = useTerminologiaPersona('origenVenta')
  const { obtenerOpSucursales, sucursales, venta, clienteSeleccionado, onSelectCliente, asesorSeleccionado, onSelectAsesor, onActualizarVenta } = useVentasStore()
  useMemo(() => {
    cargarComprobantes()
    cargarOrigenVenta()
    obtenerOpSucursales()
  }, [])

  return (
    <div>
      <Row>
        <Col lg={6}>
          <Row>
            <Col lg={12}>
              <BuscadorPersona
                idTipo={ID_TIPO_COLABORADOR}
                label='Asesor / Vendedor'
                placeholder='Buscar Asesor por nombre, DNI o Telefono'
                value={asesorSeleccionado}
                onSelect={onSelectAsesor}
                required
                soloNombre
              />
            </Col>
            <Col lg={12}>
              <div className="mt-4">
                <BuscadorPersona
                  idTipo={ID_TIPO_CLIENTE}
                  label='Cliente'
                  placeholder='Buscar Cliente por nombre, DNI o Telefono'
                  value={clienteSeleccionado}
                  onSelect={onSelectCliente}
                  required
                />
              </div>
            </Col>
          </Row>
        </Col>
        <Col lg={6}>
          <Row>
            <Col lg={6}>
              <InputSelectCR
                options={dataOrigenVenta}
                label='Origen'
                defaultValue={String(venta.id_origen)}
                onChange={(e) => onActualizarVenta('id_origen', Number(e.target.value))}
                required
              />
            </Col>
            <Col lg={6}>
              <InputSelectCR
                options={sucursales}
                label='Sucursal'
                defaultValue={String(venta.id_sucursal)}
                onChange={(e) => onActualizarVenta('id_sucursal', Number(e.target.value))}
                required
              />
            </Col>
            <Col lg={6}>
              <InputSelectCR
                options={dataComprobantes}
                label='Tipo de comprobante'
                defaultValue={String(venta.id_tipo_comprobante)}
                onChange={(e) => onActualizarVenta('id_tipo_comprobante', Number(e.target.value))}
                required
              />
            </Col>
            <Col lg={6}>
              <InputCR
                type='normal'
                label='Comprobante'
                value={venta.n_comprobante}
                onChange={(e) => onActualizarVenta('n_comprobante', e.target.value)}
                required
              />
            </Col>
          </Row>
          <InputCR
            type='text-area'
            label='Observacion'
            value={venta.observacion}
            onChange={(e) => onActualizarVenta('observacion', e.target.value)}
          />
        </Col>
      </Row>
        {
          (clienteSeleccionado?.id||0)!==0 && (
          <Row>
            <Col lg={12}>
              <CardHistorialVentas
                nombreCliente={clienteSeleccionado?.nombre||''}
                id_cli={clienteSeleccionado?.id||0}
              />
            </Col>
          </Row>
          )
        }
    </div>
  )
}
