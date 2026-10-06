import { useState } from 'react'
import { usePersonaPerfil, type PersonaPerfilProps } from './usePersonaPerfil'

/**
 * Datos de la tarjeta del perfil (nombre, foto, email, teléfono) con carga propia:
 * no depende del store de "Datos personales" ni de otras pestañas.
 */
export const useInfoCliente = () => {
  const { obtenerPersona } = usePersonaPerfil()
  const [persona, setPersona] = useState<PersonaPerfilProps | null>(null)
  const [cargando, setCargando] = useState(false)

  const obtenerInfo = async (uid_person: string) => {
    setCargando(true)
    try {
      setPersona(await obtenerPersona(uid_person))
    } catch (error) {
      console.log(error)
      setPersona(null)
    } finally {
      setCargando(false)
    }
  }

  return { persona, cargando, obtenerInfo }
}
