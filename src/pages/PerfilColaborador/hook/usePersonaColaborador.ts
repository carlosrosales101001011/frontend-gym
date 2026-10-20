import httpClient from '@/common/helpers/httpClient'
import type { PersonaPerfilProps } from '@/pages/perfil/hook/usePersonaPerfil'

/** Id de tipo de persona "colaborador" */
export const ID_TIPO_COLABORADOR = 1

/** Persona del perfil del colaborador: la busca por el uid de la URL (la usan la tarjeta y las pestañas) */
export const usePersonaColaborador = () => {
  /** Colaborador del perfil, o null si no existe (mismos campos que el perfil del cliente) */
  const obtenerPersona = async (uid_colaborador: string): Promise<PersonaPerfilProps | null> => {
    const { data }: { data?: PersonaPerfilProps } = await httpClient.get(`/persona/id_tipo/${ID_TIPO_COLABORADOR}/uid/${uid_colaborador}`)
    return data?.id ? data : null
  }

  return { obtenerPersona }
}
