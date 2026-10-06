import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { usePersonaPerfil, type PersonaPerfilProps } from './usePersonaPerfil'

/** Uids de la persona que ubican sus datos relacionados (comentarios, contactos de emergencia) */
type CampoUid = 'uid_comentario' | 'uid_contactoEmergencia' | 'uid_archivos'

/**
 * Uid de la persona del perfil (de la URL) que una pestaña pasa a su componente.
 * Se vuelve a pedir cada vez que la pestaña se activa.
 * undefined = cargando; '' = la persona no lo tiene.
 */
export const useUidPersonaPerfil = (campo: CampoUid, activo: boolean) => {
  const { uid_person } = useParams<{ uid_person: string }>()
  const { obtenerPersona } = usePersonaPerfil()
  const [uid, setUid] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (!activo || !uid_person) return
    let vigente = true
    obtenerPersona(uid_person)
      .then((persona: PersonaPerfilProps | null) => { if (vigente) setUid(persona?.[campo] ?? '') })
      .catch(() => { if (vigente) setUid('') })
    return () => { vigente = false }
  }, [activo, uid_person, campo])

  return uid
}
