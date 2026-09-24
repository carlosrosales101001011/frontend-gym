import React, { useEffect } from 'react'
import ModalCR from '@/components/Modal/ModalCR'
import { InputCR } from '@/components/TextFields/InputCR'
import { InputSelectCR } from '@/components/TextFields/InputSelectCR'
import { useTerminologiaPersona } from '@/hook/usePropiedadesStore'
import { useForm } from '@/hook/useForm'
import { initialStateProducto, type ProductoProps } from '@/pages/GestionProductos/store/productoSlice'
import { ButtonCR } from '@/components/Button/ButtonCR'
import { useProductoStore } from '@/pages/GestionProductos/useProductoStore'
import { removeNull } from '@/helpers/removeNull'
import { Col, Row } from 'react-bootstrap'
import { useAppSelector } from '@/stores/Store'

export const ModalCustomProducto = ({id, onHide, show}: {id: number, onHide: ()=>void, show: boolean}) => {
    const { data:dataUnidadMedida, cargar:cargarUnidadMedida } = useTerminologiaPersona('unidadMedida');
    const { data:dataEstado, cargar:cargarEstado } = useTerminologiaPersona('estadosEntidad');
    const { data:dataCategoriaProducto, cargar:cargarCategoriaProducto } = useTerminologiaPersona('categoriaProducto');
    const { data:dataMarcaProducto, cargar:cargarMarcaProducto } = useTerminologiaPersona('marcaProducto');
    const { obtenerOpAlmacenes, obtenerOpSucursales } = useProductoStore()
    const { post, dataxID, obtenerxID, patch} = useProductoStore()
    const {almacenes, sucursales} = useAppSelector((state)=>state.PRODUCTO)
    const { formState, register, handleSubmit, reset, getValues } = useForm({defaultValues: initialStateProducto.producto, mode: 'onChange'})
    useEffect(() => {
        if (show) {
            cargarUnidadMedida();
            cargarEstado();
            cargarCategoriaProducto()
            cargarMarcaProducto()
            obtenerOpSucursales()
            obtenerOpAlmacenes()
        }
    }, [show])
    useEffect(() => {
      if (id!==0 && show) {
        obtenerxID(id)
      }else{
        reset(initialStateProducto.producto);
      }
    }, [show, id])
    useEffect(() => {
      if (dataxID && id !== 0) {
        reset({
          ...dataxID
        });
      }else if (id === 0) {
        reset(initialStateProducto.producto);
      }
    }, [dataxID, id]);
    const onSubmit = (data: ProductoProps)=>{
        const { id, ...val } = removeNull(data);
        if (id!==0) {
        patch({...val, stock_actual: Number(val.stock_actual), stock_max: Number(val.stock_max), stock_min: Number(val.stock_min)} as ProductoProps, id, '')
        }else{
        post({...val, stock_actual: Number(val.stock_actual), stock_max: Number(val.stock_max), stock_min: Number(val.stock_min)} as ProductoProps)
        }
        onCancelar()
    }
    const onCancelar = ()=>{
        onHide()
        reset(initialStateProducto.producto)
    }
  return (
    <ModalCR onHide={onHide} show={show} size='lg' position='right'>
        <ModalCR.Header>
            <ModalCR.Title>Agregar producto {id} </ModalCR.Title>
        </ModalCR.Header>
        <ModalCR.Body>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                  <Col lg={4}>
                    <InputCR {...register("nombre", {
                        required: "Este campo es obligatorio"
                      })} label='Nombre del producto' name='nombre' type='normal' />
                  </Col>
                  <Col lg={4}>
                    <InputCR {...register("codigo_barra", {
                        required: "Este campo es obligatorio"
                      })} label='Código de Barra' name='codigo_barra' type='normal' />
                  </Col>
                  <Col lg={4}>
                    <InputCR {...register("codigo_sku", {
                        required: "Este campo es obligatorio"
                      })} label='Código SKU' name='codigo_sku' type='normal' />
                  </Col>
                  <Col lg={4}>
                    <InputCR {...register("stock_actual")} label='Stock inicial' name='stock_actual' type='normal'/>
                  </Col>
                  <Col lg={4}>
                    <InputCR {...register("stock_max")} label='Stock Máximo' name='stock_max' type='normal'/>
                  </Col>
                  <Col lg={4}>
                    <InputCR {...register("stock_min")} label='Stock Mínimo' name='stock_min' type='normal'/>
                  </Col>
                  {
                    getValues('id_sucursal')!==0 && (
                      <Col lg={6}>
                      <InputSelectCR {...register("id_almacen")} label='Almacen' name='id_almacen' options={almacenes.filter(f=>f.id_sucursal===getValues('id_sucursal'))} messageErrors={formState.errors.id_almacen?.message}/>
                      </Col>
                    )
                  }
                  <Col lg={6}>
                  <InputSelectCR {...register("id_sucursal")} label='Sucursal' name='id_sucursal' options={sucursales} messageErrors={formState.errors.id_sucursal?.message}/>
                  </Col>
                  <Col lg={4}>
                  <InputSelectCR {...register("id_categoria")} label='Categoría' name='id_categoria' options={dataCategoriaProducto} messageErrors={formState.errors.id_categoria?.message}/>
                  </Col>
                  <Col lg={4}>
                  <InputSelectCR {...register("id_marca")} label='Marca' name='id_marca' options={dataMarcaProducto} messageErrors={formState.errors.id_marca?.message}/>
                  </Col>
                  <Col lg={4}>
                  <InputSelectCR {...register("id_unidadMedida")} label='Unidad de Medida' name='id_unidadMedida' options={dataUnidadMedida} messageErrors={formState.errors.id_unidadMedida?.message}/>
                  </Col>
                  <Col lg={4}>
                    <InputSelectCR {...register("id_estado")} label='Estado' name='id_estado' options={dataEstado} messageErrors={formState.errors.id_estado?.message}/>
                  </Col>
                  <Col lg={12}>
                    <InputCR {...register("descripcion")} label='Descripción' name='descripcion' type='text-area' />
                  </Col>
                </Row>
                  <ButtonCR label='Guardar' type='submit' />
              </form>
        </ModalCR.Body>
    </ModalCR>
  )
}
