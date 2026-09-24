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
}

// Búsqueda de personas por tipo (colaborador, cliente, ...). Estado local de cada buscador.
export const useBuscarPersona = (idTipo: number) => {
  const [personas, setPersonas] = useState<PersonaBuscada[]>([])

  const buscarPersona = async (q: string, signal?: AbortSignal) => {
    try {
      const { data } = await httpClient.get(`/persona/id_tipo/${idTipo}/search/box`, {
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
