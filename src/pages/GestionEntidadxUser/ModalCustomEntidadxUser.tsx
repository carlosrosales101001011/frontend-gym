import React, { useEffect } from 'react'
import ModalCR from '@/components/Modal/ModalCR'
import { InputSelectCR } from '@/components/TextFields/InputSelectCR'
import { useTerminologiaPersona } from '@/hook/usePropiedadesStore'
import { useForm } from '@/hook/useForm'
import { initialStateEntidadxUser, type EntidadxUserProps } from '@/pages/GestionEntidadxUser/store/entidadxuserSlice'
import { ButtonCR } from '@/components/Button/ButtonCR'
import { useEntidadxUserStore } from '@/pages/GestionEntidadxUser/useEntidadxUserStore'

export const ModalCustomEntidadxUser = ({id, onHide, show}: {id: number, onHide: ()=>void, show: boolean}) => {
    const { data:dataTipoMonto, cargar:cargarTipoMonto } = useTerminologiaPersona('tipoMonto');
    const { data:dataBaseCalculo, cargar:cargarBaseCalculo } = useTerminologiaPersona('baseCalculo');
    const { data:dataAplicarSobre, cargar:cargarAplicarSobre } = useTerminologiaPersona('aplicarSobre');
    const { post, dataxID, obtenerxID, patch} = useEntidadxUserStore()
    const { formState,  register, handleSubmit, reset } = useForm({defaultValues: initialStateEntidadxUser.entidadxUser, mode: 'onChange'})
    useEffect(() => {
        if (show) {
            cargarTipoMonto();
            cargarBaseCalculo();
            cargarAplicarSobre();
        }
    }, [show])
    
        useEffect(() => {
          if (id!==0 && show) {
            obtenerxID(id)
          }else{
            reset(initialStateEntidadxUser.entidadxUser);
          }
        }, [show, id])
        
        useEffect(() => {
          if (dataxID && id !== 0) {
            reset({
              ...dataxID
            });
          }else if (id === 0) {
            reset(initialStateEntidadxUser.entidadxUser);
          }
        }, [dataxID, id]);
    const onSubmit = (data: EntidadxUserProps)=>{
        const { id, ...val } = data;
        if (id!==0) {
        patch({...val} as EntidadxUserProps, id, '')
        }else{
        post({...val} as EntidadxUserProps)
        }
        onCancelar()
    }
    const onCancelar = ()=>{
        onHide()
        reset(initialStateEntidadxUser.entidadxUser)
    }
  return (
    <ModalCR onHide={onHide} show={show}>
        <ModalCR.Header>
            <ModalCR.Title>Agregar EntidadxUser {id} </ModalCR.Title>
        </ModalCR.Header>
        <ModalCR.Body>
            <form onSubmit={handleSubmit(onSubmit)}>
                <InputSelectCR {...register("id_entidad", {
                    required: "Este campo es obligatorio"
                  })} label='Tipo' name='id_entidad' options={dataTipoMonto} messageErrors={formState.errors.id_entidad?.message}/>
                <InputSelectCR {...register("id_user", {
                    required: "Este campo es obligatorio"
                  })} label='Aplica Sobre' name='id_user' options={dataAplicarSobre} messageErrors={formState.errors.id_user?.message}/>
                <InputSelectCR {...register("id_estado_CREATE", {
                    required: "Este campo es obligatorio"
                  })} label='Estado de creacion' name='id_estado_CREATE' options={dataBaseCalculo} messageErrors={formState.errors.id_estado_CREATE?.message}/>
                <InputSelectCR {...register("id_estado_UPDATE", {
                    required: "Este campo es obligatorio"
                  })} label='Estado de actualizacion' name='id_estado_UPDATE' options={dataBaseCalculo} messageErrors={formState.errors.id_estado_UPDATE?.message}/>
                <InputSelectCR {...register("id_estado_READ", {
                    required: "Este campo es obligatorio"
                  })} label='Estado de lectura' name='id_estado_READ' options={dataBaseCalculo} messageErrors={formState.errors.id_estado_READ?.message}/>
                  <InputSelectCR {...register("id_estado_DELETE", {
                    required: "Este campo es obligatorio"
                  })} label='Estado de eliminacion' name='id_estado_DELETE' options={dataBaseCalculo} messageErrors={formState.errors.id_estado_DELETE?.message}/>
                  
                <ButtonCR label='Guardar' type='submit' />
            </form>
        </ModalCR.Body>
    </ModalCR>
  )
}
