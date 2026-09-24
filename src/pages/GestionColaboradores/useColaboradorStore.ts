import { useCrudhook } from "@/hook/usecrudhook"
import { onSetDataColaboradores, type ColaboradorProps } from "@/pages/GestionColaboradores/store/colaboradoresSlice"

export const useColaboradorStore = () => {
    const { post, obtener, patch, obtenerxID, dataxID, remove, searcher } = useCrudhook<ColaboradorProps>('/persona/id_tipo/1', onSetDataColaboradores)
  return {
    remove,
    obtenerxID,
    dataxID, 
    patch,
    post,
    obtener,
    searcher
  }
}
