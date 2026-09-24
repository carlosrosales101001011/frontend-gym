import { Col, Row } from 'react-bootstrap'
import ModalCR from '@/components/Modal/ModalCR'
import { useForm } from '@/hook/useForm'
import type { modalCustom } from '@/types/props'
import { initialStateCuentaFinanciera, type CuentaFinancieraProps } from '@/pages/GestionCuentasFinanciera/store/cuentasFinancieraSlice'
import { useCuentasFinancieraStore } from '@/pages/GestionCuentasFinanciera/useCuentasFinancieraStore'
import { InputSelectCR } from '@/components/TextFields/InputSelectCR'
import { useTerminologiaPersona } from '@/hook/usePropiedadesStore'
import { useEffect } from 'react'
import { InputCR } from '@/components/TextFields/InputCR'
import { ButtonCR } from '@/components/Button/ButtonCR'
import { removeNull } from '@/helpers/removeNull'

export const ModalCustomCuentasFinanciera = ({onHide, show, id}:modalCustom) => {
    const { post, obtenerxID, dataxID, patch } = useCuentasFinancieraStore()
    const { data: dataBancos, cargar:cargarBancos } = useTerminologiaPersona('bancos')
    const { data: dataMonedas, cargar:cargarMonedas } = useTerminologiaPersona('codigoOficialMoneda')
    const { data: dataTipoCuentas, cargar:cargarTipoCuentas } = useTerminologiaPersona('tipoCuentaBancaria')
    const { data: dataEstadosEntidad, cargar:cargarEstadosEntidad } = useTerminologiaPersona('estadosEntidad')
    const { formState: {errors}, register, handleSubmit, reset } = useForm({mode: 'onSubmit', defaultValues: initialStateCuentaFinanciera.cuentaFinanciera})
    useEffect(()=>{
      if (show) {
        cargarBancos()
        cargarMonedas()
        cargarTipoCuentas()
        cargarEstadosEntidad()
      }
    },[show])
    
    useEffect(() => {
      if (id!==0 && show) {
        obtenerxID(id)
      }else{
        reset(initialStateCuentaFinanciera.cuentaFinanciera);
      }
    }, [show, id])
    
    useEffect(() => {
      if (dataxID && id !== 0) {
        reset({
          ...dataxID
        });
      }else if (id === 0) {
        reset(initialStateCuentaFinanciera.cuentaFinanciera);
      }
    }, [dataxID, id]);
    
    const onSubmit = (data:CuentaFinancieraProps)=>{
      const { id, ...val } = removeNull(data);
      if (id!==0) {
        patch({...val, saldo_inicial: Number(val.saldo_inicial ?? 0 )}, id, '')
      }else{
        post({...val, saldo_inicial: Number(val.saldo_inicial ?? 0 )} )
      }
      onCancelar()
    }
    const onCancelar = ()=>{
      onHide()
      reset(initialStateCuentaFinanciera.cuentaFinanciera)
    }
  return (
    <ModalCR onHide={onHide} show={show}>
        <ModalCR.Header>
            <ModalCR.Title>
                {id==0 ? 'Agregar cuenta financiera' : 'Editar cuenta financiera'}
            </ModalCR.Title>
        </ModalCR.Header>
        <ModalCR.Body>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                  <Col lg={6}>
                  <InputSelectCR  options={dataBancos} {...register("id_banco", {
                    required: "Este campo es obligatorio"
                  })} label="Banco" name="id_banco" messageErrors={errors.id_banco?.message}/>
                  </Col>
                  <Col lg={6}>
                    <InputSelectCR  options={dataTipoCuentas} {...register("id_tipo_cuenta", {
                      required: "El tipo de cuenta es obligatorio"
                    })} label="Tipo de Cuenta" name="id_tipo_cuenta" messageErrors={errors.id_tipo_cuenta?.message}/>
                  </Col>
                  <Col lg={12}>
                    <InputCR {...register("n_cuenta", {
                      required: "El número de cuenta es obligatorio"
                    })} label="Número de Cuenta" name="n_cuenta" messageErrors={errors.n_cuenta?.message}/>
                  </Col>
                  <Col lg={12}>
                    <InputCR {...register("cci", {
                      required: "El CCI es obligatorio"
                    })} label="CCI" name="cci" messageErrors={errors.cci?.message}/>
                  </Col>
                  <Col lg={12}>
                    <InputCR {...register("titular", {
                      required: "El titular es obligatorio"
                    })} label="Titular" name="titular" messageErrors={errors.titular?.message}/>
                  </Col>
                  <Col lg={6}>
                    <InputSelectCR  options={dataMonedas} {...register("id_codigo_moneda", {
                      required: "El código de moneda es obligatorio"
                    })} label="Moneda" name="id_codigo_moneda" messageErrors={errors.id_codigo_moneda?.message}/>
                  </Col>
                  <Col lg={6}>
                    <InputCR {...register("saldo_inicial", {
                      required: "El saldo inicial es obligatorio"
                    })} label="Saldo Inicial" name="saldo_inicial" messageErrors={errors.saldo_inicial?.message}/>
                  </Col>
                  <Col lg={6}>
                    <InputSelectCR  options={dataEstadosEntidad} {...register("estado", {
                      required: "El estado de la entidad es obligatorio"
                    })} label="Estado" name="estado" messageErrors={errors.estado?.message}/>
                  </Col>
                  <Col lg={12}>
                    <InputCR {...register("descripcion", {
                      required: "La descripción es obligatoria"
                    })} label="Descripción" name="descripcion" type='text-area' messageErrors={errors.descripcion?.message}/>
                  </Col>
                  <div>
                    <ButtonCR label="Guardar" type='submit'/>
                    <ButtonCR label="Cancelar" onClick={onCancelar} variant='link'/>
                  </div>
                </Row>
            </form>
        </ModalCR.Body>
    </ModalCR>
  )
}
