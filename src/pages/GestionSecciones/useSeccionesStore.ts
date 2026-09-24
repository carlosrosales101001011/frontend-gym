import { useCrudhook } from "@/hook/usecrudhook"
import { onSetDataSecciones, type SeccionProps } from "@/pages/GestionSecciones/store/seccionSlice"

export const useSeccionesStore = () => {
    const { post, obtener, dataxID, obtenerxID, remove, patch, searcher } = useCrudhook<SeccionProps>('/seccion', onSetDataSecciones)
  return {
    post,
    obtener,
    dataxID,
    obtenerxID,
    remove,
    patch,
    searcher
  }
}
  