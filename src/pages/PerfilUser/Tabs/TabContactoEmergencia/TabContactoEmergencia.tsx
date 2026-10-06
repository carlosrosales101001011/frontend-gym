import { AppContactoEmergencia } from '@/components/GestionContactoEmergencia/AppContactoEmergencia'
import { LoadingOverlay } from '@/components/Loading/LoadingOverlay'
import { useUidPersonaPerfil } from '../../hook/useUidPersonaPerfil'

type TabContactoEmergenciaProps = {
  /** Se recarga cada vez que se activa la pestaña */
  activo: boolean
}

/** Contactos de emergencia del cliente: AppContactoEmergencia los obtiene y gestiona con el uid_contactoEmergencia de la persona */
export const TabContactoEmergencia = ({ activo }: TabContactoEmergenciaProps) => {
  const uidContacto = useUidPersonaPerfil('uid_contactoEmergencia', activo)

  if (!activo) return null
  if (uidContacto === undefined) {
    return <div className="position-relative" style={{ minHeight: 120 }}><LoadingOverlay show interno texto="Cargando contactos" /></div>
  }
  if (!uidContacto) return <p className="small opacity-75 m-3">Esta persona no tiene contactos de emergencia habilitados.</p>

  return (
    <div className="m-3">
      {/* key: al cambiar de persona se monta de nuevo */}
      <AppContactoEmergencia key={uidContacto} uid_location={uidContacto} />
    </div>
  )
}
