import { useEffect, useState } from 'react'
import { Col, Row, Table } from 'react-bootstrap'
import { BsPlusLg } from 'react-icons/bs'
import { ButtonCR } from '@/components/Button/ButtonCR'
import { CardEditable } from '@/components/CardEditable/CardEditable'
import { ResumenMontos } from '@/components/ResumenMontos/ResumenMontos'
import { useTerminologiaPersona } from '@/hook/usePropiedadesStore'
import type { OpcionesSelect } from '@/types/props'
import type { UseVentaDetalle } from '../../hook/useVentaDetalle'
import type { DetallePagoProps, VentaInfoProps } from '../../types'
import { ModalFormPago } from '../Forms/ModalFormPago'
import { aNumero, formatearFecha, formatearMoneda, redondear2 } from '../../helpers'
import { AccionesItem } from './TabDetalleVenta'

type FormAbierto = { show: boolean; detalle: DetallePagoProps | null }
const cerrado: FormAbierto = { show: false, detalle: null }

type TabDetallePagosProps = {
  venta: VentaInfoProps
  pagos: DetallePagoProps[]
} & Pick<UseVentaDetalle, 'guardarPago' | 'eliminarPago'>

export const TabDetallePagos = ({ venta, pagos, guardarPago, eliminarPago }: TabDetallePagosProps) => {
  const [editando, setEditando] = useState(false)
  const [formPago, setFormPago] = useState<FormAbierto>(cerrado)
  const { cargar: cargarFormaPago, data: dataFormaPago } = useTerminologiaPersona('formaPagoVenta')
  const formasPago = dataFormaPago as OpcionesSelect[]

  useEffect(() => {
    cargarFormaPago()
  }, [cargarFormaPago])

  const labelFormaPago = (id: number) => formasPago.find((f) => f.value === id)?.label ?? `#${id}`

  const total = aNumero(venta.montoTotal_membresia) + aNumero(venta.montoTotal_productos)
  const pagado = pagos.reduce((acc, p) => acc + aNumero(p.monto), 0)
  const saldo = redondear2(Math.max(0, total - pagado))

  return (
    <Row className="g-3 pt-2">
      <Col lg={8}>
        <CardEditable
          titulo="Pagos"
          editando={editando}
          onEditar={() => setEditando(true)}
          onCancelar={() => setEditando(false)}
          acciones={
            <ButtonCR
              label="Agregar pago"
              icon={<BsPlusLg />}
              variant="outline-primary"
              onClick={() => setFormPago({ show: true, detalle: null })}
            />
          }
        >
          {pagos.length > 0 ? (
            <Table responsive size="sm" className="mb-0 align-middle" style={{ fontSize: '14px' }}>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Forma de pago</th>
                  <th>Observación</th>
                  <th className="text-end">Monto</th>
                  {editando && <th />}
                </tr>
              </thead>
              <tbody>
                {pagos.map((pago) => (
                  <tr key={pago.id}>
                    <td>{formatearFecha(pago.fecha_pago)}</td>
                    <td>{labelFormaPago(pago.id_forma_pago)}</td>
                    <td className="text-secondary">{pago.observacion || '-'}</td>
                    <td className="text-end fw-bold">{formatearMoneda(pago.monto)}</td>
                    {editando && (
                      <td className="text-end">
                        <AccionesItem
                          onEditar={() => setFormPago({ show: true, detalle: pago })}
                          onEliminar={() => eliminarPago(pago.id)}
                        />
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-secondary my-2" style={{ fontSize: '14px' }}>Esta venta no tiene pagos registrados.</p>
          )}
        </CardEditable>
      </Col>
      <Col lg={4}>
        <ResumenMontos
          titulo="Estado de pago"
          items={[
            { label: 'Total de la venta', monto: total },
            { label: 'Pagado', monto: pagado },
            { label: 'Saldo pendiente', monto: saldo, tipo: 'resaltado' },
          ]}
        />
      </Col>

      <ModalFormPago
        show={formPago.show}
        detalle={formPago.detalle}
        formasPago={formasPago}
        montoSugerido={saldo}
        onHide={() => setFormPago(cerrado)}
        onGuardar={guardarPago}
      />
    </Row>
  )
}
