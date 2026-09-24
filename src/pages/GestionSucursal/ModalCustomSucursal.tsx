import React, { useEffect } from 'react'
import ModalCR from '@/components/Modal/ModalCR'
import { InputCR } from '@/components/TextFields/InputCR'
import { InputSelectCR } from '@/components/TextFields/InputSelectCR'
import { useTerminologiaPersona } from '@/hook/usePropiedadesStore'
import { useForm } from '@/hook/useForm'
import { initialStateSucursal, type SucursalProps } from '@/pages/GestionSucursal/store/sucursalSlice'
import { ButtonCR } from '@/components/Button/ButtonCR'
import { useSucursalStore } from '@/pages/GestionSucursal/useSucursalStore'
import { removeNull } from '@/helpers/removeNull'
import { Col, Row } from 'react-bootstrap'

export const ModalCustomSucursal = ({id, onHide, show}: {id: number, onHide: ()=>void, show: boolean}) => {
  const { post, dataxID, obtenerxID, patch} = useSucursalStore()
  const { data:dataTipoSucursal, cargar:cargarTipoSucursal } = useTerminologiaPersona('tipoSucursal')
  const { data:dataEstado, cargar:cargarEstado } = useTerminologiaPersona('estadosEntidad');
    const { formState, register, handleSubmit, reset } = useForm({defaultValues: initialStateSucursal.sucursal, mode: 'onChange'})
    useEffect(() => {
        if (show) {
            cargarEstado();
            cargarTipoSucursal()
        }
    }, [show])

        useEffect(() => {
          if (id!==0 && show) {
            obtenerxID(id)
          }else{
            reset(initialStateSucursal.sucursal);
          }
        }, [show, id])

        useEffect(() => {
          if (dataxID && id !== 0) {
            reset({
              ...dataxID
            });
          }else if (id === 0) {
            reset(initialStateSucursal.sucursal);
          }
        }, [dataxID, id]);
    const onSubmit = (data: SucursalProps)=>{
        const { id, ...val } = removeNull(data);
        if (id!==0) {
        patch({...val, id_tipo: Number(val.id_tipo), id_responsable: Number(val.id_responsable)} as SucursalProps, id, '')
        }else{
        post({...val, id_tipo: Number(val.id_tipo), id_responsable: Number(val.id_responsable)} as SucursalProps)
        }
        onCancelar()
    }
    const onCancelar = ()=>{
        onHide()
        reset(initialStateSucursal.sucursal)
    }
  return (
    <ModalCR onHide={onHide} show={show} size='md' position='center'>
        <ModalCR.Header>
            <ModalCR.Title>Agregar sucursal {id} </ModalCR.Title>
        </ModalCR.Header>
        <ModalCR.Body>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                <Col lg={4}>
                  <InputCR {...register("codigo", {
                      required: "Este campo es obligatorio"
                    })} label='Código' name='codigo' type='normal' />
                </Col>
                <Col lg={8}>
                  <InputCR {...register("nombre", {
                      required: "Este campo es obligatorio"
                    })} label='Nombre de la sucursal' name='nombre' type='normal' />
                </Col>
                <Col lg={6}>
                  <InputSelectCR {...register("id_tipo")} label='ID Tipo' name='id_tipo' options={dataTipoSucursal} messageErrors={formState.errors.id_tipo?.message}/>
                </Col>
                <Col lg={6}>
                  <InputSelectCR {...register("id_responsable")} label='ID Responsable' name='id_responsable' options={dataEstado} messageErrors={formState.errors.id_responsable?.message}/>
                </Col>
                <Col lg={6}>
                  <InputSelectCR {...register("id_estado")} label='Estado' name='id_estado' options={dataEstado} messageErrors={formState.errors.id_estado?.message}/>
                </Col>
                <Col lg={6}>
                  <InputCR {...register("telefono")} label='Teléfono' name='telefono' type='normal' />
                </Col>
                <Col lg={6}>
                  <InputCR {...register("email")} label='Email' name='email' type='normal' />
                </Col>
                <Col lg={6}>
                  <InputCR {...register("ubigeo")} label='Ubigeo' name='ubigeo' type='normal' />
                </Col>
                <Col lg={12}>
                  <InputCR {...register("direccion")} label='Dirección' name='direccion' type='normal' />
                </Col>
              </Row>
                <ButtonCR label='Guardar' type='submit' />
            </form>
        </ModalCR.Body>
    </ModalCR>
  )
}
