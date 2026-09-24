import React, { useEffect } from 'react'
import ModalCR from '@/components/Modal/ModalCR'
import type { propsInitialsModal } from '@/components/Modal/useModalStore';
import { InputCR } from '@/components/TextFields/InputCR';
import { InputSelectCR } from '@/components/TextFields/InputSelectCR';
import { useTerminologiaPersona } from '@/hook/usePropiedadesStore';
import { useForm } from '@/hook/useForm';
import { Col, Row } from 'react-bootstrap';
import { ButtonCR } from '@/components/Button/ButtonCR';
import { useContratoColaboradorStore } from '@/pages/PerfilCliente/useContratoColaboradorStore';
import { initialContratoColaborador, type ContratoColaboradorProps } from '@/pages/PerfilCliente/store/contratoColaboradorSlice';
export const ModalCustomContratoEmpleado = ({id, show, onHide}:propsInitialsModal) => {
      const { data:dataCargosEmpleado, cargar:cargarCargosEmpleado } = useTerminologiaPersona('cargosEmpleado');
      const { data:dataDepartamentoEmpleado, cargar:cargarDepartamentoEmpleado } = useTerminologiaPersona('departamentosEmpleado');
      const { data:dataEstadosContratoColaborador, cargar:cargarEstadosContratoColaborador } = useTerminologiaPersona('estadosContratoEmpleado');
      const { data:dataCodigosOficialesDeMonedas, cargar:cargarCodigosOficialesDeMonedas } = useTerminologiaPersona('codigoOficialMoneda');
      const { data:dataFrecuenciaPagoPlanilla, cargar:cargarFrecuenciaPagoPlanilla } = useTerminologiaPersona('frecuenciaPagoPlanilla');
      const { data:dataTipoContratoPlanilla, cargar:cargarTipoContratoPlanilla } = useTerminologiaPersona('tipoContratoPlanilla');
      const { postContratoxIDColaborador } = useContratoColaboradorStore()
      const { register, formState: { errors }, getValues, reset, handleSubmit, watch, setValue  } = useForm<ContratoColaboradorProps>({defaultValues: initialContratoColaborador, mode: 'all'})
      const idEstado = watch('id_estado')
      const tieneFechaFin = Number(idEstado) === 6075
      const fechaFinRegister = register("fecha_fin", {
        required: tieneFechaFin ? "Este campo es obligatorio" : false
      })
    useEffect(() => {
      if(show){
        cargarCargosEmpleado()
        cargarDepartamentoEmpleado()
        cargarEstadosContratoColaborador()
        cargarCodigosOficialesDeMonedas()
        cargarFrecuenciaPagoPlanilla()
        cargarTipoContratoPlanilla()
      }
    }, [show])
    useEffect(() => {
      if(!tieneFechaFin){
        setValue('fecha_fin', '')
      }
    }, [tieneFechaFin])
    const postContratoEmpleado = ()=>{
      const { id:iddd, ...val } = getValues()
      console.log({iddd, val});
      postContratoxIDColaborador(id, val as ContratoColaboradorProps)
      // onCancel()
    }
    const onCancel = ()=>{
      onHide()
      reset()
    }
  return (
    <ModalCR show={show} onHide={onHide}>
        <ModalCR.Header>
            <span className='fw-bold' style={{fontSize: '16px'}}>
                Agregar Contrato
            </span>
        </ModalCR.Header>
        <ModalCR.Body>
            <form onSubmit={handleSubmit(postContratoEmpleado)}>
              <Row>
                <Col lg={6}>
                <InputSelectCR {...register("id_departamento", {
                    required: "Este campo es obligatorio"
                  })} label='Departamento' options={dataDepartamentoEmpleado} messageErrors={errors.id_departamento?.message}/>
                </Col>
                <Col lg={6}>
                  <InputSelectCR {...register("id_cargo", {
                      required: "Este campo es obligatorio"
                    })} label='Cargo' options={dataCargosEmpleado} messageErrors={errors.id_cargo?.message}/>
                </Col>
                <Col lg={12}>
                  {/* INDEFINIDO, CON FECHA LIMITE */}
                <InputSelectCR {...register("id_estado", {
                    required: "Este campo es obligatorio"
                  })} label='Estado' options={dataEstadosContratoColaborador} messageErrors={errors.id_estado?.message}/>
                </Col>
                <Col lg={12}>
                  <InputSelectCR {...register("id_tipo_contrato", {
                      required: "Este campo es obligatorio"
                    })} label='Tipo de contrato' options={dataTipoContratoPlanilla} messageErrors={errors.id_tipo_contrato?.message}/>
                </Col>
                <Col lg={12}>
                  <InputSelectCR {...register("id_frecuencia_pago", {
                      required: "Este campo es obligatorio"
                    })} label='Frecuencia de pago' options={dataFrecuenciaPagoPlanilla} messageErrors={errors.id_frecuencia_pago?.message}/>
                </Col>
                <Col lg={12}>
                  <InputCR {...register("fecha_primer_sueldo", {
                      required: "Este campo es obligatorio"
                    })} label='Fecha del primer sueldo' type='date' messageErrors={errors.fecha_primer_sueldo?.message}/>
                </Col>
                <Col lg={tieneFechaFin ? 6 : 12}>
                  <InputCR {...register("fecha_inicio", {
                      required: "Este campo es obligatorio"
                    })} label='Fecha de inicio' type='date' messageErrors={errors.fecha_inicio?.message}/>
                </Col>
                {tieneFechaFin && (
                  <Col lg={6}>
                    <InputCR {...fechaFinRegister} label='Fecha de fin' type='date' messageErrors={errors.fecha_fin?.message}/>
                  </Col>
                )}
                <Col lg={6}>
                  <InputSelectCR {...register("id_moneda", {
                      required: "Este campo es obligatorio"
                    })} label='Moneda' options={dataCodigosOficialesDeMonedas} messageErrors={errors.id_moneda?.message}/>
                </Col>
                <Col lg={6}>
                  <InputCR {...register("sueldo", {
                      required: "Este campo es obligatorio"
                    })} label='Sueldo' type='normal' messageErrors={errors.sueldo?.message}/>
                </Col>
                <Col>
                </Col>
              </Row>
            <Row>
                <Col lg={6}>
                  <ButtonCR style={{width: '100%'}} className='w-100' label={'Agregar'} type='submit'/>
                </Col>
                <Col lg={6}>
                  <ButtonCR style={{width: '100%'}} variant='danger' className='w-100 bg-danger' label={'Eliminar'} onClick={()=>onCancel}/>
                </Col>
            </Row>
            </form>
        </ModalCR.Body>
    </ModalCR>
  )
}
