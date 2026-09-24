import React, { useEffect } from 'react'
import ModalCR from '@/components/Modal/ModalCR'
import { InputCR } from '@/components/TextFields/InputCR'
import { useForm } from '@/hook/useForm'
import type { SeccionProps } from '@/pages/GestionSecciones/store/seccionSlice'
import { ButtonCR } from '@/components/Button/ButtonCR'
import { initialStateSeccion } from '@/pages/GestionSecciones/store/seccionSlice'
import { useSeccionesStore } from '@/pages/GestionSecciones/useSeccionesStore'
import { removeNull } from '@/helpers/removeNull'
export const ModalCustomSeccion = ({id, onHide, show}: {id: number, onHide: ()=>void, show: boolean}) => {
    const { post, dataxID, obtenerxID, patch} = useSeccionesStore()
    const {  register, handleSubmit, reset } = useForm({defaultValues: initialStateSeccion.seccion, mode: 'onChange'})
        useEffect(() => {
          if (id!==0 && show) {
            obtenerxID(id)
          }else{
            reset(initialStateSeccion.seccion);
          }
        }, [show, id])
        
        useEffect(() => {
          if (dataxID && id !== 0) {
            reset({
              ...dataxID
            });
          }else if (id === 0) {
            reset(initialStateSeccion.seccion);
          }
        }, [dataxID, id]);
    const onSubmit = (data: SeccionProps)=>{
        const { id, ...val } = removeNull(data);
        if (id!==0) {
        patch(val, id, '')
        }else{
        post(val)
        }
        onCancelar()
    }
    const onCancelar = ()=>{
        onHide()
        reset(initialStateSeccion.seccion)
    }
  return (
    <ModalCR onHide={onHide} show={show}>
        <ModalCR.Header>
            <ModalCR.Title>Agregar sección {id} </ModalCR.Title>
        </ModalCR.Header>
        <ModalCR.Body>
            <form onSubmit={handleSubmit(onSubmit)}>
                <InputCR {...register("label", {
                    required: "Este campo es obligatorio"
                  })} label='Nombre de la seccion' name='label' type='normal' />
                <InputCR {...register("subSeccion", {
                    required: "Este campo es obligatorio"
                  })} label='Nombre de la subsección' name='subSeccion' type='normal' />
                <InputCR {...register("url", {
                    required: "Este campo es obligatorio"
                  })} label='URL' name='url' type='normal' />
                <ButtonCR label='Guardar' type='submit' />
            </form>
        </ModalCR.Body>
    </ModalCR>
  )
}
