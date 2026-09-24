import React, { useEffect } from 'react'
import ModalCR from '@/components/Modal/ModalCR'
import { InputCR } from '@/components/TextFields/InputCR'
import { InputSelectCR } from '@/components/TextFields/InputSelectCR'
import { useTerminologiaPersona } from '@/hook/usePropiedadesStore'
import { useForm } from '@/hook/useForm'
import { initialStateGrupoFinanzas, type grupoFinanzaProps } from '@/pages/GestionTermGrupoFinanzas/store/grupoFinanzasSlice'
import { ButtonCR } from '@/components/Button/ButtonCR'
import { useGrupoFinanzasStore } from '@/pages/GestionTermGrupoFinanzas/useGrupoFinanzasStore'

export const ModalCustomGrupoFinanzas = ({id, onHide, show}: {id: number, onHide: ()=>void, show: boolean}) => {
    const { data:dataBaseCalculo, cargar:cargarBaseCalculo } = useTerminologiaPersona('tipoMovimientoFinanzas');
    const { post, dataxID, obtenerxID, patch} = useGrupoFinanzasStore()
    const { formState, register, handleSubmit, reset } = useForm({defaultValues: initialStateGrupoFinanzas.grupoFinanza, mode: 'onChange'})
    useEffect(() => {
        if (show) {
            cargarBaseCalculo();
        }
    }, [show])
    
        useEffect(() => {
          if (id!==0 && show) {
            obtenerxID(id)
          }else{
            reset(initialStateGrupoFinanzas.grupoFinanza);
          }
        }, [show, id])
        
        useEffect(() => {
          if (dataxID && id !== 0) {
            reset({
              ...dataxID
            });
          }else if (id === 0) {
            reset(initialStateGrupoFinanzas.grupoFinanza);
          }
        }, [dataxID, id]);
    const onSubmit = (data: grupoFinanzaProps)=>{
        const { id, ...val } = data;
        if (id!==0) {
        patch({...val} as grupoFinanzaProps, id, '')
        }else{
        post({...val} as grupoFinanzaProps)
        }
        onCancelar()
    }
    const onCancelar = ()=>{
        onHide()
        reset(initialStateGrupoFinanzas.grupoFinanza)
    }
  return (
    <ModalCR onHide={onHide} show={show}>
        <ModalCR.Header>
            <ModalCR.Title>Agregar Grupo {id} </ModalCR.Title>
        </ModalCR.Header>
        <ModalCR.Body>
            <form onSubmit={handleSubmit(onSubmit)}>
                <InputCR {...register("nombre", {
                    required: "Este campo es obligatorio"
                  })} label='Nombre del grupo' name='nombre' type='normal' />
                <InputSelectCR {...register("id_tipo_movimiento", {
                    required: "Este campo es obligatorio"
                  })} label='Tipo de movimiento' name='id_tipo_movimiento' options={dataBaseCalculo} messageErrors={formState.errors.id_tipo_movimiento?.message}/>
                <InputCR {...register("descripcion", {
                    required: "Este campo es obligatorio"
                  })} label='Descripción' name='descripcion' type='text-area' />
                <ButtonCR label='Guardar' type='submit' />
            </form>
        </ModalCR.Body>
    </ModalCR>
  )
}
