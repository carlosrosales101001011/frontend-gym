import httpClient from '@/common/helpers/httpClient'
import type { AjusteFoto } from '@/components/Avatar/encuadreFoto'

/** Id de tipo de persona "cliente" */
const ID_TIPO_CLIENTE = 2

/** Lo que el perfil usa de la persona (GET /persona/id_tipo/2/uid/:uid) */
export type PersonaPerfilProps = {
  id: number
  nombres: string
  apellido_paterno: string
  apellido_materno: string
  email_personal: string
  telefono: string
  uid_avatar?: string
  /** Ubicación de sus comentarios (comentario.uid_location) */
  uid_comentario?: string
  /** Ubicación de sus contactos de emergencia (contacto.uid_location) */
  uid_contactoEmergencia?: string
  /** Ubicación de sus archivos (blob_storage.uid_location) */
  uid_archivos?: string
  url_avatar?: string
  /** Url de la última imagen del avatar en blob_storage ('' si se quitó la foto) */
  url_avatar_ultimo?: string
  /** Encuadre de esa última imagen (null si no tiene foto) */
  avatar_x_ultimo?: number | null
  avatar_y_ultimo?: number | null
  avatar_zoom_ultimo?: number | null
  /** Foto vigente con su encuadre */
  avatar?: ({ id: number } & AjusteFoto) | null
}

/** Persona del perfil: la busca por el uid de la URL (la usan la tarjeta, membresías, ventas y la racha) */
export const usePersonaPerfil = () => {
  /** Persona del perfil, o null si no existe */
  const obtenerPersona = async (uid_person: string): Promise<PersonaPerfilProps | null> => {
    const { data }: { data?: PersonaPerfilProps } = await httpClient.get(`/persona/id_tipo/${ID_TIPO_CLIENTE}/uid/${uid_person}`)
    return data?.id ? data : null
  }

  /** Id del cliente a partir del uid de la URL (null si no existe) */
  const obtenerIdCliente = async (uid_person: string): Promise<number | null> =>
    (await obtenerPersona(uid_person))?.id ?? null

  return { obtenerPersona, obtenerIdCliente }
}
