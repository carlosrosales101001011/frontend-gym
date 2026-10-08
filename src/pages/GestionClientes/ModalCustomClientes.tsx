import { useEffect, useRef, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { TabsCR } from '@/components/Tabs/TabsCR'
import { TabCR } from '@/components/Tabs/TabCR'
import ModalCR from '@/components/Modal/ModalCR'
import { InputCR } from '@/components/TextFields/InputCR'
import { InputSelectCR } from '@/components/TextFields/InputSelectCR'
import { useForm } from '@/hook/useForm'
import { useTerminologiaPersona } from '@/hook/usePropiedadesStore'
import { initialStateClientes, type ClienteProps } from '@/pages/GestionClientes/store/clientesSlice'
import { ButtonCR } from '@/components/Button/ButtonCR'
import { useClientesStore } from '@/pages/GestionClientes/useClientesStore'
import { removeNull } from '@/helpers/removeNull'
import { quitarCamposSoloLectura } from '@/helpers/quitarCamposSoloLectura'
import { SelectorFoto } from '@/components/Avatar/SelectorFoto'
import { getBlobUrl } from '@/helpers/blobUrl'
import type { AjusteFoto } from '@/components/Avatar/encuadreFoto'
import Swal from 'sweetalert2'
import { mensajeError } from '@/helpers/mensajeError'
import { AppContactoEmergencia } from '@/components/GestionContactoEmergencia/AppContactoEmergencia'
import type { ContactoEmergenciaForm } from '@/components/GestionContactoEmergencia/useContactoEmergenciaStore'

/** Al dejar de escribir el N° de documento, cuánto se espera antes de verificarlo */
const ESPERA_VERIFICAR_DOCUMENTO_MS = 4000

type props = {
  show: boolean;
  onHide:()=>void;
  id: number;
}
export const ModalCustomClientes = ({show, onHide, id}:props) => {
    const { post, patch, obtenerxID, dataxID, subirAvatar, guardarAjusteAvatar, eliminarAvatar, guardarContactosEmergencia, guardarPrimerComentario, buscarDocumentoRepetido } = useClientesStore()
    const { data:dataGenero, cargar:cargarGenero } = useTerminologiaPersona('GeneroPersona');
    const { data:dataEstadoCivil, cargar:cargarEstadoCivil } = useTerminologiaPersona('EstadoCivilPersona');
    const { data:dataTipoDocumento, cargar:cargarTipoDocumento } = useTerminologiaPersona('TipoDeDocumentoPersona');
    const { data:dataDistritoLima, cargar:cargarDistritoLima } = useTerminologiaPersona('distritosLima');
    const { data:dataDistritoCallao, cargar:cargarDistritoCallao } = useTerminologiaPersona('distritosCallao');
    const { register, formState: { errors }, handleSubmit, reset, getValues } = useForm<ClienteProps>({mode: "onTouched", defaultValues: initialStateClientes.cliente})
    // N° de documento: se verifica al salir del campo o a los 4 s de dejar de escribir; repetido = no se puede guardar
    const [verificandoDocumento, setVerificandoDocumento] = useState(false)
    const [documentoRepetidoDe, setDocumentoRepetidoDe] = useState<string | null>(null)
    const temporizadorDocumento = useRef<number | undefined>(undefined)
    // Solo vale la respuesta de la última verificación (si se sigue escribiendo, las anteriores se ignoran)
    const consultaDocumento = useRef(0)
    const verificarDocumento = async () => {
      window.clearTimeout(temporizadorDocumento.current)
      const numero = String(getValues('numero_documento') ?? '').trim()
      const idTipoDocumento = Number(getValues('id_tipo_documento'))
      const consulta = ++consultaDocumento.current
      if (!numero || !idTipoDocumento) {
        setVerificandoDocumento(false)
        setDocumentoRepetidoDe(null)
        return
      }
      setVerificandoDocumento(true)
      try {
        const repetidoDe = await buscarDocumentoRepetido(idTipoDocumento, numero, id || undefined)
        if (consulta === consultaDocumento.current) setDocumentoRepetidoDe(repetidoDe)
      } catch (error) {
        console.log(error)
      } finally {
        if (consulta === consultaDocumento.current) setVerificandoDocumento(false)
      }
    }
    /** Al escribir: se descarta el aviso anterior y se verifica cuando deje de escribir */
    const alEscribirDocumento = () => {
      window.clearTimeout(temporizadorDocumento.current)
      consultaDocumento.current++
      setDocumentoRepetidoDe(null)
      setVerificandoDocumento(false)
      temporizadorDocumento.current = window.setTimeout(verificarDocumento, ESPERA_VERIFICAR_DOCUMENTO_MS)
    }
    useEffect(() => () => window.clearTimeout(temporizadorDocumento.current), [])
    const [avatarKey, setAvatarKey] = useState(`${show}-${id}`)
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    // "Eliminar foto" sobre la foto ya guardada: se quita al guardar el cliente
    const [quitarFotoGuardada, setQuitarFotoGuardada] = useState(false)
    // Encuadre elegido en "Ajustar foto" y todavía sin guardar (se guarda con el cliente)
    const [ajusteFoto, setAjusteFoto] = useState<AjusteFoto | null>(null)
    // Cliente nuevo: contactos de emergencia en memoria, se guardan después de crear al cliente
    const [contactosEmergencia, setContactosEmergencia] = useState<ContactoEmergenciaForm[]>([])
    // Cliente nuevo: primer comentario (opcional), se guarda después de crear al cliente
    const [primerComentario, setPrimerComentario] = useState('')
    const avatarPreview = id !== 0 && !quitarFotoGuardada ? (getBlobUrl(dataxID?.url_avatar) ?? null) : null
    // resetea el archivo elegido cuando el modal se abre para otro cliente (o de nuevo), sin usar un efecto
    const currentAvatarKey = `${show}-${id}`
    if (avatarKey !== currentAvatarKey) {
      setAvatarKey(currentAvatarKey)
      setAvatarFile(null)
      setQuitarFotoGuardada(false)
      setAjusteFoto(null)
      setContactosEmergencia([])
      setPrimerComentario('')
      setDocumentoRepetidoDe(null)
      setVerificandoDocumento(false)
    }
    const onElegirFoto = (archivo: File) => {
      setAvatarFile(archivo)
      setQuitarFotoGuardada(false)
      setAjusteFoto(null) // una foto nueva empieza centrada
    }
    /** Quita la foto elegida; si no había una elegida, marca la guardada para quitarla al guardar */
    const onEliminarFoto = () => {
      if (avatarFile) setAvatarFile(null)
      else setQuitarFotoGuardada(true)
      setAjusteFoto(null)
    }
    useEffect(() => {
      if (show) {
        cargarGenero()
        cargarEstadoCivil()
        cargarTipoDocumento()
        cargarDistritoLima()
        cargarDistritoCallao()
      }
    }, [show])
    useEffect(() => {
      if (id!==0 && show) {
        obtenerxID(id)
      }else{
        reset(initialStateClientes.cliente);
      }
    }, [show, id])
    useEffect(() => {
      if (dataxID && id !== 0) {
        reset({
          ...dataxID
        });
      }else if (id === 0) {
        reset(initialStateClientes.cliente);
      }
    }, [dataxID, id]);
    const onSubmit = async (data:ClienteProps)=>{
      // No se guarda un cliente con un documento que ya tiene otro cliente
      if (verificandoDocumento || documentoRepetidoDe) return
      // la foto se guarda aparte: sus campos (url_avatar, encuadre...) y uid_comentario no van en el cliente
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {id:idData, uid: uuid, ...rest} = removeNull(quitarCamposSoloLectura(data));
      // los campos label_* son de solo lectura (calculados por el backend a partir de los id_*), nunca se reenvían
      const val = Object.fromEntries(
        Object.entries(rest).filter(([key]) => !key.startsWith('label_'))
      ) as typeof rest;
      const uidAvatarActual = id !== 0 ? (dataxID?.uid_avatar || '') : '';
      const nuevoUidAvatar = avatarFile ? (uidAvatarActual || crypto.randomUUID().toUpperCase()) : undefined;
      const payload = {
        ...val,
        id_nacionalidad: Number(val.id_nacionalidad),
        id_distrito: Number(val.id_distrito),
        fecha_nacimiento: new Date(data.fecha_nacimiento),
        ...(nuevoUidAvatar ? { uid_avatar: nuevoUidAvatar } : {})
      }
      if (id!==0) {
        await patch(payload, id, uuid)
      }else{
        const respuesta = await post(payload)
        const uidContactos: string | undefined = respuesta?.data?.uid_contactoEmergencia
        const uidComentario: string | undefined = respuesta?.data?.uid_comentario
        const comentario = primerComentario.trim()
        // El cliente ya quedó creado: si falla lo relacionado, se avisa para agregarlo desde su perfil
        if (uidContactos && contactosEmergencia.length > 0) {
          try {
            await guardarContactosEmergencia(uidContactos, contactosEmergencia)
          } catch (error) {
            await Swal.fire({ icon: 'warning', title: 'Cliente creado, pero no se guardaron sus contactos de emergencia', html: mensajeError(error) })
          }
        }
        if (uidComentario && comentario) {
          try {
            await guardarPrimerComentario(uidComentario, comentario)
          } catch (error) {
            await Swal.fire({ icon: 'warning', title: 'Cliente creado, pero no se guardó el primer comentario', html: mensajeError(error) })
          }
        }
      }
      if (avatarFile && nuevoUidAvatar) {
        const idBlob = await subirAvatar(nuevoUidAvatar, avatarFile)
        if (ajusteFoto && idBlob) await guardarAjusteAvatar(idBlob, ajusteFoto)
      } else if (ajusteFoto && !quitarFotoGuardada && dataxID?.avatar?.id) {
        await guardarAjusteAvatar(dataxID.avatar.id, ajusteFoto)
      } else if (quitarFotoGuardada && uidAvatarActual) {
        await eliminarAvatar(uidAvatarActual)
      }
      onCancelar()
    }
    const onCancelar = ()=>{
      onHide()
      reset(initialStateClientes.cliente)
    }
    console.log({dataDistritoCallao});
    
    return (
    <ModalCR onHide={onCancelar} show={show} size='xl' position='center'>
      <ModalCR.Header>
        <ModalCR.Title>Agregar Cliente</ModalCR.Title>
      </ModalCR.Header>
      <ModalCR.Body>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                <Col lg={3}>
                  <div className='d-flex justify-content-center pt-3'>
                    <SelectorFoto
                      src={avatarPreview}
                      archivo={avatarFile}
                      ajuste={ajusteFoto ?? (avatarFile ? null : dataxID?.avatar)}
                      onChange={onElegirFoto}
                      onAjustar={setAjusteFoto}
                      onEliminar={onEliminarFoto}
                    />
                  </div>
                </Col>
                <Col lg={9}>
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
                      })} label="Fecha de nacimiento" type='date' messageErrors={errors.fecha_nacimiento?.message}/>
                    </Col>
                    <Col lg={6}>
                      <InputCR {...register("telefono", {
                        required: "Este campo es obligatorio"
                      })} label="Telefono" messageErrors={errors.telefono?.message}/>
                    </Col>
                    <Col lg={6}>
                      <InputSelectCR {...register("id_genero", {
                        required: "Este campo es obligatorio"
                      })} label="Genero" options={dataGenero} messageErrors={errors.id_genero?.message}/>
                    </Col>
                    <Col lg={6}>
                      <InputSelectCR {...register("id_estado_civil", {
                        required: "Este campo es obligatorio"
                      })} label="Estado civil" options={dataEstadoCivil} messageErrors={errors.id_estado_civil?.message}/>
                    </Col>
                    <Col lg={6}>
                      <InputSelectCR {...register("id_tipo_documento", {
                        required: "Este campo es obligatorio",
                        // Otro tipo de documento: se vuelve a verificar el número (si ya hay uno)
                        onChange: () => { verificarDocumento() },
                      })} label="Tipo documento" options={dataTipoDocumento} messageErrors={errors.id_tipo_documento?.message}/>
                    </Col>
                    <Col lg={6}>
                      <InputCR {...register("numero_documento", {
                        required: "Este campo es obligatorio",
                        onChange: alEscribirDocumento,
                        onBlur: () => { verificarDocumento() },
                      })}
                        label="N° de documento"
                        messageErrors={errors.numero_documento?.message || (documentoRepetidoDe ? `Ya existe un cliente con este documento: ${documentoRepetidoDe}` : '')}
                        // Loading a la derecha mientras se verifica si ya existe
                        iconos={verificandoDocumento ? [{
                          icon: <span className="spinner-border spinner-border-sm text-primary" role="status" aria-label="Verificando documento" />,
                          position: 'right',
                        }] : []}
                      />
                    </Col>
                    <Col lg={6}>
                      <InputSelectCR {...register("id_distrito", {
                        required: "Este campo es obligatorio"
                      })} options={[...dataDistritoLima, ...dataDistritoCallao]} label="Distrito" messageErrors={errors.id_distrito?.message}/>
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
                      <InputCR {...register("email_corporativo")} label="Email corporativo" messageErrors={errors.email_corporativo?.message}/>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={6}>
                      <ButtonCR label={verificandoDocumento ? 'Verificando documento...' : 'Guardar'} type='submit' className='w-100'
                        disabled={verificandoDocumento || !!documentoRepetidoDe}/>
                    </Col>
                    <Col lg={6}>
                      <ButtonCR label={'Cancelar'} onClick={onCancelar} variant='danger' className='w-100'/>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </form>
            {/* Fuera del <form>: Enter en el buscador o guardar un contacto no deben enviar el cliente */}
            <TabsCR>
                  <TabCR title='Contacto de emergencia'>
                    {id === 0 ? (
                      // Cliente nuevo: todavía no existe; los contactos se guardan al crear al cliente
                      <AppContactoEmergencia key={avatarKey} UsarApiPOST={false} onChange={setContactosEmergencia} />
                    ) : dataxID?.uid_contactoEmergencia ? (
                      <AppContactoEmergencia key={dataxID.uid_contactoEmergencia} uid_location={dataxID.uid_contactoEmergencia} />
                    ) : null}
                  </TabCR>
                  <TabCR title='Primer comentario'>
                    {id === 0 ? (
                      // Se guarda como comentario del cliente al crearlo (si se escribe algo)
                      <div className='mt-2'>
                        <InputCR
                          type='text-area'
                          label='Primer comentario (opcional)'
                          value={primerComentario}
                          maxLength={450}
                          onChange={(e) => setPrimerComentario(e.target.value)}
                        />
                      </div>
                    ) : (
                      <p className='small opacity-75 mt-2 mb-0'>Los comentarios del cliente se ven y agregan en su perfil.</p>
                    )}
                  </TabCR>
            </TabsCR>
      </ModalCR.Body>
    </ModalCR>
  )
}
