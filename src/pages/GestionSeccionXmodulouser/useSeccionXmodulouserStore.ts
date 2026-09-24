import { useCrudhook } from "@/hook/usecrudhook"
import { onSetDataSeccionxmodulouser, type SeccionxmodulouserProps } from "@/pages/GestionSeccionXmodulouser/store/seccionxmodulouserSlice"

export const useSeccionXmodulouserStore = () => {
    const { post, obtener, dataxID, obtenerxID, remove, patch } = useCrudhook<SeccionxmodulouserProps>('/seccionxmodulouser', onSetDataSeccionxmodulouser)
  return {
    post,
    obtener,
    dataxID,
    obtenerxID,
    remove,
    patch
  }
}
