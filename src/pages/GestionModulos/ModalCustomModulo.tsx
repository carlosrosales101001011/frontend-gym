import React, { useEffect } from 'react'
import ModalCR from '@/components/Modal/ModalCR'
import { InputCR } from '@/components/TextFields/InputCR'
import { InputSelectCR } from '@/components/TextFields/InputSelectCR'
import { useTerminologiaPersona } from '@/hook/usePropiedadesStore'
import { useForm } from '@/hook/useForm'
import { initialStateModulo } from '@/pages/GestionModulos/store/moduloSlice'
import { ButtonCR } from '@/components/Button/ButtonCR'
import type { ModuloProps } from '@/pages/GestionModulos/store/moduloSlice'
import { useModuloStore } from '@/pages/GestionModulos/useModuloStore'

export const ModalCustomModulo = ({id, onHide, show}: {id: number, onHide: ()=>void, show: boolean}) => {
    const { data:dataTipoModulo, cargar:cargarTipoModulo } = useTerminologiaPersona('tipoModulo');
    const { post, dataxID, obtenerxID, patch} = useModuloStore()
    const { formState, register, handleSubmit, reset } = useForm({defaultValues: initialStateModulo.modulo, mode: 'onChange'})
    useEffect(() => {
        if (show) {
            cargarTipoModulo();
        }
    }, [show])
    
        useEffect(() => {
          if (id!==0 && show) {
            obtenerxID(id)
          }else{
            reset(initialStateModulo.modulo);
          }
        }, [show, id])
        
        useEffect(() => {
          if (dataxID && id !== 0) {
            reset({
              ...dataxID
            });
          }else if (id === 0) {
            reset(initialStateModulo.modulo);
          }
        }, [dataxID, id]);
    const onSubmit = (data: ModuloProps)=>{
        const { id, ...val } = data;
        if (id!==0) {
        patch({...val} as ModuloProps, id, '')
        }else{
        post({...val} as ModuloProps)
        }
        onCancelar()
    }
    const onCancelar = ()=>{
        onHide()
        reset(initialStateModulo.modulo)
    }
  return (
    <ModalCR onHide={onHide} show={show}>
        <ModalCR.Header>
            <ModalCR.Title>Agregar Modulo {id} </ModalCR.Title>
        </ModalCR.Header>
        <ModalCR.Body>
            <form onSubmit={handleSubmit(onSubmit)}>
                <InputCR {...register("label", {
                    required: "Este campo es obligatorio"
                  })} label='Nombre del modulo' name='label' type='normal' />
                <InputCR {...register("url", {
                    required: "Este campo es obligatorio"
                  })} label='Url' name='url' type='normal' />
                <InputCR {...register("icono", {
                    required: "Este campo es obligatorio"
                  })} label='Icono' name='icono' type='normal' />
                <InputSelectCR {...register("id_tipo", {
                    required: "Este campo es obligatorio"
                  })} label='Tipo' name='id_tipo' options={dataTipoModulo} messageErrors={formState.errors.id_tipo?.message}/>
                <InputCR {...register("descripcion", {
                    required: "Este campo es obligatorio"
                  })} label='Descripción' name='descripcion' type='text-area' />
                <ButtonCR label='Guardar' type='submit' />
            </form>
        </ModalCR.Body>
    </ModalCR>
  )
}
