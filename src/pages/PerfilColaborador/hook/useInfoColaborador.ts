import { useState } from 'react'
import type { PersonaPerfilProps } from '@/pages/perfil/hook/usePersonaPerfil'
import { usePersonaColaborador } from './usePersonaColaborador'

/**
 * Datos de la tarjeta del perfil (nombre, foto, email, teléfono) con carga propia:
 * no depende del store de "Datos personales" ni de otras pestañas.
 */
export const useInfoColaborador = () => {
  const { obtenerPersona } = usePersonaColaborador()
  const [persona, setPersona] = useState<PersonaPerfilProps | null>(null)
  const [cargando, setCargando] = useState(false)

  const obtenerInfo = async (uid_colaborador: string) => {
    setCargando(true)
    try {
      setPersona(await obtenerPersona(uid_colaborador))
    } catch (error) {
      console.log(error)
      setPersona(null)
    } finally {
      setCargando(false)
    }
  }

  return { persona, cargando, obtenerInfo }
}
