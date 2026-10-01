import { useState } from 'react'
import httpClient from '@/common/helpers/httpClient'

export type PersonaBuscada = {
  id: number
  nombres: string
  apellido_paterno: string
  apellido_materno: string
  numero_documento: string
  email_personal: string
  telefono: string
  url_avatar?: string
  /** Url de la última imagen del avatar en blob_storage ('' si se quitó la foto) */
  url_avatar_ultimo?: string
  /** Encuadre de esa última imagen (null si no tiene foto) */
  avatar_x_ultimo?: number | null
  avatar_y_ultimo?: number | null
  avatar_zoom_ultimo?: number | null
  /** 1 = colaborador, 2 = cliente */
  id_tipo?: number
}

// Búsqueda de personas por tipo (colaborador, cliente, ...); sin idTipo busca en todas. Estado local de cada buscador.
export const useBuscarPersona = (idTipo?: number) => {
  const [personas, setPersonas] = useState<PersonaBuscada[]>([])

  const buscarPersona = async (q: string, signal?: AbortSignal) => {
    try {
      const url = idTipo ? `/persona/id_tipo/${idTipo}/search/box` : '/persona/search/box'
      const { data } = await httpClient.get(url, {
        params: { q },
        signal,
      })
      setPersonas(data.items)
    } catch (error) {
      if (!signal?.aborted) console.log(error)
    }
  }

  return { personas, buscarPersona }
}
