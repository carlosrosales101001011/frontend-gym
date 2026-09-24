import { Col, Row } from 'react-bootstrap'
import ModalCR from '@/components/Modal/ModalCR'
import type { modalCustom } from '@/types/props'
import { InputSelectCR } from '@/components/TextFields/InputSelectCR'
import type { TCProps } from '@/pages/GestionTipoCambio/store/tipoCambioSlice'
import { initialStateTC } from '@/pages/GestionTipoCambio/store/tipoCambioSlice'    
import { useForm } from '@/hook/useForm'
import { InputCR } from '@/components/TextFields/InputCR'
import { useTerminologiaPersona } from '@/hook/usePropiedadesStore'
import { useEffect } from 'react'
import { useTCStore } from '@/pages/GestionTipoCambio/useTCStore'
import { ButtonCR } from '@/components/Button/ButtonCR'
import { removeNull } from '@/helpers/removeNull'

export const ModalCustomTC = ({id, onHide, show}:modalCustom) => {
    const {cargar, data} = useTerminologiaPersona('codigoOficialMoneda');
    const {post:postTC, obtenerxID, dataxID, patch} = useTCStore()
    const { register, formState: { errors }, handleSubmit, reset } = useForm<TCProps>({mode: "onChange", defaultValues: initialStateTC.tc})
    useEffect(() => {
        cargar()
    },  [show])
    useEffect(() => {
        if (id!==0 && show) {
            obtenerxID(id)
        }else{
            reset(initialStateTC.tc);
        }
    }, [show, id])
    useEffect(() => {
        if (dataxID && id !== 0) {
        reset({
            ...dataxID
        });
        }else if (id === 0) {
        reset(initialStateTC.tc);
        }
    }, [dataxID, id]);
    const onSubmit = (data:TCProps)=>{
        const { id, ...val } = removeNull(data);
        console.log(id);
        if (id!==0) {
            patch({...val, venta: Number(val.venta), compra: Number(val.compra)} as TCProps, id, '')
        }else{
            postTC({...val, venta: Number(val.venta), compra: Number(val.compra)} as TCProps)
        }
        onCancelar()
    }
    const onCancelar = ()=>{
        onHide()
        reset()
    }
  return (
    <ModalCR show={show} onHide={onHide} size={'md'}>
        <ModalCR.Header>
            <ModalCR.Title>{id==0 ? 'Agregar TC' : 'Editar TC'}</ModalCR.Title>
        </ModalCR.Header>
        <ModalCR.Body>
            <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                        <Col lg={6}>
                        <InputSelectCR options={data} {...register("id_codigo_monedaDestino", {
                            required: "Este campo es obligatorio"
                        })} label="Moneda Destino" name="id_codigo_monedaDestino" messageErrors={errors.id_codigo_monedaDestino?.message}/>
                        </Col>
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
                        <Col lg={6}>
                            <InputCR {...register("compra", {
                            required: "La compra es obligatoria"
                            })} label="Compra" name="compra" messageErrors={errors.compra?.message}/>
                        </Col>
                        <Col lg={12}>
                            <InputCR {...register("fecha", {
                            required: "Este campo es obligatorio"
                            })} label="Fecha" name="fecha" type='date' messageErrors={errors.fecha?.message}/>
                        </Col>
                    </Row>
                    <ButtonCR label={'Guardar'} type='submit'/>
                    <ButtonCR label={'Cancelar'} variant='link' onClick={onCancelar}/>
                </form>
            </div>
        </ModalCR.Body>
    </ModalCR>
  )
}