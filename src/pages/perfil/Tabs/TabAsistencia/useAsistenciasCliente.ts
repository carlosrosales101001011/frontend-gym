import { useState } from 'react'
import httpClient from '@/common/helpers/httpClient'
import type { AvatarPersonaApi } from '@/components/Avatar/PersonaConAvatar'
import { usePersonaPerfil, type PersonaPerfilProps } from '../../hook/usePersonaPerfil'

/** Asistencia de GET /persona-eventos-asistencia/id_persona/:id_persona (solo lo que muestra el perfil) */
export type AsistenciaClienteProps = {
  id: number
  /** Fecha y hora de la marcación (la pone el backend al crear) */
  fecha_registro: string
  /** Quien la registró; null en las registradas antes de guardarlo */
  label_nombres_apellidos_usercreated?: string | null
  avatar_usercreated?: AvatarPersonaApi
}

/**
 * Asistencias de un cliente: primero se busca a la persona por su uid y luego se piden sus asistencias por id_persona
 * (la más reciente primero, lo ordena el backend). También devuelve la persona para poder registrarle una asistencia.
 */
export const useAsistenciasCliente = () => {
  const { obtenerPersona } = usePersonaPerfil()
  const [asistencias, setAsistencias] = useState<AsistenciaClienteProps[]>([])
  const [persona, setPersona] = useState<PersonaPerfilProps | null>(null)
  const [cargando, setCargando] = useState(false)

  const obtenerAsistencias = async (uid_person: string) => {
    setCargando(true)
    try {
      const personaPerfil = await obtenerPersona(uid_person)
      setPersona(personaPerfil)
      if (!personaPerfil) {
        setAsistencias([])
        return
      }
      const { data }: { data: { lista: AsistenciaClienteProps[] } } = await httpClient.get(`/persona-eventos-asistencia/id_persona/${personaPerfil.id}`)
      setAsistencias(data.lista)
    } catch (error) {
      console.log(error)
      setAsistencias([])
    } finally {
      setCargando(false)
    }
  }

  return { asistencias, persona, cargando, obtenerAsistencias }
}
