import React, { useEffect } from 'react'
import ModalCR from '@/components/Modal/ModalCR'
import { InputSelectCR } from '@/components/TextFields/InputSelectCR'
import { useTerminologiaPersona } from '@/hook/usePropiedadesStore'
import { useForm } from '@/hook/useForm'
import { initialStateSeccionxmodulouser, type SeccionxmodulouserProps } from '@/pages/GestionSeccionXmodulouser/store/seccionxmodulouserSlice'
import { ButtonCR } from '@/components/Button/ButtonCR'
import { useSeccionXmodulouserStore } from '@/pages/GestionSeccionXmodulouser/useSeccionXmodulouserStore'

export const ModalCustomSeccionXmodulouser = ({id, onHide, show}: {id: number, onHide: ()=>void, show: boolean}) => {
    const { data:dataTipoMonto, cargar:cargarTipoMonto } = useTerminologiaPersona('tipoMonto');
    const { data:dataBaseCalculo, cargar:cargarBaseCalculo } = useTerminologiaPersona('baseCalculo');
    const { post, dataxID, obtenerxID, patch} = useSeccionXmodulouserStore()
    const { formState, register, handleSubmit, reset } = useForm({defaultValues: initialStateSeccionxmodulouser.seccionxmodulouserItem, mode: 'onChange'})
    useEffect(() => {
        if (show) {
            cargarTipoMonto();
            cargarBaseCalculo();
        }
    }, [show])
    
        useEffect(() => {
          if (id!==0 && show) {
            obtenerxID(id)
          }else{
            reset(initialStateSeccionxmodulouser.seccionxmodulouserItem);
          }
        }, [show, id])
        
        useEffect(() => {
          if (dataxID && id !== 0) {
            reset({
              ...dataxID
            });
          }else if (id === 0) {
            reset(initialStateSeccionxmodulouser.seccionxmodulouserItem);
          }
        }, [dataxID, id]);
    const onSubmit = (data: SeccionxmodulouserProps)=>{
        const { id, ...val } = data;
        if (id!==0) {
        patch(val as SeccionxmodulouserProps, id, '')
        }else{
        post(val as SeccionxmodulouserProps)
        }
        onCancelar()
    }
    const onCancelar = ()=>{
        onHide()
        reset(initialStateSeccionxmodulouser.seccionxmodulouserItem)
    }
  return (
    <ModalCR onHide={onHide} show={show}>
        <ModalCR.Header>
            <ModalCR.Title>Agregar impuestos {id} </ModalCR.Title>
        </ModalCR.Header>
        <ModalCR.Body>
            <form onSubmit={handleSubmit(onSubmit)}>
                <InputSelectCR {...register("id_modulouser", {
                    required: "Este campo es obligatorio"
                  })} label='Tipo' name='id_modulouser' options={dataTipoMonto} messageErrors={formState.errors.id_modulouser?.message}/>
                <InputSelectCR {...register("id_seccion", {
                    required: "Este campo es obligatorio"
                  })} label='Tipo' name='id_seccion' options={dataBaseCalculo} messageErrors={formState.errors.id_seccion?.message}/>
                <ButtonCR label='Guardar' type='submit' />
            </form>
        </ModalCR.Body>
    </ModalCR>
  )
}
