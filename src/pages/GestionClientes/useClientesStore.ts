import { useCrudhook } from "@/hook/usecrudhook"
import { onSetDataClientes, type ClienteProps } from "@/pages/GestionClientes/store/clientesSlice"

export const useClientesStore = () => {
    const { post, obtener, patch, obtenerxID, dataxID, remove, searcher } = useCrudhook<ClienteProps>('/persona/id_tipo/2', onSetDataClientes)
  return {
    remove,
    obtenerxID,
    dataxID,
    patch,
    post,
    obtener,
    searcher
  }
}
