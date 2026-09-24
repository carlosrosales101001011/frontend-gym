import React, { useEffect } from 'react'
import type { modalCustom } from '@/types/props'
import { initialStateDetallePago } from '@/pages/GestionEgresos/DetallePago/store/detallePagoSlice'
import ModalCR from '@/components/Modal/ModalCR'
import { Col, Row } from 'react-bootstrap'
import { InputCR } from '@/components/TextFields/InputCR'
import { ButtonCR } from '@/components/Button/ButtonCR'
import { useForm } from '@/hook/useForm'
import { useDispatch, useSelector } from 'react-redux'
import { onAddItemDetallesGastoPago, type DetallePagoProps } from '@/pages/GestionEgresos/DetallePago/store/detallePagoSlice'
import { InputSelectCR } from '@/components/TextFields/InputSelectCR'
import { useTerminologiaPersona } from '@/hook/usePropiedadesStore'
import { useEgresosStore } from '@/pages/GestionEgresos/useEgresosStore'
import type { RootState } from '@/stores/Store'

export const ModalCustomDetalleGastoPago = ({show, onHide, id}:modalCustom) => {
    const { cargar: cargarMoneda, data: dataMoneda } = useTerminologiaPersona('codigoOficialMoneda')
    const { obtenerOpCuentasFinancieras } = useEgresosStore()
  const { opcionesCuentasFinancieras } = useSelector((state: RootState)=>state.EGRESO)
    const { register, formState: { errors }, handleSubmit} = useForm<DetallePagoProps>({mode: "onChange",defaultValues: initialStateDetallePago })
    const dispatch = useDispatch()
    useEffect(() => {
      if (show) {
        cargarMoneda()
        obtenerOpCuentasFinancieras()
      }
    }, [show])
    const onSubmitDetalleEgreso = (data: DetallePagoProps) => {
      dispatch(onAddItemDetallesGastoPago([data]))
      onHide()
     }
  return (
    <ModalCR show={show} onHide={onHide}>
        <ModalCR.Header>
            <ModalCR.Title>Detalle de Pago {id}</ModalCR.Title>
        </ModalCR.Header>
        <ModalCR.Body>
            
            <form onSubmit={handleSubmit(onSubmitDetalleEgreso)}>
                <Row>
                    <Col lg={12}>
                    <InputSelectCR options={opcionesCuentasFinancieras} {...register("id_forma_pago", {
                      required: "Este campo es obligatorio"
                    })} label="Forma de Pago" name="id_forma_pago" messageErrors={errors.id_forma_pago?.message}/>
                    </Col>
                    <Col lg={6}>
                    <InputSelectCR options={dataMoneda} {...register("id_codigo_moneda", {
                      required: "Este campo es obligatorio"
                    })} label="Codigo Moneda" name="id_codigo_moneda" messageErrors={errors.id_codigo_moneda?.message}/>
                    </Col>
                    <Col lg={6}>
                    <InputCR {...register("monto", {
                      required: "Este campo es obligatorio"
                    })} label="Monto" name="monto" messageErrors={errors.monto?.message}/>
                    </Col>
                    <Col lg={12}>
                    <InputCR {...register("fecha_pago", {
                      required: "Este campo es obligatorio"
                    })} label="Fecha de Pago" name="fecha_pago" type='date' messageErrors={errors.fecha_pago?.message}/>
                    </Col>
                    <Col lg={12}>
                    <InputCR type='text-area' {...register("observacion", {
                      required: "Este campo es obligatorio"
                    })} label="Observacion" name="observacion" messageErrors={errors.observacion?.message}/>
                    </Col>
                    <Col lg={6}>
                      <ButtonCR label={'Agregar'} type='submit'/>
                    </Col>
                    <Col lg={6}>
                      <ButtonCR label={'Cancelar'} type='button' variant='link'/>
                    </Col>
                </Row>
            </form>
        </ModalCR.Body>
    </ModalCR>
  )
}
