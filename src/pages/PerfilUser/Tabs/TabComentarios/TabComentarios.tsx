import { ContainerComentarios } from '@/components/Comentario/ContainerComentarios'
import { LoadingOverlay } from '@/components/Loading/LoadingOverlay'
import { useUidPersonaPerfil } from '../../hook/useUidPersonaPerfil'

type TabComentariosProps = {
  /** Se recarga cada vez que se activa la pestaña */
  activo: boolean
}

/** Comentarios del cliente: ContainerComentarios los obtiene y agrega con el uid_comentario de la persona */
export const TabComentarios = ({ activo }: TabComentariosProps) => {
  const uidComentario = useUidPersonaPerfil('uid_comentario', activo)

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
