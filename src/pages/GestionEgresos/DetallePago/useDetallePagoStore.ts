import { useCrudhook } from "@/hook/usecrudhook"
import { onSetDataDetallesGastoPago, type DetallePagoProps } from "@/pages/GestionEgresos/DetallePago/store/detallePagoSlice"
import httpClient from "@/common/helpers/httpClient"
import { useDispatch } from "react-redux"
export const useDetallePagoStore = () => {
    const dispatch = useDispatch()
    const { post, data, obtener, patch, obtenerxID, dataxID, remove } = useCrudhook<DetallePagoProps>('/detallepago-gasto', onSetDataDetallesGastoPago)
    const obtenerDetallePagosxIDMov = async(id_movimiento_financiero: number)=>{
          try {
            const {data} = await httpClient.get(`/detallepago-gasto/id_movimiento_financiero/${id_movimiento_financiero}`)
            dispatch(onSetDataDetallesGastoPago(data))
          } catch (error) {
            console.log(error);
          }
        }
  return {
    post,
    data,
    obtener,
    patch,
    obtenerxID,
    dataxID,
    remove,
    obtenerDetallePagosxIDMov,
  }
}
