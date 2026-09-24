import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Col, Row } from 'react-bootstrap'
import ModalCR from '@/components/Modal/ModalCR'
import { InputCR } from '@/components/TextFields/InputCR'
import { InputSelectCR } from '@/components/TextFields/InputSelectCR'
import { ButtonCR } from '@/components/Button/ButtonCR'
import { useForm } from '@/hook/useForm'
import { useTerminologiaPersona } from '@/hook/usePropiedadesStore'
import { useContratoColaboradorStore } from '@/pages/PerfilColaborador/useContratoColaboradorStore'
import { initialContratoColaborador, type ContratoColaboradorProps } from '@/pages/PerfilColaborador/store/contratoColaboradorSlice'
import { removeNull } from '@/helpers/removeNull'
import type { RootState } from '@/stores/Store'

type Props = {
  id: number
  uid_empleado: string
  show: boolean
  onHide: () => void
}

export const ModalCustomContratoEmpleado = ({ id, uid_empleado, show, onHide }: Props) => {
  const { colaborador } = useSelector((state: RootState) => state.PERFIL_COLABORADOR)
  const { data: dataCargosEmpleado, cargar: cargarCargosEmpleado } = useTerminologiaPersona('cargosEmpleado')
  const { data: dataDepartamentoEmpleado, cargar: cargarDepartamentoEmpleado } = useTerminologiaPersona('departamentosEmpleado')
  const { data: dataEstadosContratoColaborador, cargar: cargarEstadosContratoColaborador } = useTerminologiaPersona('estadosContratoEmpleado')
  const { data: dataCodigosOficialesDeMonedas, cargar: cargarCodigosOficialesDeMonedas } = useTerminologiaPersona('codigoOficialMoneda')
  const { data: dataFrecuenciaPagoPlanilla, cargar: cargarFrecuenciaPagoPlanilla } = useTerminologiaPersona('frecuenciaPagoPlanilla')
  const { data: dataTipoContratoPlanilla, cargar: cargarTipoContratoPlanilla } = useTerminologiaPersona('tipoContratoPlanilla')
  const { post, patch, dataxID, obtenerxID } = useContratoColaboradorStore(uid_empleado)

  const { register, formState: { errors }, reset, handleSubmit, watch, setValue } = useForm<ContratoColaboradorProps>({ defaultValues: initialContratoColaborador, mode: 'all' })
  const idEstado = watch('id_estado')
  const tieneFechaFin = Number(idEstado) === 6075
  const fechaFinRegister = register('fecha_fin', {
    required: tieneFechaFin ? 'Este campo es obligatorio' : false
  })

  useEffect(() => {
    if (show) {
      cargarCargosEmpleado()
      cargarDepartamentoEmpleado()
      cargarEstadosContratoColaborador()
      cargarCodigosOficialesDeMonedas()
      cargarFrecuenciaPagoPlanilla()
      cargarTipoContratoPlanilla()
    }
  }, [show])

  useEffect(() => {
    if (id !== 0 && show) {
      obtenerxID(id)
    } else {
      reset({ ...initialContratoColaborador, id_empl: colaborador.id })
    }
  }, [show, id])

  useEffect(() => {
    if (dataxID && id !== 0) {
      reset({ ...dataxID })
    } else if (id === 0) {
      reset({ ...initialContratoColaborador, id_empl: colaborador.id })
    }
  }, [dataxID, id])

  useEffect(() => {
    if (!tieneFechaFin) {
      setValue('fecha_fin', '')
    }
  }, [tieneFechaFin])

  const onSubmit = (data: ContratoColaboradorProps) => {
    const clean = removeNull(data)
    const payload = {
      id_empl: clean.id_empl,
      id_departamento: clean.id_departamento,
      id_cargo: clean.id_cargo,
      id_estado: clean.id_estado,
      id_tipo_contrato: clean.id_tipo_contrato,
      id_frecuencia_pago: clean.id_frecuencia_pago,
      fecha_primer_sueldo: clean.fecha_primer_sueldo,
      fecha_inicio: clean.fecha_inicio,
      ...(tieneFechaFin ? { fecha_fin: clean.fecha_fin } : {}),
      id_moneda: clean.id_moneda,
      sueldo: Number(clean.sueldo),
    }

    if (id !== 0) {
      patch(payload, id)
    } else {
      post(payload)
    }
    onCancelar()
  }

  const onCancelar = () => {
    onHide()
    reset({ ...initialContratoColaborador, id_empl: colaborador.id })
  }

  return (
    <ModalCR show={show} onHide={onCancelar}>
      <ModalCR.Header>
        <span className='fw-bold' style={{ fontSize: '16px' }}>
          {id !== 0 ? 'Editar contrato' : 'Agregar contrato'}
        </span>
      </ModalCR.Header>
      <ModalCR.Body>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col lg={6}>
              <InputSelectCR {...register('id_departamento', {
                required: 'Este campo es obligatorio'
              })} label='Departamento' options={dataDepartamentoEmpleado} messageErrors={errors.id_departamento?.message} />
            </Col>
            <Col lg={6}>
              <InputSelectCR {...register('id_cargo', {
                required: 'Este campo es obligatorio'
              })} label='Cargo' options={dataCargosEmpleado} messageErrors={errors.id_cargo?.message} />
            </Col>
            <Col lg={12}>
              {/* INDEFINIDO, CON FECHA LIMITE */}
              <InputSelectCR {...register('id_estado', {
                required: 'Este campo es obligatorio'
              })} label='Estado' options={dataEstadosContratoColaborador} messageErrors={errors.id_estado?.message} />
            </Col>
            <Col lg={12}>
              <InputSelectCR {...register('id_tipo_contrato', {
                required: 'Este campo es obligatorio'
              })} label='Tipo de contrato' options={dataTipoContratoPlanilla} messageErrors={errors.id_tipo_contrato?.message} />
            </Col>
            <Col lg={12}>
              <InputSelectCR {...register('id_frecuencia_pago', {
                required: 'Este campo es obligatorio'
              })} label='Frecuencia de pago' options={dataFrecuenciaPagoPlanilla} messageErrors={errors.id_frecuencia_pago?.message} />
            </Col>
            <Col lg={12}>
              <InputCR {...register('fecha_primer_sueldo', {
                required: 'Este campo es obligatorio'
              })} label='Fecha del primer sueldo' type='date' messageErrors={errors.fecha_primer_sueldo?.message} />
            </Col>
            <Col lg={tieneFechaFin ? 6 : 12}>
              <InputCR {...register('fecha_inicio', {
                required: 'Este campo es obligatorio'
              })} label='Fecha de inicio' type='date' messageErrors={errors.fecha_inicio?.message} />
            </Col>
            {tieneFechaFin && (
              <Col lg={6}>
                <InputCR {...fechaFinRegister} label='Fecha de fin' type='date' messageErrors={errors.fecha_fin?.message} />
              </Col>
            )}
            <Col lg={6}>
              <InputSelectCR {...register('id_moneda', {
                required: 'Este campo es obligatorio'
              })} label='Moneda' options={dataCodigosOficialesDeMonedas} messageErrors={errors.id_moneda?.message} />
            </Col>
            <Col lg={6}>
              <InputCR {...register('sueldo', {
                required: 'Este campo es obligatorio'
              })} label='Sueldo' type='normal' messageErrors={errors.sueldo?.message} />
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <ButtonCR style={{ width: '100%' }} className='w-100' label={'Guardar'} type='submit' />
            </Col>
            <Col lg={6}>
              <ButtonCR style={{ width: '100%' }} variant='danger' className='w-100 bg-danger' label={'Cancelar'} onClick={onCancelar} />
            </Col>
          </Row>
        </form>
      </ModalCR.Body>
    </ModalCR>
  )
}
