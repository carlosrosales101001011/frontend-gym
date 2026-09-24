import React, { useEffect } from 'react'
import ModalCR from '@/components/Modal/ModalCR'
import { InputCR } from '@/components/TextFields/InputCR'
import { InputSelectCR } from '@/components/TextFields/InputSelectCR'
import { useTerminologiaPersona } from '@/hook/usePropiedadesStore'
import { useForm } from '@/hook/useForm'
import { initialStateImpuesto, type ImpuestosProps } from '@/pages/GestionSeccionXentidad/store/ImpuestoSlice'
import { ButtonCR } from '@/components/Button/ButtonCR'
import { useImpuestosStore } from '@/pages/GestionSeccionXentidad/useImpuestosStore'

export const ModalCustomImpuesto = ({id, onHide, show}: {id: number, onHide: ()=>void, show: boolean}) => {
    const { data:dataTipoMonto, cargar:cargarTipoMonto } = useTerminologiaPersona('tipoMonto');
    const { data:dataBaseCalculo, cargar:cargarBaseCalculo } = useTerminologiaPersona('baseCalculo');
    const { data:dataAplicarSobre, cargar:cargarAplicarSobre } = useTerminologiaPersona('aplicarSobre');
    const { post, dataxID, obtenerxID, patch} = useImpuestosStore()
    const { formState, getValues, register, handleSubmit, reset } = useForm({defaultValues: initialStateImpuesto.impuesto, mode: 'onChange'})
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
            reset(initialStateImpuesto.impuesto);
          }
        }, [show, id])
        
        useEffect(() => {
          if (dataxID && id !== 0) {
            reset({
              ...dataxID
            });
          }else if (id === 0) {
            reset(initialStateImpuesto.impuesto);
          }
        }, [dataxID, id]);
    const onSubmit = (data: ImpuestosProps)=>{
        const { id, ...val } = data;
        if (id!==0) {
        patch({...val, codigo: 'A', porcentaje: Number(val.porcentaje), monto: Number(val.monto)} as ImpuestosProps, id, '')
        }else{
        post({...val, codigo: 'A', porcentaje: Number(val.porcentaje), monto: Number(val.monto)} as ImpuestosProps)
        }
        onCancelar()
    }
    const onCancelar = ()=>{
        onHide()
        reset(initialStateImpuesto.impuesto)
    }
  return (
    <ModalCR onHide={onHide} show={show}>
        <ModalCR.Header>
            <ModalCR.Title>Agregar impuestos {id} </ModalCR.Title>
        </ModalCR.Header>
        <ModalCR.Body>
            <form onSubmit={handleSubmit(onSubmit)}>
                <InputCR {...register("nombre", {
                    required: "Este campo es obligatorio"
                  })} label='Nombre del impuesto' name='nombre' type='normal' />
                <InputSelectCR {...register("id_tipo", {
                    required: "Este campo es obligatorio"
                  })} label='Tipo' name='id_tipo' options={dataTipoMonto} messageErrors={formState.errors.id_tipo?.message}/>
                  {getValues("id_tipo")===1012 ? (
                      <InputCR {...register("porcentaje", {
                    required: "Este campo es obligatorio"
                  })} label='Porcentaje' name='porcentaje' type='normal'/>
                  ): (
                      <InputCR {...register("monto", {
                    required: "Este campo es obligatorio"
                  })} label='Monto' name='monto' type='normal'/>
                  )}
                <InputSelectCR {...register("id_aplica_sobre", {
                    required: "Este campo es obligatorio"
                  })} label='Aplica Sobre' name='id_aplica_sobre' options={dataAplicarSobre} messageErrors={formState.errors.id_aplica_sobre?.message}/>
                <InputSelectCR {...register("id_base_calculo", {
                    required: "Este campo es obligatorio"
                  })} label='Base de Cálculo' name='id_base_calculo' options={dataBaseCalculo} messageErrors={formState.errors.id_base_calculo?.message}/>
                <InputCR {...register("descripcion", {
                    required: "Este campo es obligatorio"
                  })} label='Descripción' name='descripcion' type='text-area' />
                <ButtonCR label='Guardar' type='submit' />
            </form>
        </ModalCR.Body>
    </ModalCR>
  )
}
