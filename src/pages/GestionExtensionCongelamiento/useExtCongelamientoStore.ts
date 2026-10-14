import { useCrudhook } from "@/hook/usecrudhook"
import { useAppSelector } from "@/stores/Store"
import { onSetDataExtCongelamientos, type ExtCongelamientoProps } from "@/pages/GestionExtensionCongelamiento/store/extCongelamientoSlice"

/** Solo lectura: todos los congelamientos registrados (se crean desde el perfil del cliente) */
export const useExtCongelamientoStore = () => {
    const { extCongelamientos } = useAppSelector((state) => state.EXT_CONGELAMIENTO)
    // searcher => GET /membresia-extension/congelamientos/search
    const { searcher } = useCrudhook<ExtCongelamientoProps>('/membresia-extension/congelamientos', onSetDataExtCongelamientos)

  return {
    extCongelamientos,
    searcher,
  }
}
