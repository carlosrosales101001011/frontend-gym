import { AppArchivos } from '@/components/Archivos/AppArchivos'
import { LoadingOverlay } from '@/components/Loading/LoadingOverlay'
import { useUidPersonaPerfil } from '../../hook/useUidPersonaPerfil'

type TabArchivosProps = {
  /** Se recarga cada vez que se activa la pestaña */
  activo: boolean
}

/** Archivos del cliente: AppArchivos los muestra en tarjetas, sube y elimina con el uid_archivos de la persona */
export const TabArchivos = ({ activo }: TabArchivosProps) => {
  const uidArchivos = useUidPersonaPerfil('uid_archivos', activo)

  if (!activo) return null
  if (uidArchivos === undefined) {
    return <div className="position-relative" style={{ minHeight: 120 }}><LoadingOverlay show interno texto="Cargando archivos" /></div>
  }
  if (!uidArchivos) return <p className="small opacity-75 m-3">Esta persona no tiene archivos habilitados.</p>

  return (
    <div className="m-3">
      {/* key: al cambiar de persona se monta de nuevo */}
      <AppArchivos key={uidArchivos} uid_location={uidArchivos} />
    </div>
  )
}
