import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { InputCR } from '@/components/TextFields/InputCR'
import { useForm } from '@/hook/useForm'

export const App = () => {
        const { formState, getValues, register, handleSubmit, reset } = useForm({defaultValues: initialStateImpuesto.impuesto, mode: 'onChange'})
  return (
    <div>
        <form>
            <Row>
                        <Col lg={6}>
                        <InputSelectCR options={data} {...register("id_codigo_monedaOrigen", {
                            required: "Este campo es obligatorio"
                        })} label="Moneda Origen" name="id_codigo_monedaOrigen" messageErrors={errors.id_codigo_monedaOrigen?.message}/>
                        </Col>
                        <Col lg={6}>
                            <InputCR {...register("venta", {
                            required: "La venta es obligatoria"
                            })} label="Venta" name="venta" messageErrors={errors.venta?.message}/>
                        </Col>
            </Row>
        </form>
    </div>
  )
}
