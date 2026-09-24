import { useEffect, useState } from 'react'
import { Col, Row, Tab, Tabs } from 'react-bootstrap'
import ModalCR from '@/components/Modal/ModalCR'
import { InputCR } from '@/components/TextFields/InputCR'
import { InputSelectCR } from '@/components/TextFields/InputSelectCR'
import { useForm } from '@/hook/useForm'
import { useTerminologiaPersona } from '@/hook/usePropiedadesStore'
import { initialStateClientes, type ClienteProps } from '@/pages/GestionClientes/store/clientesSlice'
import { ButtonCR } from '@/components/Button/ButtonCR'
import { useClientesStore } from '@/pages/GestionClientes/useClientesStore'
import { removeNull } from '@/helpers/removeNull'
import { ImageDropZone, type formProp } from '@/components/ImageDropZone/ImageDropZone'
import { getBlobUrl } from '@/helpers/blobUrl'
import httpClient from '@/common/helpers/httpClient'

type props = {
  show: boolean;
  onHide:()=>void;
  id: number;
}
export const ModalCustomClientes = ({show, onHide, id}:props) => {
    const { post, patch, obtenerxID, dataxID } = useClientesStore()
    const { data:dataGenero, cargar:cargarGenero } = useTerminologiaPersona('GeneroPersona');
    const { data:dataEstadoCivil, cargar:cargarEstadoCivil } = useTerminologiaPersona('EstadoCivilPersona');
    const { data:dataTipoDocumento, cargar:cargarTipoDocumento } = useTerminologiaPersona('TipoDeDocumentoPersona');
    const { data:dataEstado, cargar:cargarEstado } = useTerminologiaPersona('estadosEntidad');
    const { data:dataDistritoLima, cargar:cargarDistritoLima } = useTerminologiaPersona('distritosLima');
    const { data:dataDistritoCallao, cargar:cargarDistritoCallao } = useTerminologiaPersona('distritosCallao');
    const { register, formState: { errors }, handleSubmit, reset } = useForm<ClienteProps>({mode: "onTouched", defaultValues: initialStateClientes.cliente})
    const [avatarKey, setAvatarKey] = useState(`${show}-${id}`)
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const avatarPreview = id !== 0 ? (getBlobUrl(dataxID?.url_avatar) ?? null) : null
    // resetea el archivo elegido cuando el modal se abre para otro cliente (o de nuevo), sin usar un efecto
    const currentAvatarKey = `${show}-${id}`
    if (avatarKey !== currentAvatarKey) {
      setAvatarKey(currentAvatarKey)
      setAvatarFile(null)
    }
    const onAvatarChange = (event: formProp) => {
      setAvatarFile(event.value.file)
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {id:idData, uid: uuid, url_avatar: _urlAvatarForm, ...rest} = removeNull(data);
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
        const formData = new FormData()
        formData.append('file', avatarFile)
        await httpClient.post(`/persona/avatar/${nuevoUidAvatar}`, formData)
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
                  <div className='d-flex justify-content-center'>
                    <ImageDropZone name='avatar' initialSrc={avatarPreview} onChange={onAvatarChange} heightZone={340} widthZone={300}/>
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
                <Tabs>
                      <Tab title='Contacto de emergencia'>
                        
                      </Tab>
                      <Tab title='Primer comentario'>
                      </Tab>
                </Tabs>
                </Col>
              </Row>
            </form>
      </ModalCR.Body>
    </ModalCR>
  )
}
