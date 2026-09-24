import { useState } from 'react'
import { Table } from 'react-bootstrap'
import { BsPencil, BsPlusLg, BsTrash } from 'react-icons/bs'
import { ButtonCR } from '@/components/Button/ButtonCR'
import { CardEditable } from '@/components/CardEditable/CardEditable'
import { FieldGrid } from '@/components/FieldText/FieldGrid'
import type { UseVentaDetalle } from '../../hook/useVentaDetalle'
import type { DetalleMembresiaProps, DetalleProductoProps } from '../../types'
import { ModalFormMembresia } from '../Forms/ModalFormMembresia'
import { ModalFormProducto } from '../Forms/ModalFormProducto'
import { aNumero, formatearFecha, formatearMoneda } from '../../helpers'

type FormAbierto<T> = { show: boolean; detalle: T | null }
const cerrado = { show: false, detalle: null }

export const AccionesItem = ({ onEditar, onEliminar }: { onEditar: () => void; onEliminar: () => void }) => (
  <div className="d-inline-flex">
    <ButtonCR icon={<BsPencil />} variant="outline-primary" onClick={onEditar} />
    <ButtonCR icon={<BsTrash />} variant="outline-danger" onClick={onEliminar} />
  </div>
)

type TabDetalleVentaProps = {
  membresias: DetalleMembresiaProps[]
  productos: DetalleProductoProps[]
} & Pick<UseVentaDetalle, 'guardarMembresia' | 'eliminarMembresia' | 'guardarProducto' | 'eliminarProducto'>

export const TabDetalleVenta = ({
  membresias,
  productos,
  guardarMembresia,
  eliminarMembresia,
  guardarProducto,
  eliminarProducto,
}: TabDetalleVentaProps) => {
  const [editando, setEditando] = useState(false)
  const [formMembresia, setFormMembresia] = useState<FormAbierto<DetalleMembresiaProps>>(cerrado)
  const [formProducto, setFormProducto] = useState<FormAbierto<DetalleProductoProps>>(cerrado)

  // Una venta tiene como máximo una membresía.
  const membresia = membresias[0] ?? null
  const subtotalProductos = productos.reduce((acc, p) => acc + aNumero(p.montoTotal), 0)

  return (
    <div className="pt-2">
      <CardEditable
        titulo
        editando={editando}
        onEditar={() => setEditando(true)}
        onCancelar={() => setEditando(false)}
      >
        {/* Membresía */}
        <div className="d-flex align-items-center justify-content-between">
          <h6 className="fw-bolder m-0">Membresía</h6>
          {editando && (
            membresia ? (
              <AccionesItem
                onEditar={() => setFormMembresia({ show: true, detalle: membresia })}
                onEliminar={() => eliminarMembresia(membresia.id)}
              />
            ) : (
              <ButtonCR
                label="Agregar membresía"
                icon={<BsPlusLg />}
                variant="outline-primary"
                onClick={() => setFormMembresia({ show: true, detalle: null })}
              />
            )
          )}
        </div>
        {membresia ? (
          <FieldGrid
            colDefault={3}
            campos={[
              { label: 'Programa', value: membresia.label_programa },
              { label: 'Plan', value: membresia.label_plan },
              { label: 'Horario', value: membresia.label_horario },
              { label: 'Vigencia', value: `${formatearFecha(membresia.fecha_inicio)} - ${formatearFecha(membresia.fecha_fin)}` },
              { label: 'Precio', value: formatearMoneda(aNumero(membresia.montoSinDescuento) || aNumero(membresia.montoTotal) + aNumero(membresia.montoDescuento)) },
              { label: 'Descuento', value: <span className="text-danger">- {formatearMoneda(membresia.montoDescuento)}</span> },
              { label: 'Total', value: formatearMoneda(membresia.montoTotal) },
              { label: 'Regalos', value: `${membresia.dias_congelamiento_regalo ?? 0} días congel. · ${membresia.citas_nutricion_regalo ?? 0} citas nutrición` },
            ]}
          />
        ) : (
          <p className="text-secondary my-2" style={{ fontSize: '14px' }}>Esta venta no tiene membresía.</p>
        )}

        <hr />

        {/* Productos */}
        <div className="d-flex align-items-center justify-content-between">
          <h6 className="fw-bolder m-0">Productos</h6>
          {editando && (
            <ButtonCR
              label="Agregar producto"
              icon={<BsPlusLg />}
              variant="outline-primary"
              onClick={() => setFormProducto({ show: true, detalle: null })}
            />
          )}
        </div>
        {productos.length > 0 ? (
          <Table responsive size="sm" className="mt-2 mb-0 align-middle" style={{ fontSize: '14px' }}>
            <thead>
              <tr>
                <th>Producto</th>
                <th className="text-end">P. unitario</th>
                <th className="text-end">Cant.</th>
                <th className="text-end">Descuento</th>
                <th className="text-end">Total</th>
                {editando && <th />}
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto.id}>
                  <td>{producto.label_producto}</td>
                  <td className="text-end">{formatearMoneda(producto.precio_unitario_producto)}</td>
                  <td className="text-end">{producto.cantidad}</td>
                  <td className="text-end text-danger">- {formatearMoneda(producto.montoDescuento)}</td>
                  <td className="text-end fw-bold">{formatearMoneda(producto.montoTotal)}</td>
                  {editando && (
                    <td className="text-end">
                      <AccionesItem
                        onEditar={() => setFormProducto({ show: true, detalle: producto })}
                        onEliminar={() => eliminarProducto(producto.id)}
                      />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4} className="text-end fw-bold">Subtotal productos</td>
                <td className="text-end fw-bolder">{formatearMoneda(subtotalProductos)}</td>
                {editando && <td />}
              </tr>
            </tfoot>
          </Table>
        ) : (
          <p className="text-secondary my-2" style={{ fontSize: '14px' }}>Esta venta no tiene productos.</p>
        )}
      </CardEditable>

      <ModalFormMembresia
        show={formMembresia.show}
        detalle={formMembresia.detalle}
        onHide={() => setFormMembresia(cerrado)}
        onGuardar={guardarMembresia}
      />
      <ModalFormProducto
        show={formProducto.show}
        detalle={formProducto.detalle}
        onHide={() => setFormProducto(cerrado)}
        onGuardar={guardarProducto}
      />
    </div>
  )
}
