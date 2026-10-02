import { useEffect, useState } from 'react'
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

type props = {
  show: boolean;
  onHide:()=>void;
  id: number;
}
export const ModalCustomClientes = ({show, onHide, id}:props) => {
    const { post, patch, obtenerxID, dataxID, subirAvatar, guardarAjusteAvatar, eliminarAvatar } = useClientesStore()
    const { data:dataGenero, cargar:cargarGenero } = useTerminologiaPersona('GeneroPersona');
    const { data:dataEstadoCivil, cargar:cargarEstadoCivil } = useTerminologiaPersona('EstadoCivilPersona');
    const { data:dataTipoDocumento, cargar:cargarTipoDocumento } = useTerminologiaPersona('TipoDeDocumentoPersona');
    const { data:dataEstado, cargar:cargarEstado } = useTerminologiaPersona('estadosEntidad');
    const { data:dataDistritoLima, cargar:cargarDistritoLima } = useTerminologiaPersona('distritosLima');
    const { data:dataDistritoCallao, cargar:cargarDistritoCallao } = useTerminologiaPersona('distritosCallao');
    const { register, formState: { errors }, handleSubmit, reset } = useForm<ClienteProps>({mode: "onTouched", defaultValues: initialStateClientes.cliente})
    const [avatarKey, setAvatarKey] = useState(`${show}-${id}`)
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    // "Eliminar foto" sobre la foto ya guardada: se quita al guardar el cliente
    const [quitarFotoGuardada, setQuitarFotoGuardada] = useState(false)
    // Encuadre elegido en "Ajustar foto" y todavía sin guardar (se guarda con el cliente)
    const [ajusteFoto, setAjusteFoto] = useState<AjusteFoto | null>(null)
    const avatarPreview = id !== 0 && !quitarFotoGuardada ? (getBlobUrl(dataxID?.url_avatar) ?? null) : null
    // resetea el archivo elegido cuando el modal se abre para otro cliente (o de nuevo), sin usar un efecto
    const currentAvatarKey = `${show}-${id}`
    if (avatarKey !== currentAvatarKey) {
      setAvatarKey(currentAvatarKey)
      setAvatarFile(null)
      setQuitarFotoGuardada(false)
      setAjusteFoto(null)
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
        cargarEstado()
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
        await post(payload)
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
        <ModalCR.Title>Agregar Cliente {id}</ModalCR.Title>
      </ModalCR.Header>
      <ModalCR.Body>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                <Col lg={4}>
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
                <Col lg={8}>
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
                        required: "Este campo es obligatorio"
                      })} label="Tipo documento" options={dataTipoDocumento} messageErrors={errors.id_tipo_documento?.message}/>
                    </Col>
                    <Col lg={6}>
                      <InputCR {...register("numero_documento", {
                        required: "Este campo es obligatorio"
                      })} label="N° de documento" messageErrors={errors.numero_documento?.message}/>
                    </Col>
                    <Col lg={6}>
                      <InputSelectCR {...register("id_distrito", {
                        required: "Este campo es obligatorio"
                      })} options={[...dataDistritoLima, ...dataDistritoCallao]} label="Distrito" messageErrors={errors.id_distrito?.message}/>
                    </Col>
                    <Col lg={6}>
                      <InputSelectCR {...register("id_estado", {
                        required: "Este campo es obligatorio"
                      })} label="Estado" options={dataEstado} messageErrors={errors.id_estado?.message}/>
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
                      <ButtonCR label={'Guardar'} type='submit' className='w-100'/>
                    </Col>
                    <Col lg={6}>
                      <ButtonCR label={'Cancelar'} onClick={onCancelar} variant='danger' className='w-100'/>
                    </Col>
                  </Row>
                </Col>
                <Col lg={12}>
                <TabsCR>
                      <TabCR title='Contacto de emergencia'>
                        
                      </TabCR>
                      <TabCR title='Primer comentario'>
                      </TabCR>
                </TabsCR>
                </Col>
              </Row>
            </form>
      </ModalCR.Body>
    </ModalCR>
  )
}
