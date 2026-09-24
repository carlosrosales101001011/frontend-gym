import { Col, Row } from "react-bootstrap";
import ModalCR from "@/components/Modal/ModalCR";
import { useForm } from "@/hook/useForm";
import { useTerminologiaPersona } from "@/hook/usePropiedadesStore";
import { initialStateAlmacen, type AlmacenProps } from "@/pages/GestionAlmacen/store/almacenSlice";
import { useAlmacenStore } from "@/pages/GestionAlmacen/useAlmacenStore";
import { InputCR } from "@/components/TextFields/InputCR";
import { InputSelectCR } from "@/components/TextFields/InputSelectCR";
import { ButtonCR } from "@/components/Button/ButtonCR";
import { useEffect } from "react";
import { removeNull } from "@/helpers/removeNull";
import { useAppSelector } from "@/stores/Store";

export const ModalCustomAlmacen = ({id, onHide, show}: {id: number, onHide: ()=>void, show: boolean}) => {
    const { data:dataEstado, cargar:cargarEstado } = useTerminologiaPersona('estadosEntidad');
    const { post, dataxID, obtenerxID, patch, obtenerOpSucursales} = useAlmacenStore()
        const {opcionesSucursales} = useAppSelector((state)=>state.ALMACEN)
    const { data:dataTipoSucursal, cargar:cargarTipoSucursal } = useTerminologiaPersona('tipoSucursal')
    const { formState, register, handleSubmit, reset } = useForm({defaultValues: initialStateAlmacen.almacen, mode: 'onChange'})
    useEffect(() => {
        if (show) {
            cargarEstado();
            cargarTipoSucursal()
            obtenerOpSucursales()
        }
    }, [show])

        useEffect(() => {
          if (id!==0 && show) {
            obtenerxID(id)
          }else{
            reset(initialStateAlmacen.almacen);
          }
        }, [show, id])

        useEffect(() => {
          if (dataxID && id !== 0) {
            reset({
              ...dataxID
            });
          }else if (id === 0) {
            reset(initialStateAlmacen.almacen);
          }
        }, [dataxID, id]);
    const onSubmit = (data: AlmacenProps)=>{
        const { id, ...val } = removeNull(data);
        if (id!==0) {
        patch({...val, id_tipo: Number(val.id_tipo), id_responsable: Number(val.id_responsable), capacidad: Number(val.capacidad)} as AlmacenProps, id, '')
        }else{
        post({...val, id_tipo: Number(val.id_tipo), id_responsable: Number(val.id_responsable), capacidad: Number(val.capacidad)} as AlmacenProps)
        }
        onCancelar()
    }
    const onCancelar = ()=>{
        onHide()
        reset(initialStateAlmacen.almacen)
    }
  return (
    <ModalCR onHide={onHide} show={show} size='md' position='center'>
        <ModalCR.Header>
            <ModalCR.Title>Agregar almacen {id} </ModalCR.Title>
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
                    })} label='Nombre del almacen' name='nombre' type='normal' />
                </Col>
                <Col lg={6}>
                  <InputSelectCR {...register("id_sucursal")} label='ID Sucursal' name='id_sucursal' options={opcionesSucursales} messageErrors={formState.errors.id_sucursal?.message}/>
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
                <Col lg={4}>
                  <InputCR {...register("capacidad")} label='Capacidad' name='capacidad' type='normal' />
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
