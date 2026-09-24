import httpClient from "@/common/helpers/httpClient"
import { useCrudhook } from "@/hook/usecrudhook"
import { useAppDispatch } from "@/stores/Store"
import { onSetDataOpcionesGruposFinanzas, onSetDataTermFinanzas, type grupoFinanzaProps, type TermFinanzasProps } from "@/pages/GestionTerminologiaFinanzas/store/TermFinanzasSlice"

export const useTermFinanzasStore = () => {
  const dispatch = useAppDispatch()
    const { post, obtener, dataxID, obtenerxID, remove, patch } = useCrudhook<TermFinanzasProps>('/terminologia-gasto', onSetDataTermFinanzas)
        const { obtener:obtenerGruposFinanzas } = useCrudhook<grupoFinanzaProps>('/terminologia-grupo-movimiento')
    const obtenerTermFinanzas = async()=>{
      try {
        const {data} = await httpClient.get('/terminologia-gasto/search')
        console.log({esta: data});
        
        dispatch(onSetDataTermFinanzas(data))
      } catch (error) {
        console.log(error);
      }
    }
    const obtenerOpGruposFinanzas = async()=>{
      try {
        const data = await obtenerGruposFinanzas()
        dispatch(onSetDataOpcionesGruposFinanzas(data.lista.map((grupo:grupoFinanzaProps)=>({value:grupo.id, label:grupo.nombre}))))
      } catch (error) {
        console.log(error);
      }
    }
    const postTermFinanzas = async(data: TermFinanzasProps)=>{
      try {
        await httpClient.post('/terminologia-gasto/', data)
        await obtenerTermFinanzas()
      } catch (error) {
        console.log(error);
      }
    }
  return {
    post,
    obtener,
    dataxID,
    obtenerxID,
    remove,
    patch,
    obtenerTermFinanzas,
    postTermFinanzas,
    obtenerOpGruposFinanzas
  }
}
