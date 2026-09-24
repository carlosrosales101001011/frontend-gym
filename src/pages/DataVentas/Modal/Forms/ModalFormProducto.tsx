import { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import httpClient from '@/common/helpers/httpClient'
import ModalCR from '@/components/Modal/ModalCR'
import { ButtonCR } from '@/components/Button/ButtonCR'
import { InputMontoCR } from '@/components/TextFields/InputMontoCR'
import { InputSelectCR } from '@/components/TextFields/InputSelectCR'
import type { ProductoProps } from '@/pages/PuntoVenta/store/ventaSlice'
import type { DetalleProductoProps, ProductoForm } from '../../types'
import { aNumero, formatearMoneda, redondear2 } from '../../helpers'

const formularioVacio: ProductoForm = {
  id_producto: 0,
  precio_unitario_producto: 0,
  cantidad: 1,
  montoDescuento: 0,
  montoTotal: 0,
}

const aFormulario = (detalle: DetalleProductoProps): ProductoForm => ({
  id_producto: detalle.id_producto,
  precio_unitario_producto: aNumero(detalle.precio_unitario_producto),
  cantidad: detalle.cantidad,
  montoDescuento: aNumero(detalle.montoDescuento),
  montoTotal: aNumero(detalle.montoTotal),
})

const calcularTotal = (form: ProductoForm) => ({
  ...form,
  montoTotal: redondear2(Math.max(0, form.precio_unitario_producto * form.cantidad - form.montoDescuento)),
})

type ModalFormProductoProps = {
  show: boolean
  onHide: () => void
  /** Si se pasa, edita ese producto; si no, agrega uno nuevo. */
  detalle?: DetalleProductoProps | null
  onGuardar: (values: ProductoForm, idDetalle?: number) => Promise<boolean>
}

export const ModalFormProducto = ({ show, onHide, detalle, onGuardar }: ModalFormProductoProps) => (
  <ModalCR show={show} onHide={onHide}>
    <ModalCR.Header>
      <ModalCR.Title>{detalle ? 'Editar producto' : 'Agregar producto'}</ModalCR.Title>
    </ModalCR.Header>
    <ModalCR.Body>
      {/* Se monta al abrir: el formulario arranca limpio en cada apertura. */}
      {show && <FormularioProducto key={detalle?.id ?? 'nuevo'} detalle={detalle} onHide={onHide} onGuardar={onGuardar} />}
    </ModalCR.Body>
  </ModalCR>
)

const FormularioProducto = ({ detalle, onHide, onGuardar }: Omit<ModalFormProductoProps, 'show'>) => {
  const [form, setForm] = useState<ProductoForm>(() => (detalle ? aFormulario(detalle) : formularioVacio))
  const [guardando, setGuardando] = useState(false)
  const [productos, setProductos] = useState<ProductoProps[]>([])

  useEffect(() => {
    httpClient.get('/producto')
      .then(({ data }: { data: { lista: ProductoProps[] } }) => setProductos(data.lista))
      .catch(console.error)
  }, [])

  const onSelectProducto = (id_producto: number) => {
    const producto = productos.find((p) => p.id === id_producto)
    setForm((prev) => calcularTotal({ ...prev, id_producto, precio_unitario_producto: aNumero(producto?.precio_venta_actual) }))
  }

  const onCambiarNumero = (campo: 'precio_unitario_producto' | 'cantidad' | 'montoDescuento', valor: number) =>
    setForm((prev) => calcularTotal({ ...prev, [campo]: valor }))

  const subtotal = form.precio_unitario_producto * form.cantidad
  const valido = form.id_producto > 0 && form.cantidad > 0 && form.montoDescuento <= subtotal

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!valido) return
    setGuardando(true)
    const ok = await onGuardar(form, detalle?.id)
    setGuardando(false)
    if (ok) onHide()
  }

  return (
    <form onSubmit={onSubmit}>
      <Row className="g-2">
        <Col xs={12}>
          <InputSelectCR
            label="Producto"
            required
            options={productos.map((p) => ({ value: p.id, label: `${p.nombre} · ${formatearMoneda(p.precio_venta_actual)}` }))}
            defaultValue={String(form.id_producto)}
            onChange={(e) => onSelectProducto(Number(e.target.value))}
          />
        </Col>
        <Col md={6}>
          <InputMontoCR
            label="Precio unitario"
            value={form.precio_unitario_producto}
            onChange={(valor) => onCambiarNumero('precio_unitario_producto', valor)}
          />
        </Col>
        <Col md={6}>
          <InputMontoCR
            label="Cantidad"
            decimales={0}
            value={form.cantidad}
            onChange={(valor) => onCambiarNumero('cantidad', valor)}
            messageErrors={form.cantidad <= 0 ? 'Debe ser mayor a 0' : ''}
          />
        </Col>
        <Col md={6}>
          <InputMontoCR
            label="Descuento"
            value={form.montoDescuento}
            onChange={(valor) => onCambiarNumero('montoDescuento', valor)}
            messageErrors={form.montoDescuento > subtotal ? 'No puede superar el subtotal' : ''}
          />
        </Col>
        <Col md={6} className="d-flex flex-column justify-content-center">
          <span className="text-secondary" style={{ fontSize: '13px' }}>Total</span>
          <span className="fw-bolder fs-5">{formatearMoneda(form.montoTotal)}</span>
        </Col>
        <Col xs={12} className="d-flex justify-content-end">
          <ButtonCR label="Cancelar" variant="link" onClick={onHide} disabled={guardando} />
          <ButtonCR label={guardando ? 'Guardando...' : 'Guardar'} type="submit" disabled={!valido || guardando} />
        </Col>
      </Row>
    </form>
  )
}
