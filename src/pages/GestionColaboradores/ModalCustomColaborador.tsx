import { Col, Modal, Row } from 'react-bootstrap'
import { InputCR } from '@/components/TextFields/InputCR';
import { useForm } from '@/hook/useForm';
import { initialStateColaborador, type ColaboradorProps } from '@/pages/GestionColaboradores/store/colaboradoresSlice';
import { InputSelectCR } from '@/components/TextFields/InputSelectCR';
import { ImageDropZone, type formProp } from '@/components/ImageDropZone/ImageDropZone';
import { useEffect, useState } from 'react';
import { ButtonCR } from '@/components/Button/ButtonCR';
import { useColaboradorStore } from '@/pages/GestionColaboradores/useColaboradorStore';
import { useTerminologiaPersona } from '@/hook/usePropiedadesStore';
type props = {
  show: boolean;
  onHide:()=>void;
  id: number;
}
export const ModalCustomColaborador = ({show, onHide, id}:props) => {
    const { post, obtenerxID, dataxID, patch } = useColaboradorStore()
    const { data:dataGenero, cargar:cargarGenero } = useTerminologiaPersona('GeneroPersona');
    const { data:dataEstadoCivil, cargar:cargarEstadoCivil } = useTerminologiaPersona('EstadoCivilPersona');
    const { data:dataTipoDocumento, cargar:cargarTipoDocumento } = useTerminologiaPersona('TipoDeDocumentoPersona');
    const { data:dataDistritoLima, cargar:cargarDistritoLima } = useTerminologiaPersona('distritosLima');
    const { data:dataDistritoCallao, cargar:cargarDistritoCallao } = useTerminologiaPersona('distritosCallao');
    const { register, formState: { errors }, handleSubmit, reset} = useForm<ColaboradorProps>({mode: "onTouched",defaultValues: initialStateColaborador.colaborador })
    const [avatar, setavatar] = useState<formProp>({value: {file: null, id: 0, name: '', src: ''}, name: ''})
    console.log({avatar});
    const dataChange = (e:formProp)=>{
      setavatar(e)
    }
    useEffect(() => {
      if (show) {
        cargarGenero()
        cargarEstadoCivil()
        cargarTipoDocumento()
        cargarDistritoCallao()
        cargarDistritoLima()
      }
    }, [show])
    useEffect(() => {
      if (id!==0 && show) {
        obtenerxID(id)
      }else{
        reset(initialStateColaborador.colaborador); 
      }
    }, [show, id])
    useEffect(() => {
      if (dataxID && id !== 0) {
        reset({
          ...dataxID
        });
      }else if (id === 0) {
        reset(initialStateColaborador.colaborador); 
      }
    }, [dataxID, id]);
    const onSubmitCustomColaborador = (data:ColaboradorProps)=>{
      const {id:idData, uid: uuid, ...val} = data;
      if (id!==0) {
        console.log({val}, idData, uuid);
        patch({
          ...val,
          fecha_nacimiento: new Date(data.fecha_nacimiento)
        }, id, uuid)
        return;
      }else{
        post({
          ...val,
          fecha_nacimiento: new Date(data.fecha_nacimiento)
        })
        return ;
      }
    }
    const cancelarSubmitCustomColaborador = ()=>{
      onHide()
      reset()
    }
    return (
    <Modal show={show} onHide={cancelarSubmitCustomColaborador} size='xl'>
      <Modal.Header className='fw-bold'>
          Agregar un Colaborador {id}
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmitCustomColaborador)}>
          <Row>
            <Col lg={4}>
              <div className='d-flex justify-content-center'>
                <ImageDropZone name='blob_avatar' onChange={(event:formProp)=>dataChange(event)} heightZone={340} widthZone={300}/>
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
                  })} label="Distrito" options={[...dataDistritoLima, ...dataDistritoCallao]} messageErrors={errors.id_distrito?.message}/>
                </Col>
                <Col lg={6}>
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
            </Col>
          </Row>
          <Row>
            <Col className='' lg={6}>
            <ButtonCR label={'Agregar'} type='submit' className='w-100'/>
            </Col>
            <Col className='' lg={6}>
            <ButtonCR label={'Cancelar'} onClick={cancelarSubmitCustomColaborador} variant='danger' className='w-100'/>
            </Col>
          </Row>
        </form>
      </Modal.Body>
    </Modal>
  )
}
