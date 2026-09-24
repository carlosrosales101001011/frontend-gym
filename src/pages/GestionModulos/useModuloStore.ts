import { useCrudhook } from "@/hook/usecrudhook"
import { onSetDataModulos, type ModuloProps } from "@/pages/GestionModulos/store/moduloSlice"

export const useModuloStore = () => {
    const { post, obtener, dataxID, obtenerxID, remove, patch, searcher } = useCrudhook<ModuloProps>('/modulo', onSetDataModulos)
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
