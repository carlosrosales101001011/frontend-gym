import { useCrudhook } from "@/hook/usecrudhook"
import { onSetDataDetalleEgresos, type DetalleEgresoProps } from "@/pages/GestionEgresos/DetalleEgreso/store/detalleEgresoSlice"
import httpClient from "@/common/helpers/httpClient"
import { useDispatch } from "react-redux"

export const useDetalleEgresosStore = () => {
const dispatch = useDispatch()
    const { post, data, obtener, patch, obtenerxID, dataxID, remove } = useCrudhook<DetalleEgresoProps>('/detalleArticulos-gasto', onSetDataDetalleEgresos)
    const obtenerDetalleEgresosxIDMov = async(id_movimiento_financiero: number)=>{
      try {
        const {data} = await httpClient.get(`/detalleArticulos-gasto/id_movimiento_financiero/${id_movimiento_financiero}`)
        dispatch(onSetDataDetalleEgresos(data.map((m:DetalleEgresoProps)=>{
          return {
            ...m,
            is_old: true
          }
        })))
      } catch (error) {
        console.log(error);
      }
    }
  return {
    remove,
    obtenerxID,
    dataxID, 
    patch,
    post,
    obtener,
    data,
    obtenerDetalleEgresosxIDMov,
  }
}
