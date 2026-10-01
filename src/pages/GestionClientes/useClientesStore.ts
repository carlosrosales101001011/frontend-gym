import httpClient from "@/common/helpers/httpClient"
import { useCrudhook } from "@/hook/usecrudhook"
import { useBlobStorage } from "@/hook/useBlobStorage"
import type { AjusteFoto } from "@/components/Avatar/encuadreFoto"
import { onSetDataClientes, type ClienteProps } from "@/pages/GestionClientes/store/clientesSlice"

export const useClientesStore = () => {
    const { post, obtener, patch, obtenerxID, dataxID, remove, searcher } = useCrudhook<ClienteProps>('/persona/id_tipo/2', onSetDataClientes)
    const blobStorage = useBlobStorage()

    /** Sube la foto al Azure Blob Storage; devuelve el id del registro de la imagen (para su encuadre) */
    const subirAvatar = async (uid_avatar: string, archivo: File) => {
      const formData = new FormData()
      formData.append('file', archivo)
      const { data }: { data: { id_blob?: number } } = await httpClient.post(`/persona/avatar/${uid_avatar}`, formData)
      return data?.id_blob
    }

    /** Guarda dónde va el círculo de la foto (x, y, zoom); el archivo no cambia */
    const guardarAjusteAvatar = async (idBlob: number, ajuste: AjusteFoto) => {
      await blobStorage.put(idBlob, ajuste)
    }

    /** Quita la foto de la persona */
    const eliminarAvatar = async (uid_avatar: string) => {
      await httpClient.delete(`/persona/avatar/${uid_avatar}`)
    }

  return {
    remove,
    obtenerxID,
    dataxID,
    patch,
    post,
    obtener,
    searcher,
    subirAvatar,
    guardarAjusteAvatar,
    eliminarAvatar,
  }
}
