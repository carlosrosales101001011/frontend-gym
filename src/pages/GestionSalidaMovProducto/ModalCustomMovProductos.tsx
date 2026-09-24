import React, { useEffect } from 'react'
import ModalCR from '@/components/Modal/ModalCR'
import { InputCR } from '@/components/TextFields/InputCR'
import { InputSelectCR } from '@/components/TextFields/InputSelectCR'
import { useTerminologiaPersona } from '@/hook/usePropiedadesStore'
import { useForm } from '@/hook/useForm'
import { ButtonCR } from '@/components/Button/ButtonCR'
import { removeNull } from '@/helpers/removeNull'
import { Col, Row } from 'react-bootstrap'
import { initialStateMovProducto, type MovProductoProps } from '@/pages/GestionSalidaMovProducto/store/movProductoSlice'
import { useMovProductoStore } from '@/pages/GestionSalidaMovProducto/useMovProductoStore'
import { useAppSelector } from '@/stores/Store'

export const ModalCustomMovProductos = ({id, onHide, show}: {id: number, onHide: ()=>void, show: boolean}) => {
    // const { data:dataUnidadMedida, cargar:cargarUnidadMedida } = useTerminologiaPersona('unidadMedida');
    const { data:dataMotivoSalidaProducto, cargar:cargarMotivoSalidaProducto } = useTerminologiaPersona('motivoSalidaMovimientoProducto');
    const { post, dataxID, obtenerxID, patch, obtenerOpSucursales, obtenerOpAlmacenes, obtenerOpProductos} = useMovProductoStore()
    const { opcionesSucursales, opcionesAlmacenes, opcionesProductos } = useAppSelector((state)=>state.MOVPRODUCTO)
    const { formState, register, handleSubmit, reset } = useForm({defaultValues: initialStateMovProducto.movProducto, mode: 'onChange'})
    useEffect(() => {
        if (show) {
            // cargarUnidadMedida();
            obtenerOpSucursales();
            obtenerOpAlmacenes();
            obtenerOpProductos();
            cargarMotivoSalidaProducto()
            // cargarTipoMovimientoProducto()
        }
    }, [show])
    useEffect(() => {
      if (id!==0 && show) {
        obtenerxID(id)
      }else{
        reset(initialStateMovProducto.movProducto);
      }
    }, [show, id])
    useEffect(() => {
      if (dataxID && id !== 0) {
        reset({
          ...dataxID
        });
      }else if (id === 0) {
        reset(initialStateMovProducto.movProducto);
      }
    }, [dataxID, id]);
    const onSubmit = (data: MovProductoProps)=>{
        const { id, ...val } = removeNull(data);
        
        if (id!==0) {
        patch({...val, cantidad_movimiento: Number(val.cantidad_movimiento)} as MovProductoProps, id, '')
        }else{
        post({...val, cantidad_movimiento: Number(val.cantidad_movimiento)} as MovProductoProps)
        }
        onCancelar()
    }
    const onCancelar = ()=>{
        onHide()
        reset(initialStateMovProducto.movProducto)
    }
  return (
    <ModalCR onHide={onHide} show={show} size='lg' position='right'>
        <ModalCR.Header>
            <ModalCR.Title>Agregar producto {id} </ModalCR.Title>
        </ModalCR.Header>
        <ModalCR.Body>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                  <Col lg={8}>
                  <InputSelectCR {...register("id_producto")} label='Producto' name='id_producto' options={opcionesProductos} messageErrors={formState.errors.id_producto?.message}/>
                  </Col>
                  <Col lg={6}>
                  <InputSelectCR {...register("id_sucursal_origen")} label='Sucursal origen' name='id_sucursal_origen' options={opcionesSucursales} messageErrors={formState.errors.id_sucursal_origen?.message}/>
                  </Col>
                  <Col lg={6}>
                  <InputSelectCR {...register("id_almacen_origen")} label='Almacén origen' name='id_almacen_origen' options={opcionesAlmacenes} messageErrors={formState.errors.id_almacen_origen?.message}/>
                  </Col>
                  <Col lg={6}>
                  <InputSelectCR {...register("id_sucursal_destino")} label='Sucursal destino' name='id_sucursal_destino' options={opcionesSucursales} messageErrors={formState.errors.id_sucursal_destino?.message}/>
                  </Col>
                  <Col lg={6}>
                  <InputSelectCR {...register("id_almacen_destino")} label='Almacén destino' name='id_almacen_destino' options={opcionesAlmacenes} messageErrors={formState.errors.id_almacen_destino?.message}/>
                  </Col>
                  <Col lg={6}>
                    <InputCR {...register("cantidad_movimiento")} label='Cantidad' name='cantidad' type='normal' />
                  </Col>
                  <Col lg={6}>
                  <InputSelectCR {...register("id_motivo")} label='Motivo' name='id_motivo' options={dataMotivoSalidaProducto} messageErrors={formState.errors.id_motivo?.message}/>
                  </Col>
                </Row>
                  <ButtonCR label='Guardar' type='submit' />
              </form>
        </ModalCR.Body>
    </ModalCR>
  )
}
