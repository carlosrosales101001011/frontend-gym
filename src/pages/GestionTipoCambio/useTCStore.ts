import { useCrudhook } from "@/hook/usecrudhook"
import { onSetDataTCs, type TCProps } from "@/pages/GestionTipoCambio/store/tipoCambioSlice"

export const useTCStore = () => {
    const { post, obtener, dataxID, obtenerxID, remove, patch, searcher } = useCrudhook<TCProps>('/tipo-cambio', onSetDataTCs)
  return {
    post,
    searcher,
    obtener,
    dataxID,
    obtenerxID,
    remove,
    patch
  }
}
