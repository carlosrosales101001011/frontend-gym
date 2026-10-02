import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ContainerComentarios } from '@/components/Comentario/ContainerComentarios'
import { LoadingOverlay } from '@/components/Loading/LoadingOverlay'
import { usePersonaPerfil } from '../../hook/usePersonaPerfil'

type TabComentariosProps = {
  /** Se recarga cada vez que se activa la pestaña */
  activo: boolean
}

/** Comentarios del cliente: ContainerComentarios los obtiene y agrega con el uid_comentario de la persona */
export const TabComentarios = ({ activo }: TabComentariosProps) => {
  const { uid_person } = useParams<{ uid_person: string }>()
  const { obtenerPersona } = usePersonaPerfil()
  // undefined = cargando; '' = la persona no tiene uid_comentario
  const [uidComentario, setUidComentario] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (!activo || !uid_person) return
    let vigente = true
    obtenerPersona(uid_person)
      .then((persona) => { if (vigente) setUidComentario(persona?.uid_comentario ?? '') })
      .catch(() => { if (vigente) setUidComentario('') })
    return () => { vigente = false }
  }, [activo, uid_person])

  if (!activo) return null
  if (uidComentario === undefined) {
    return <div className="position-relative" style={{ minHeight: 120 }}><LoadingOverlay show interno texto="Cargando comentarios" /></div>
  }
  if (!uidComentario) return <p className="small opacity-75 m-3">Esta persona no tiene comentarios habilitados.</p>

  return (
    <div className="m-3">
      {/* key: al cambiar de persona se monta de nuevo (formulario y lista limpios) */}
      <ContainerComentarios key={uidComentario} uid_location={uidComentario} />
    </div>
  )
}
