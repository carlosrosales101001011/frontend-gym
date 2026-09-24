import { useEffect } from 'react'
import { Col, Row } from 'react-bootstrap'
import ModalCR from '@/components/Modal/ModalCR'
import { InputCR } from '@/components/TextFields/InputCR'
import { InputSelectCR } from '@/components/TextFields/InputSelectCR'
import { ButtonCR } from '@/components/Button/ButtonCR'
import { useForm } from '@/hook/useForm'
import { useTerminologiaPersona } from '@/hook/usePropiedadesStore'
import { useVentasStore } from '@/pages/PuntoVenta/hook/useVentasStore'
import type { DetallePagoVentaProps } from '@/pages/PuntoVenta/store/ventaSlice'

const initialStatePago: DetallePagoVentaProps = {
  id_forma_pago: 0,
  montoPagos: 0,
}

type ModalCustomPagoProps = {
  show: boolean
  onHide: () => void
}

export const ModalCustomPago = ({ show, onHide }: ModalCustomPagoProps) => {
  const { cargar: cargarFormaPago, data: dataFormaPago } = useTerminologiaPersona('formaPagoVenta')
  const { onAgregarPago } = useVentasStore()
  const { register, formState: { errors }, handleSubmit, reset } = useForm<DetallePagoVentaProps>({ mode: 'onChange', defaultValues: initialStatePago })

  useEffect(() => {
    if (show) {
      cargarFormaPago()
      reset(initialStatePago)
    }
  }, [show])

  const onSubmitPago = (data: DetallePagoVentaProps) => {
    onAgregarPago(data)
    onHide()
  }

  return (
    <ModalCR show={show} onHide={onHide}>
      <ModalCR.Header>
        Agregar pago
      </ModalCR.Header>
      <ModalCR.Body>
        <form onSubmit={handleSubmit(onSubmitPago)}>
          <Row>
            <Col lg={12}>
              <InputSelectCR options={dataFormaPago} {...register("id_forma_pago", {
                required: "Este campo es obligatorio"
              })} label="Forma de pago" name="id_forma_pago" messageErrors={errors.id_forma_pago?.message} />
            </Col>
            <Col lg={12}>
              <InputCR {...register("montoPagos", {
                required: "Este campo es obligatorio"
              })} label="Monto" name="monto" messageErrors={errors.montoPagos?.message} />
            </Col>
            <Col lg={6}>
              <ButtonCR label="Agregar" type="submit" />
            </Col>
            <Col lg={6}>
              <ButtonCR label="Cancelar" type="button" variant="link" onClick={onHide} />
            </Col>
          </Row>
        </form>
      </ModalCR.Body>
    </ModalCR>
  )
}
