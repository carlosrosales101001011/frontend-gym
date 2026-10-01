
import { InputCR } from '@/components/TextFields/InputCR'
import { Col, Row } from 'react-bootstrap'
import { useForm } from '@/hook/useForm'
import { InputSelectCR } from '@/components/TextFields/InputSelectCR'
import type { ColaboradorProps } from '@/pages/PerfilCliente/store/perfilColaboradorSlice'
import { useEffect } from 'react'
import { usePerfilColaboradorStore } from '@/pages/PerfilCliente/usePerfilColaboradorStore'
import { useSelector } from 'react-redux'
import type { RootState } from '@/stores/Store';
import { useParams } from 'react-router-dom';
import { ButtonCR } from '@/components/Button/ButtonCR'
import { useTerminologiaPersona } from '@/hook/usePropiedadesStore'
type TabDatosPersonalesProps = {
  /** Si el tab está a la vista: cada vez que se activa se vuelven a pedir los datos (por defecto siempre) */
  activo?: boolean
}
export const TabDatosPersonales = ({ activo = true }: TabDatosPersonalesProps) => {
  // El perfil de cliente usa :uid_person; se mantiene :uid_cliente por la pantalla anterior de PerfilCliente
  const { uid_person, uid_cliente } = useParams<{ uid_person: string, uid_cliente: string }>();
  const uid = uid_person ?? uid_cliente ?? '';
  const { obtenerDataColaboradorxUID, loading, actualizarDatosPersonales } = usePerfilColaboradorStore()
  const {colaborador} = useSelector((state: RootState)=>state.PERFIL_COLABORADOR)
  const { register, formState: { errors }, reset, getValues} = useForm<ColaboradorProps>({mode: "all",defaultValues: colaborador })
  const { data:dataGeneroPersona, cargar:cargarGeneroPersona } = useTerminologiaPersona('GeneroPersona');
  const { data:dataEstadoCivilPersona, cargar:cargarEstadoCivilPersona } = useTerminologiaPersona('EstadoCivilPersona');
  const { data:dataTipoDeDocumentoPersona, cargar:cargarTipoDeDocumentoPersona } = useTerminologiaPersona('TipoDeDocumentoPersona');
  useEffect(() => {
    if (!activo || !uid) return
    obtenerDataColaboradorxUID(uid)
    cargarGeneroPersona()
    cargarEstadoCivilPersona()
    cargarTipoDeDocumentoPersona()
  }, [activo, uid])
  useEffect(() => {
    if (colaborador) {
      reset(colaborador);
    }
  }, [colaborador]);
  if (loading)return( <>LOADING</>)
  // El hook envía solo los campos del formulario y recarga con el uid de la URL
  const onSubmitActualizar = ()=>{
    actualizarDatosPersonales(colaborador.id, uid, getValues() as Partial<ColaboradorProps>)
  }
    return (
    <div>
        <form>
              <Row>
                <Col lg={4}>
                  <InputCR {...register("nombres", {
                    required: "Este campo es obligatorio"
                  })} label="Nombres" messageErrors={errors.nombres?.message}/>
                </Col>
                <Col lg={4}>
                  <InputCR {...register("apellido_paterno", {
                    required: "Este campo es obligatorio"
                  })} label="Apellido paterno" messageErrors={errors.apellido_paterno?.message}/>
                </Col>
                <Col lg={4}>
                  <InputCR {...register("apellido_materno", {
                    required: "Este campo es obligatorio"
                  })} label="Apellido materno" messageErrors={errors.apellido_materno?.message}/>
                </Col>
                <Col lg={6}>
                  <InputCR {...register("fecha_nacimiento", {
                    required: "Este campo es obligatorio"
                  })} label="Fecha de nacimiento"  type='date' messageErrors={errors.fecha_nacimiento?.message}/>
                </Col>
                <Col lg={6}>
                  <InputCR {...register("telefono", {
                    required: "Este campo es obligatorio"
                  })} label="Telefono" messageErrors={errors.telefono?.message}/>
                </Col>
                <Col lg={6}>
                  <InputSelectCR {...register("id_genero", {
                    required: "Este campo es obligatorio"
                  })} label="Genero" options={dataGeneroPersona} messageErrors={errors.id_genero?.message}/>
                </Col>
                <Col lg={6}>
                  <InputSelectCR {...register("id_estado_civil", {
                    required: "Este campo es obligatorio"
                  })} label="Estado civil" options={dataEstadoCivilPersona} messageErrors={errors.id_estado_civil?.message}/>
                </Col>
                <Col lg={6}>
                  <InputSelectCR {...register("id_tipo_documento", {
                    required: "Este campo es obligatorio"
                  })} label="Tipo documento" options={dataTipoDeDocumentoPersona} messageErrors={errors.id_tipo_documento?.message}/>
                </Col>
                <Col lg={6}>
                  <InputCR {...register("numero_documento", {
                    required: "Este campo es obligatorio"
                  })} label="N° de documento" messageErrors={errors.numero_documento?.message}/>
                </Col>
                <Col lg={6}>
                  <InputSelectCR {...register("id_nacionalidad", {
                    required: "Este campo es obligatorio"
                  })} label="Nacionalidad" options={dataTipoDeDocumentoPersona} messageErrors={errors.id_nacionalidad?.message}/>
                </Col>
                <Col lg={6}>
                  <InputSelectCR {...register("id_distrito", {
                    required: "Este campo es obligatorio"
                  })} label="Distrito" options={dataTipoDeDocumentoPersona} messageErrors={errors.id_distrito?.message}/>
                </Col>
                <Col lg={12}>
                  <InputCR {...register("direccion", {
                    required: "Este campo es obligatorio"
                  })} label="Direccion" messageErrors={errors.direccion?.message}/>
                </Col>
                <Col lg={12}>
                  <InputCR {...register("email_personal", {
                    required: "Este campo es obligatorio",
                  })} label="Email personal" messageErrors={errors.email_personal?.message}/>
                </Col>
                <Col lg={12}>
                  <InputCR {...register("email_corporativo", {
                    required: "Este campo es obligatorio",
                  })} label="Email corporativo" messageErrors={errors.email_corporativo?.message}/>
                </Col>
              </Row>
                  <ButtonCR onClick={onSubmitActualizar} style={{width: '100%'}} className='w-100 btn-primary' label={'Actualizar'}/>
        </form>
    </div>
  )
}
