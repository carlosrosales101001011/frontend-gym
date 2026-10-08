import httpClient from "@/common/helpers/httpClient"
import { useCrudhook } from "@/hook/usecrudhook"
import { useBlobStorage } from "@/hook/useBlobStorage"
import type { AjusteFoto } from "@/components/Avatar/encuadreFoto"
import type { ContactoEmergenciaForm } from "@/components/GestionContactoEmergencia/useContactoEmergenciaStore"
import { onSetDataClientes, type ClienteProps } from "@/pages/GestionClientes/store/clientesSlice"

export const useClientesStore = () => {
    const { post, obtener, patch, obtenerxID, dataxID, remove, searcher } = useCrudhook<ClienteProps>('/persona/id_tipo/2', onSetDataClientes)
    const blobStorage = useBlobStorage()

    /**
     * ¿Ya hay un cliente con ese tipo y número de documento? excluirId: al editar, el propio cliente no cuenta.
     * Devuelve el nombre del cliente que lo tiene, o null si está libre.
     */
    const buscarDocumentoRepetido = async (id_tipo_documento: number, numero_documento: string, excluirId?: number) => {
      const { data }: { data: { existe: boolean, persona: { nombres: string, apellido_paterno: string, apellido_materno: string } | null } } =
        await httpClient.get('/persona/id_tipo/2/documento', {
          params: { id_tipo_documento, numero_documento, ...(excluirId ? { excluir_id: excluirId } : {}) },
        })
      return data.existe && data.persona
        ? [data.persona.nombres, data.persona.apellido_paterno, data.persona.apellido_materno].filter(Boolean).join(' ')
        : null
    }

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

    /** Guarda los contactos de emergencia de una persona recién creada (uid_location = su uid_contactoEmergencia) */
    const guardarContactosEmergencia = async (uid_contactoEmergencia: string, contactos: ContactoEmergenciaForm[]) => {
      await Promise.all(contactos.map((contacto) => httpClient.post(`/contacto-emergencia/${uid_contactoEmergencia}`, contacto)))
    }

    /** Guarda el primer comentario de una persona recién creada (uid_location = su uid_comentario); el autor sale del token */
    const guardarPrimerComentario = async (uid_comentario: string, comentario: string) => {
      await httpClient.post('/comentario', { uid_location: uid_comentario, comentario })
    }

  return {
    buscarDocumentoRepetido,
    remove,
    guardarContactosEmergencia,
    guardarPrimerComentario,
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
