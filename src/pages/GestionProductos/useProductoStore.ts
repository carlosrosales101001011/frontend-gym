import { useDispatch } from "react-redux"
import { useCrudhook } from "@/hook/usecrudhook"
import { onSetDataOpcionesAlmacenes, onSetDataOpcionesSucursales, onSetDataProductos, type AlmacenProps, type ProductoProps, type SucursalProps } from "@/pages/GestionProductos/store/productoSlice"

export const useProductoStore = () => {
    const { post, obtener, dataxID, obtenerxID, remove, patch, searcher } = useCrudhook<ProductoProps>('/producto', onSetDataProductos)
    const { obtener:obtenerSucursales } = useCrudhook<SucursalProps>('/empresa-sucursal')
    const { obtener:obtenerAlmacenes } = useCrudhook<AlmacenProps>('/empresa-almacen')
    const dispatch = useDispatch()
    const obtenerOpSucursales = async()=>{
      try {
        const data = await obtenerSucursales()
        console.log(data.lista);
        dispatch(onSetDataOpcionesSucursales(data.lista.map((sucursal:SucursalProps)=>({value:sucursal.id, label:sucursal.nombre}))))
      } catch (error) {
        console.log(error);
      }
    }
    const obtenerOpAlmacenes = async()=>{
      try {
        const data = await obtenerAlmacenes()
        console.log(data.lista);
        dispatch(onSetDataOpcionesAlmacenes(data.lista.map((sucursal:AlmacenProps)=>({value:sucursal.id, label:sucursal.nombre, id_sucursal: sucursal.id_sucursal}))))
      } catch (error) {
        console.log(error);
      }
    }
  return {
    obtenerOpAlmacenes,
    obtenerOpSucursales,
    searcher,
    post,
    obtener,
    dataxID,
    obtenerxID,
    remove,
    patch
  }
}
