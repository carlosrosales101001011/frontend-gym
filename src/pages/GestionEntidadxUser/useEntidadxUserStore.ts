import { useCrudhook } from "@/hook/usecrudhook"
import { onSetDataEntidadesxUser, type EntidadxUserProps } from "@/pages/GestionEntidadxUser/store/entidadxuserSlice"

export const useEntidadxUserStore = () => {
    const { post, obtener, dataxID, obtenerxID, remove, patch } = useCrudhook<EntidadxUserProps>('/entidadxuser', onSetDataEntidadesxUser)
  return {
    post,
    obtener,
    dataxID,
    obtenerxID,
    remove,
    patch
  }
}
