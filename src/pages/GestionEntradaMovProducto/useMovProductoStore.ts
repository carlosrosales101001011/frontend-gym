import { useDispatch } from "react-redux"
import { useCrudhook } from "@/hook/usecrudhook"
import { onSetDataMovProductos, onSetDataOpcionesSucursales, onSetDataOpcionesAlmacenes, onSetDataOpcionesProductos, type MovProductoProps } from "@/pages/GestionEntradaMovProducto/store/movProductoSlice"
import type { AlmacenProps, SucursalProps } from "@/pages/GestionAlmacen/store/almacenSlice"
import type { ProductoProps } from "@/pages/GestionProductos/store/productoSlice"

export const useMovProductoStore = () => {
    const { post, obtener, dataxID, obtenerxID, remove, patch, searcher } = useCrudhook<MovProductoProps>('/producto-movimiento/id_tipo_mov/6045', onSetDataMovProductos)
    const { obtener:obtenerSucursales } = useCrudhook<SucursalProps>('/empresa-sucursal')
    const { obtener:obtenerAlmacenes } = useCrudhook<AlmacenProps>('/empresa-almacen')
    const { obtener:obtenerProductos } = useCrudhook<ProductoProps>('/producto')
    const dispatch = useDispatch()
    const obtenerOpSucursales = async()=>{
      try {
        const data = await obtenerSucursales()
        dispatch(onSetDataOpcionesSucursales(data.lista.map((sucursal:SucursalProps)=>({value:sucursal.id, label:sucursal.nombre}))))
      } catch (error) {
        console.log(error);
      }
    }
    const obtenerOpAlmacenes = async()=>{
      try {
        const data = await obtenerAlmacenes()
        dispatch(onSetDataOpcionesAlmacenes(data.lista.map((almacen:AlmacenProps)=>({value:almacen.id, label:almacen.nombre}))))
      } catch (error) {
        console.log(error);
      }
    }
    const obtenerOpProductos = async()=>{
      try {
        const data = await obtenerProductos()
        dispatch(onSetDataOpcionesProductos(data.lista.map((producto:ProductoProps)=>({value:producto.id, label:producto.nombre}))))
      } catch (error) {
        console.log(error);
      }
    }
  return {
    searcher,
    post,
    obtener,
    dataxID,
    obtenerxID,
    remove,
    patch,
    obtenerOpSucursales,
    obtenerOpAlmacenes,
    obtenerOpProductos
  }
}
