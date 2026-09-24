import React, { useEffect } from 'react'
import ModalCR from '@/components/Modal/ModalCR'
import { InputCR } from '@/components/TextFields/InputCR'
import { useContactoEmergenciaStore } from '@/components/GestionContactoEmergencia/useContactoEmergenciaStore'
import { useForm } from '@/hook/useForm'
import { initialContactoEmergencia, type ContactoEmergenciaProps } from '@/components/GestionContactoEmergencia/contactoEmergenciaSlice'
import { ButtonCR } from '@/components/Button/ButtonCR'
import { Col, Row } from 'react-bootstrap'
import { InputSelectCR } from '@/components/TextFields/InputSelectCR'
import { useTerminologiaPersona } from '@/hook/usePropiedadesStore'
import { useSelector } from 'react-redux'
import type { RootState } from '@/stores/Store'
type props ={
    show: boolean;
    onHide: ()=>void;
    id:number;
    uid_location: string;
}
export const ModalContactoEmergencia = ({show, onHide, id, uid_location}:props) => {
    const { obtenerContactoEmergenciaxID, postContactoEmergencia, patchContactoEmergencia } = useContactoEmergenciaStore(uid_location)
    const { data:dataParientes, cargar:cargarParientes } = useTerminologiaPersona('parientes');
    const { contactoEmergencia } = useSelector((state: RootState)=>state.CONTACTO_EMERGENCIA)
    useEffect(() => {
        if (id!==0) {
            obtenerContactoEmergenciaxID(id)
        }
    }, [id])
    const { getValues, register, reset, handleSubmit, formState: {errors} } = useForm({defaultValues: initialContactoEmergencia, mode: 'onChange'})
    useEffect(() => {
        if (show) {
            cargarParientes()
        }
    }, [show])
    useEffect(() => {
        if (id === 0) {
            reset(initialContactoEmergencia);
        } else {
            reset(contactoEmergencia);
        }
    }, [contactoEmergencia, id])
    const onSubmit = ()=>{
        const { id:idm, tipoPariente, ...val } = getValues()
        console.log({idm, tipoPariente});
        if(id===0){
            postContactoEmergencia(val as ContactoEmergenciaProps)
        }else{
            patchContactoEmergencia(id, val as ContactoEmergenciaProps)
        }
        cancelar()
    }
    const cancelar = ()=>{
        reset(initialContactoEmergencia);
        onHide()
    }
  return (
    <ModalCR onHide={cancelar} show={show}>
        <ModalCR.Header>
            Agregar contacto de emergencia
        </ModalCR.Header>
        <ModalCR.Body>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                    <Col lg={12}>
                    <InputSelectCR {...register("id_cargo", {
                        required: "Este campo es obligatorio"
                        })} label='Parientes' options={dataParientes}/>
                    </Col>
                    <Col lg={12}>
                    <InputCR {...register("nombres", {
                        required: "Este campo es obligatorio"
                        })} label='Nombres' type='normal' messageErrors={errors.nombres?.message}/>
                    </Col>
                    <Col lg={6}>
                    <InputCR {...register("apellido_paterno")} label='Apellido paterno' type='normal' messageErrors={errors.apellido_paterno?.message}/>
                    </Col>
                    <Col lg={6}>
                    <InputCR {...register("apellido_materno")} label='Apellido materno' type='normal' messageErrors={errors.apellido_materno?.message}/>
                    </Col>
                    <Col lg={6}>
                    <InputCR {...register("telefono", {
                        required: "Este campo es obligatorio"
                        })} label='Telefono' type='normal' messageErrors={errors.telefono?.message}/>
                    </Col>
                    <Col lg={6}>
                    <InputCR {...register("email", {
                        required: "Este campo es obligatorio"
                        })} label='Email' messageErrors={errors.email?.message}/>
                    </Col>
                    <Col lg={12}>
                    <InputCR {...register("observacion", {
                        required: "Este campo es obligatorio"
                        })} label='Observacion' type='text-area' messageErrors={errors.email?.message}/>
                    </Col>
                </Row>
                <ButtonCR label={'Guardar'} type='submit'/>
                <ButtonCR label={'Cancelar'} variant='danger' onClick={()=>cancelar()}/>
            </form>
        </ModalCR.Body>
    </ModalCR>
  )
}
