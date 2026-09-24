import { useCrudhook } from "@/hook/usecrudhook"
import { onSetDataProveedores, type ProveedorProps } from "@/pages/GestionProveedores/store/proveedorSlice"

export const useProveedoresStore = () => {
    const { post, obtener, dataxID, obtenerxID, remove, patch } = useCrudhook<ProveedorProps>('/persona/id_tipo/3', onSetDataProveedores)
  return {
    post,
    obtener,
    dataxID,
    obtenerxID,
    remove,
    patch
  }
}
