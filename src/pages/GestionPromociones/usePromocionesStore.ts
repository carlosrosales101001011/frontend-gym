import { useCrudhook } from "@/hook/usecrudhook"
import { onSetDataPromociones, type PromocionProps } from "@/pages/GestionPromociones/store/promocionSlice"

export const usePromocionesStore = () => {
    const { post, obtener, dataxID, obtenerxID, remove, patch, searcher } = useCrudhook<PromocionProps>('/promocion', onSetDataPromociones)
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
