import { useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { format } from 'date-fns'
import ModalCR from '@/components/Modal/ModalCR'
import { ButtonCR } from '@/components/Button/ButtonCR'
import { InputCR } from '@/components/TextFields/InputCR'
import { InputMontoCR } from '@/components/TextFields/InputMontoCR'
import { InputSelectCR } from '@/components/TextFields/InputSelectCR'
import type { OpcionesSelect } from '@/types/props'
import type { DetallePagoProps, PagoForm } from '../../types'
import { aFechaISO, aNumero } from '../../helpers'

const formularioVacio = (): PagoForm => ({
  id_forma_pago: 0,
  monto: 0,
  fecha_pago: format(new Date(), 'yyyy-MM-dd'),
  observacion: '',
})

const aFormulario = (detalle: DetallePagoProps): PagoForm => ({
  id_forma_pago: detalle.id_forma_pago,
  monto: aNumero(detalle.monto),
  fecha_pago: aFechaISO(detalle.fecha_pago),
  observacion: detalle.observacion ?? '',
})

type ModalFormPagoProps = {
  show: boolean
  onHide: () => void
  /** Si se pasa, edita ese pago; si no, agrega uno nuevo. */
  detalle?: DetallePagoProps | null
  formasPago: OpcionesSelect[]
  /** Monto sugerido al agregar (ej. saldo pendiente). */
  montoSugerido?: number
  onGuardar: (values: PagoForm, idDetalle?: number) => Promise<boolean>
}

export const ModalFormPago = ({ show, onHide, detalle, ...props }: ModalFormPagoProps) => (
  <ModalCR show={show} onHide={onHide}>
    <ModalCR.Header>
      <ModalCR.Title>{detalle ? 'Editar pago' : 'Agregar pago'}</ModalCR.Title>
    </ModalCR.Header>
    <ModalCR.Body>
      {/* Se monta al abrir: el formulario arranca limpio en cada apertura. */}
      {show && <FormularioPago key={detalle?.id ?? 'nuevo'} detalle={detalle} onHide={onHide} {...props} />}
    </ModalCR.Body>
  </ModalCR>
)

const FormularioPago = ({ detalle, formasPago, montoSugerido = 0, onHide, onGuardar }: Omit<ModalFormPagoProps, 'show'>) => {
  const [form, setForm] = useState<PagoForm>(() => (detalle ? aFormulario(detalle) : { ...formularioVacio(), monto: montoSugerido }))
  const [guardando, setGuardando] = useState(false)

  const valido = form.id_forma_pago > 0 && form.monto > 0 && !!form.fecha_pago

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
        <Col md={6}>
          <InputSelectCR
            label="Forma de pago"
            required
            options={formasPago}
            defaultValue={String(form.id_forma_pago)}
            onChange={(e) => setForm((prev) => ({ ...prev, id_forma_pago: Number(e.target.value) }))}
          />
        </Col>
        <Col md={6}>
          <InputMontoCR
            label="Monto"
            required
            value={form.monto}
            onChange={(monto) => setForm((prev) => ({ ...prev, monto }))}
            messageErrors={form.monto <= 0 ? 'Debe ser mayor a 0' : ''}
          />
        </Col>
        <Col md={6}>
          <InputCR
            type="date"
            label="Fecha de pago"
            required
            value={form.fecha_pago}
            onChange={(e) => setForm((prev) => ({ ...prev, fecha_pago: e.target.value }))}
          />
        </Col>
        <Col xs={12}>
          <InputCR
            type="text-area"
            label="Observación"
            value={form.observacion}
            onChange={(e) => setForm((prev) => ({ ...prev, observacion: e.target.value }))}
          />
        </Col>
        <Col xs={12} className="d-flex justify-content-end">
          <ButtonCR label="Cancelar" variant="link" onClick={onHide} disabled={guardando} />
          <ButtonCR label={guardando ? 'Guardando...' : 'Guardar'} type="submit" disabled={!valido || guardando} />
        </Col>
      </Row>
    </form>
  )
}
