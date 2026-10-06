import { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { InputCR } from '@/components/TextFields/InputCR'
import { InputSelectCR } from '@/components/TextFields/InputSelectCR'
import { ButtonCR } from '@/components/Button/ButtonCR'
import { useForm } from '@/hook/useForm'
import { useTerminologiaPersona } from '@/hook/usePropiedadesStore'
import { usePerfilUsuarioContexto } from '../hook/perfilUsuarioContexto'
import { usePerfilUsuario, type ColaboradorUsuarioProps } from '../hook/usePerfilUsuario'
import { SinColaborador } from './SinColaborador'

/**
 * Datos personales del colaborador vinculado al usuario. Solo los edita quien registró al usuario o un
 * super usuario; los demás los ven sin poder cambiarlos.
 */
export const TabDatosColaborador = () => {
  const { perfil } = usePerfilUsuarioContexto()
  const colaborador = perfil?.colaborador
  if (!colaborador) return <SinColaborador />
  // key: si cambia el colaborador vinculado, el formulario arranca con sus datos
  return <FormDatosColaborador key={colaborador.id} colaborador={colaborador} puedeEditar={!!perfil?.puedeEditar} />
}

type FormDatosColaboradorProps = {
  colaborador: ColaboradorUsuarioProps
  puedeEditar: boolean
}

const FormDatosColaborador = ({ colaborador, puedeEditar }: FormDatosColaboradorProps) => {
  const { recargar } = usePerfilUsuarioContexto()
  const { actualizarDatosColaborador } = usePerfilUsuario()
  const [guardando, setGuardando] = useState(false)
  const { register, formState: { errors }, handleSubmit } = useForm<ColaboradorUsuarioProps>({ mode: 'all', defaultValues: colaborador })
  const { data: dataGenero, cargar: cargarGenero } = useTerminologiaPersona('GeneroPersona')
  const { data: dataDistritoCallao, cargar: cargarDistritoCallao } = useTerminologiaPersona('distritosCallao')
  const { data: dataDistritoLima, cargar: cargarDistritoLima } = useTerminologiaPersona('distritosLima')
  const { data: dataEstadoCivil, cargar: cargarEstadoCivil } = useTerminologiaPersona('EstadoCivilPersona')
  const { data: dataTipoDocumento, cargar: cargarTipoDocumento } = useTerminologiaPersona('TipoDeDocumentoPersona')

  useEffect(() => {
    cargarGenero()
    cargarEstadoCivil()
    cargarTipoDocumento()
    cargarDistritoCallao()
    cargarDistritoLima()
  }, [])

  const onSubmit = async (datos: ColaboradorUsuarioProps) => {
    setGuardando(true)
    if (await actualizarDatosColaborador(colaborador.id, datos)) await recargar()
    setGuardando(false)
  }

  const requerido = { required: 'Este campo es obligatorio' }
  return (
    <form className="m-3" onSubmit={handleSubmit(onSubmit)}>
      {!puedeEditar && (
        <p className="small opacity-75">Solo quien registró a este usuario o un super usuario puede modificar estos datos.</p>
      )}
      {/* Sin permiso: todo se ve pero no se puede tocar (también los selects) */}
      <fieldset disabled={!puedeEditar} style={puedeEditar ? undefined : { pointerEvents: 'none' }}>
        <Row>
          <Col lg={4}><InputCR {...register('nombres', requerido)} label="Nombres" messageErrors={errors.nombres?.message as string} /></Col>
          <Col lg={4}><InputCR {...register('apellido_paterno', requerido)} label="Apellido paterno" messageErrors={errors.apellido_paterno?.message as string} /></Col>
          <Col lg={4}><InputCR {...register('apellido_materno')} label="Apellido materno" /></Col>
          <Col lg={6}><InputCR {...register('fecha_nacimiento')} label="Fecha de nacimiento" type="date" /></Col>
          <Col lg={6}><InputCR {...register('telefono')} label="Teléfono" /></Col>
          <Col lg={6}><InputSelectCR {...register('id_genero')} label="Género" options={dataGenero} /></Col>
          <Col lg={6}><InputSelectCR {...register('id_estado_civil')} label="Estado civil" options={dataEstadoCivil} /></Col>
          <Col lg={6}><InputSelectCR {...register('id_tipo_documento')} label="Tipo documento" options={dataTipoDocumento} /></Col>
          <Col lg={6}><InputCR {...register('numero_documento')} label="N° de documento" /></Col>
          <Col lg={6}><InputSelectCR {...register('id_distrito')} label="Distrito" options={[...dataDistritoCallao, ...dataDistritoLima]} /></Col>
          <Col lg={6}><InputCR {...register('direccion')} label="Dirección" /></Col>
          <Col lg={6}><InputCR {...register('email_personal')} label="Email personal" /></Col>
          <Col lg={6}><InputCR {...register('email_corporativo')} label="Email corporativo" /></Col>
        </Row>
      </fieldset>
      {puedeEditar && (
        <ButtonCR type="submit" className="w-100 btn-primary" label={guardando ? 'Guardando...' : 'Actualizar'} disabled={guardando} />
      )}
    </form>
  )
}
