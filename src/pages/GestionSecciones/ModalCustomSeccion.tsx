import { useEffect, useState } from 'react'
import ModalCR from '@/components/Modal/ModalCR'
import { InputCR } from '@/components/TextFields/InputCR'
import InputSwitchCR from '@/components/TextFields/InputSwitchCR'
import { useForm } from '@/hook/useForm'
import type { SeccionProps } from '@/pages/GestionSecciones/store/seccionSlice'
import { ButtonCR } from '@/components/Button/ButtonCR'
import { initialStateSeccion } from '@/pages/GestionSecciones/store/seccionSlice'
import { useSeccionesStore } from '@/pages/GestionSecciones/useSeccionesStore'
import { removeNull } from '@/helpers/removeNull'
export const ModalCustomSeccion = ({id, onHide, show}: {id: number, onHide: ()=>void, show: boolean}) => {
    const { dataxID, obtenerxID, guardarSeccion } = useSeccionesStore()
    const [guardando, setGuardando] = useState(false)
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
    // Se espera la respuesta: el modal solo se cierra si se guardó (si falla, guardarSeccion avisa)
    const onSubmit = async (data: SeccionProps)=>{
        setGuardando(true)
        const guardado = await guardarSeccion({ ...removeNull(data), id })
        setGuardando(false)
        if (guardado) onCancelar()
    }
    const onCancelar = ()=>{
        onHide()
        reset(initialStateSeccion.seccion)
    }
  return (
    <ModalCR onHide={onHide} show={show}>
        <ModalCR.Header>
            <ModalCR.Title>{id ? 'Editar sección' : 'Agregar sección'}</ModalCR.Title>
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
                <InputSwitchCR {...register("is_seccion_mantenimiento")} name='is_seccion_mantenimiento' label='Sección en mantenimiento' />
                <ButtonCR label={guardando ? 'Guardando...' : 'Guardar'} type='submit' disabled={guardando} />
            </form>
        </ModalCR.Body>
    </ModalCR>
  )
}
