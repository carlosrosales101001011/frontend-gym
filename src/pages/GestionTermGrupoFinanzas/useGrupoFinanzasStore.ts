import { useCrudhook } from "@/hook/usecrudhook"
import { onSetDataImpuestos, type grupoFinanzaProps } from "@/pages/GestionTermGrupoFinanzas/store/grupoFinanzasSlice"

export const useGrupoFinanzasStore = () => {
    const { post, obtener, dataxID, obtenerxID, remove, patch } = useCrudhook<grupoFinanzaProps>('/terminologia-grupo-movimiento', onSetDataImpuestos)

    return {
    post,
    obtener,
    dataxID,
    obtenerxID,
    remove,
    patch
  }
}
