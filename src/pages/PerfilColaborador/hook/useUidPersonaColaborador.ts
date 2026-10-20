import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { PersonaPerfilProps } from '@/pages/perfil/hook/usePersonaPerfil'
import { usePersonaColaborador } from './usePersonaColaborador'

/** Uids de la persona que ubican sus datos relacionados (comentarios, contactos de emergencia, archivos) */
type CampoUid = 'uid_comentario' | 'uid_contactoEmergencia' | 'uid_archivos'

/**
 * Uid del colaborador del perfil (de la URL) que una pestaña pasa a su componente.
 * Se vuelve a pedir cada vez que la pestaña se activa.
 * undefined = cargando; '' = la persona no lo tiene.
 */
export const useUidPersonaColaborador = (campo: CampoUid, activo: boolean) => {
  const { uid_colaborador } = useParams<{ uid_colaborador: string }>()
  const { obtenerPersona } = usePersonaColaborador()
  const [uid, setUid] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (!activo || !uid_colaborador) return
    let vigente = true
    obtenerPersona(uid_colaborador)
      .then((persona: PersonaPerfilProps | null) => { if (vigente) setUid(persona?.[campo] ?? '') })
      .catch(() => { if (vigente) setUid('') })
    return () => { vigente = false }
  }, [activo, uid_colaborador, campo])

  return uid
}
