import { InputCR } from '@/components/TextFields/InputCR'
import { Col, Row } from 'react-bootstrap'
import { useForm } from '@/hook/useForm'
import { InputSelectCR } from '@/components/TextFields/InputSelectCR'
import type { ColaboradorProps } from '@/pages/PerfilColaborador/store/perfilColaboradorSlice'
import { useEffect } from 'react'
import { usePerfilColaboradorStore } from '@/pages/PerfilColaborador/usePerfilColaboradorStore'
import { useSelector } from 'react-redux'
import type { RootState } from '@/stores/Store';
import { useParams } from 'react-router-dom';
import { ButtonCR } from '@/components/Button/ButtonCR'
import { useTerminologiaPersona } from '@/hook/usePropiedadesStore'
/** Estado del colaborador (persona.id_estado): 1 activo, 0 inactivo */
const OPCIONES_ESTADO = [
  { value: 1, label: 'Activo' },
  { value: 0, label: 'Inactivo' },
]
type TabDatosPersonalesProps = {
  /** Si el tab está a la vista: cada vez que se activa se vuelven a pedir los datos */
  activo: boolean
}
/** Datos personales del colaborador (mismo formulario que el perfil del cliente) */
export const TabDatosPersonales = ({ activo }: TabDatosPersonalesProps) => {
  const { uid_colaborador = '' } = useParams<{ uid_colaborador: string }>();
  const { obtenerDataColaboradorxUID, loading, actualizarDatosPersonales } = usePerfilColaboradorStore()
  const {colaborador} = useSelector((state: RootState)=>state.PERFIL_COLABORADOR)
  const { register, formState: { errors }, reset, getValues} = useForm<ColaboradorProps>({mode: "all",defaultValues: colaborador })
  const { data:dataGeneroPersona, cargar:cargarGeneroPersona } = useTerminologiaPersona('GeneroPersona');
  const { data:dataDistritoCallao, cargar:cargarDistritoCallao } = useTerminologiaPersona('distritosCallao');
  const { data:dataDistritoLima, cargar:cargarDistritoLima } = useTerminologiaPersona('distritosLima');
  const { data:dataEstadoCivilPersona, cargar:cargarEstadoCivilPersona } = useTerminologiaPersona('EstadoCivilPersona');
  const { data:dataTipoDeDocumentoPersona, cargar:cargarTipoDeDocumentoPersona } = useTerminologiaPersona('TipoDeDocumentoPersona');
  useEffect(() => {
    if (!activo || !uid_colaborador) return
    obtenerDataColaboradorxUID(uid_colaborador)
    cargarGeneroPersona()
    cargarEstadoCivilPersona()
    cargarTipoDeDocumentoPersona()
    cargarDistritoCallao()
    cargarDistritoLima()
  }, [activo, uid_colaborador])
  useEffect(() => {
    if (colaborador) {
      reset(colaborador);
    }
  }, [colaborador]);
  if (!activo) return null
  if (loading)return( <>LOADING</>)
  // El hook envía solo los campos del formulario y recarga con el uid de la URL
  const onSubmitActualizar = ()=>{
    actualizarDatosPersonales(colaborador.id, uid_colaborador, getValues() as Partial<ColaboradorProps>)
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
                  <InputSelectCR {...register("id_distrito", {
                    required: "Este campo es obligatorio"
                  })} label="Distrito" options={[...dataDistritoCallao, ...dataDistritoLima]} messageErrors={errors.id_distrito?.message}/>
                </Col>
                <Col lg={6}>
                  <InputCR {...register("direccion", {
                    required: "Este campo es obligatorio"
                  })} label="Direccion" messageErrors={errors.direccion?.message}/>
                </Col>
                <Col lg={6}>
                  <InputCR {...register("email_personal", {
                    required: "Este campo es obligatorio",
                  })} label="Email personal" messageErrors={errors.email_personal?.message}/>
                </Col>
                <Col lg={6}>
                  <InputCR {...register("email_corporativo", {
                    required: "Este campo es obligatorio",
                  })} label="Email corporativo" messageErrors={errors.email_corporativo?.message}/>
                </Col>
                <Col lg={6}>
                  <InputSelectCR {...register("id_estado")} label="Estado" options={OPCIONES_ESTADO}/>
                </Col>
              </Row>
                  <ButtonCR onClick={onSubmitActualizar} style={{width: '100%'}} className='w-100 btn-primary' label={'Actualizar'}/>
        </form>
    </div>
  )
}
