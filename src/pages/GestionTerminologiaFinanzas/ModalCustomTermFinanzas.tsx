import { useEffect } from 'react'
import ModalCR from '@/components/Modal/ModalCR'
import { useTermFinanzasStore } from '@/pages/GestionTerminologiaFinanzas/useTermFinanzasStore'
import { useForm } from '@/hook/useForm'
import { initialStateTermFinanza, type TermFinanzasProps } from '@/pages/GestionTerminologiaFinanzas/store/TermFinanzasSlice'
import { InputSelectCR } from '@/components/TextFields/InputSelectCR'
import { InputCR } from '@/components/TextFields/InputCR'
import { Col, Row } from 'react-bootstrap'
import { ButtonCR } from '@/components/Button/ButtonCR'
import { useAppSelector, type RootState } from '@/stores/Store'
import InputSwitchCR from '@/components/TextFields/InputSwitchCR'

export const ModalCustomTermFinanzas = ({ show, onHide, id = 0, parentId = 0 }: { show: boolean, onHide: () => void, id?: number, parentId?: number }) => {
  const { dataxID, obtenerxID, patch, postTermFinanzas, obtenerOpGruposFinanzas } = useTermFinanzasStore()
  const { register, formState: { errors }, getValues, reset} = useForm<TermFinanzasProps>({mode: "onChange",defaultValues: initialStateTermFinanza.termFinanza})
  const val = useAppSelector((state:RootState)=>state.TERM_FINANZA.opcionesGruposFinanzas)
  
  useEffect(() => {
    obtenerOpGruposFinanzas()
  }, [])
  useEffect(() => {
    if (id!==0 && show) {
      obtenerxID(id)
    }else{
      reset(initialStateTermFinanza.termFinanza);
    }
  }, [show, id])
  
  useEffect(() => {
    if (dataxID && id !== 0) {
      reset({
        ...dataxID
      });
    }else if (id === 0) {
      reset(initialStateTermFinanza.termFinanza);
    }
  }, [dataxID, id]);
  const onSubmit = () => {
    const { id:idu, ...val } = getValues()
    console.log({idu, val});
    if (id!==0) {
      patch({...val, 
        monto_proyectado: val.monto_proyectado ? Number(val.monto_proyectado) : 0, 
        fecha_fin: val.is_limit ? val.fecha_fin : new Date().toISOString()} as TermFinanzasProps, id, '')
    }else{
      postTermFinanzas({...val, 
        monto_proyectado: val.monto_proyectado ? Number(val.monto_proyectado) : 0, 
        fecha_fin: val.is_limit ? val.fecha_fin : new Date().toISOString(),
        parentId: parentId} as TermFinanzasProps)
    }
    cancelar()
  }
  const cancelar = ()=>{
    onHide()
  }
  return (
    <ModalCR onHide={onHide} show={show} position='center' size='md'>
        <ModalCR.Header>
            <ModalCR.Title>{id==0 ? 'Agregar terminologia' : 'Editar terminologia'}</ModalCR.Title>
        </ModalCR.Header>
        <ModalCR.Body>
            <div>
              <form>
                <Row>
                  <Col lg={12}>
                  <InputSelectCR options={val}  {...register("id_grupo", {
                    required: "Este campo es obligatorio"
                  })} label="Grupo" name="id_grupo" messageErrors={errors.id_grupo?.message}/>
                  </Col>
                  <Col lg={6}>
                  <InputSelectCR options={[{value: 1, label: 'Variable'}, {value: 2, label: 'Fijo'}]}  {...register("id_tipo", {
                    required: "Este campo es obligatorio"
                  })} label="Tipo" name="id_tipo" messageErrors={errors.id_tipo?.message}/>
                  </Col>
                  <Col lg={6}>
                    <InputCR {...register("concepto", {
                      required: "El concepto es obligatorio"
                    })} label="Concepto" name="concepto" messageErrors={errors.concepto?.message}/>
                  </Col>
                  <Col lg={12}>
                    <InputCR {...register("fecha_inicio", {
                      required: "La fecha de inicio es obligatoria"
                    })} label="Fecha de Inicio" name="fecha_inicio" type='date' messageErrors={errors.fecha_inicio?.message}/>
                  </Col>
                  <Col lg={12}>
                      <InputSwitchCR
                        {...register("is_limit")}
                        label={`${getValues('is_limit')? 'Con límite' : 'Sin límite'}`}
                        name="is_limit"
                        messageErrors={errors.is_limit?.message}
                      />
                  </Col>
                  {
                    getValues('is_limit') && (
                      <Col lg={12}>
                        <InputCR {...register("fecha_fin", {
                          required: "La fecha de fin es obligatoria"
                        })} label="Fecha de Fin" name="fecha_fin" type='date' messageErrors={errors.fecha_fin?.message}/>
                      </Col>
                    )
                  }
                  <Col lg={12}>
                      <InputSwitchCR
                        {...register("is_promediado")}
                        label={`${getValues('is_promediado')? 'Promediado' : 'No promediado'}`}
                        name="is_promediado"
                        messageErrors={errors.is_promediado?.message}
                      />
                  </Col>
                  {
                    !getValues('is_promediado') && (
                      <Col lg={12}>
                        <InputCR {...register("monto_proyectado", {
                          required: "El monto proyectado es obligatorio",
                        })} label="Monto Proyectado" name="monto_proyectado" messageErrors={errors.monto_proyectado?.message}/>
                      </Col>
                    )
                  }
                </Row>
              </form>
            </div>
        </ModalCR.Body>
        <ModalCR.Footer>
            <ButtonCR label={'Guardar Gasto'} onClick={onSubmit}/>
            <ButtonCR label={'Cerrar'} onClick={cancelar}/>
        </ModalCR.Footer>
    </ModalCR>
  )
}
