import { useCrudhook } from "@/hook/usecrudhook"
import { onSetDataImpuestos, type ImpuestosProps } from "@/pages/GestionImpuestos/store/ImpuestoSlice"

export const useImpuestosStore = () => {
    const { post, obtener, dataxID, obtenerxID, remove, patch, searcher } = useCrudhook<ImpuestosProps>('/impuesto', onSetDataImpuestos)
  return {
    searcher,
    post,
    obtener,
    dataxID,
    obtenerxID,
    remove,
    patch
  }
}
