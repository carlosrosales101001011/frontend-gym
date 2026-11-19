import { useState } from 'react'
import httpClient from '@/common/helpers/httpClient'

export type MiComentarioProps = {
  id: number
  comentario: string
  uid_location: string
  createdAt: string
  updatedAt: string
  /** Persona comentada (la del uid_comentario); null si ya no se encuentra */
  persona: { uid: string, id_tipo: number, nombre: string } | null
}

/** Últimos comentarios que escribió el usuario de la sesión (nube de comentarios del Topbar) */
export const useMisComentarios = () => {
  const [comentarios, setComentarios] = useState<MiComentarioProps[]>([])
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(false)

  const obtenerMisComentarios = async () => {
    try {
      setCargando(true)
      setError(false)
      const { data } = await httpClient.get('/comentario/usuario/mios')
      setComentarios(data as MiComentarioProps[])
    } catch (e) {
      console.log(e)
      setError(true)
    } finally {
      setCargando(false)
    }
  }

  return { comentarios, cargando, error, obtenerMisComentarios }
}
