import { useDispatch } from "react-redux"
import { useCrudhook } from "@/hook/usecrudhook"
import { onSetDataAlmacenes,  onSetDataOpcionesSucursales,  type AlmacenProps, type SucursalProps } from "@/pages/GestionAlmacen/store/almacenSlice"

export const useAlmacenStore = () => {
    const { post, obtener, dataxID, obtenerxID, remove, patch, searcher } = useCrudhook<AlmacenProps>('/empresa-almacen', onSetDataAlmacenes)
    const { obtener:obtenerSucursales } = useCrudhook<SucursalProps>('/empresa-sucursal')
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
  return {
    searcher,
    post,
    obtener,
    dataxID,
    obtenerxID,
    remove,
    patch,
    obtenerOpSucursales
  }
}
