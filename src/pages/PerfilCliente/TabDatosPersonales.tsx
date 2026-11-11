
import { InputCR } from '@/components/TextFields/InputCR'
import { Col, Row } from 'react-bootstrap'
import { useForm } from '@/hook/useForm'
import { InputSelectCR } from '@/components/TextFields/InputSelectCR'
import type { ColaboradorProps } from '@/pages/PerfilCliente/store/perfilColaboradorSlice'
import { useEffect } from 'react'
import { usePerfilColaboradorStore } from '@/pages/PerfilCliente/usePerfilColaboradorStore'
import { useSelector } from 'react-redux'
import type { RootState } from '@/stores/Store';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { BtnDelete, BtnUpdate } from '@/components/Button/buttonsCrud'
import { useTerminologiaPersona } from '@/hook/usePropiedadesStore'
import { CardSeccionCR } from '@/components/CardSeccion/CardSeccionCR'
import { useMembresiaActual } from '@/pages/GestionAsistencias/hook/useMembresiaActual'
import { membresiaVigente } from '@/helpers/alertaMembresia'
import { formatDate } from '@/helpers/FormatDate'
import { parseISO } from 'date-fns'
/** Fecha y hora del backend (ISO) para mostrar; vacío si no tiene */
const fechaHora = (valor?: string) => valor ? formatDate(parseISO(valor), 'yyyy-mm-dd', 'dd/mm/yyyy hh:mm') : ''
type TabDatosPersonalesProps = {
  /** Si el tab está a la vista: cada vez que se activa se vuelven a pedir los datos (por defecto siempre) */
  activo?: boolean
}
export const TabDatosPersonales = ({ activo = true }: TabDatosPersonalesProps) => {
  // El perfil de cliente usa :uid_person; se mantiene :uid_cliente por la pantalla anterior de PerfilCliente
  const { uid_person, uid_cliente } = useParams<{ uid_person: string, uid_cliente: string }>();
  const uid = uid_person ?? uid_cliente ?? '';
  const { obtenerDataColaboradorxUID, loading, actualizarDatosPersonales, eliminarCliente } = usePerfilColaboradorStore()
  const navigate = useNavigate()
  const [, uid_modulo] = useLocation().pathname.split('/')
  const {colaborador} = useSelector((state: RootState)=>state.PERFIL_COLABORADOR)
  const { register, formState: { errors }, reset, getValues} = useForm<ColaboradorProps>({mode: "all",defaultValues: colaborador })
  const { data:dataGeneroPersona, cargar:cargarGeneroPersona } = useTerminologiaPersona('GeneroPersona');
  const { data:dataDistritoCallao, cargar:cargarDistritoCallao } = useTerminologiaPersona('distritosCallao');
  const { data:dataDistritoLima, cargar:cargarDistritoLima } = useTerminologiaPersona('distritosLima');
  const { data:dataEstadoCivilPersona, cargar:cargarEstadoCivilPersona } = useTerminologiaPersona('EstadoCivilPersona');
  const { data:dataTipoDeDocumentoPersona, cargar:cargarTipoDeDocumentoPersona } = useTerminologiaPersona('TipoDeDocumentoPersona');
  // Activo = su última membresía aún no vence
  const { membresia, cargando: cargandoMembresia } = useMembresiaActual(colaborador?.id)
  const estado = cargandoMembresia ? 'Cargando...' : membresiaVigente(membresia) ? 'Activo' : 'Inactivo'
  useEffect(() => {
    if (!activo || !uid) return
    obtenerDataColaboradorxUID(uid)
    cargarGeneroPersona()
    cargarEstadoCivilPersona()
    cargarTipoDeDocumentoPersona()
    cargarDistritoCallao()
    cargarDistritoLima()
  }, [activo, uid])
  useEffect(() => {
    if (colaborador) {
      reset(colaborador);
    }
  }, [colaborador]);
  if (loading)return( <>LOADING</>)
  // El hook envía solo los campos del formulario y recarga con el uid de la URL
  // Tras eliminarlo, vuelve al listado de clientes del módulo actual
  const onEliminar = async ()=>{
    const nombre = [colaborador.nombres, colaborador.apellido_paterno, colaborador.apellido_materno].filter(Boolean).join(' ')
    if (await eliminarCliente(colaborador.id, nombre)) navigate(`/${uid_modulo}/gestion-clientes`)
  }
  const onSubmitActualizar = ()=>{
    actualizarDatosPersonales(colaborador.id, uid, getValues() as Partial<ColaboradorProps>)
  }
    return (
    <div>
        <form>
          <Row>
            <Col lg={12}>
              <CardSeccionCR titulo="Datos personales" className="mb-3">
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
                </Row>
              </CardSeccionCR>
            </Col>
            <Col lg={6}>
              <CardSeccionCR titulo="Contacto" className="mb-3">
                <Row>
                  <Col lg={6}>
                    <InputCR {...register("telefono", {
                      required: "Este campo es obligatorio"
                    })} label="Telefono" messageErrors={errors.telefono?.message}/>
                  </Col>
                  <Col lg={6}>
                    <InputSelectCR {...register("id_distrito", {
                      required: "Este campo es obligatorio"
                    })} label="Distrito" options={[...dataDistritoCallao, ...dataDistritoLima]} messageErrors={errors.id_distrito?.message}/>
                  </Col>
                  <Col lg={12}>
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
                </Row>
              </CardSeccionCR>
            </Col>
            <Col lg={6}>
              <CardSeccionCR titulo="Estado del cliente" className="mb-3">
                {/* Una fila por dato: título a la izquierda, campo a la derecha */}
                {[
                  ['Estado', estado],
                  ['Fecha de registro', fechaHora(colaborador.fecha_registro)],
                  ['Última actualización', fechaHora(colaborador.updatedAt)],
                ].map(([titulo, valor]) => (
                  <Row key={titulo} className="align-items-center mb-2">
                    <Col xs={4} className="fw-semibold">{titulo}</Col>
                    <Col xs={8}>
                      <InputCR label="" aria-label={titulo} value={valor} readOnly disabled/>
                    </Col>
                  </Row>
                ))}
              </CardSeccionCR>
            </Col>
            </Row>
          <div className='d-flex gap-2'>
            <BtnUpdate onClick={onSubmitActualizar} className='flex-fill' label='Actualizar datos'/>
            <BtnDelete onClick={onEliminar} className='flex-fill' label='Eliminar cliente'/>
          </div>
        </form>
    </div>
  )
}
