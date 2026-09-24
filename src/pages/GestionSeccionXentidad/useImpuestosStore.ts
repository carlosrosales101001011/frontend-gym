import { useCrudhook } from "@/hook/usecrudhook"
import { onSetDataImpuestos, type ImpuestosProps } from "@/pages/GestionSeccionXentidad/store/ImpuestoSlice"

export const useImpuestosStore = () => {
    const { post, obtener, dataxID, obtenerxID, remove, patch } = useCrudhook<ImpuestosProps>('/impuesto', onSetDataImpuestos)
  return {
    post,
    obtener,
    dataxID,
    obtenerxID,
    remove,
    patch
  }
}
