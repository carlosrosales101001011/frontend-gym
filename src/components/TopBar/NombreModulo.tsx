import { useParams } from 'react-router-dom'
import { useNombreModulo } from '@/hook/useNombreModulo'

/** Nombre del módulo actual en el Topbar; mientras carga, un spinner pequeño */
export const NombreModulo = () => {
  const { url_modulo } = useParams()
  const { nombre, cargando } = useNombreModulo(url_modulo)

  if (cargando) {
    return <span className="spinner-border spinner-border-sm topbar__modulo-cargando" role="status" aria-label="Cargando módulo" />
  }
  return <span className="topbar__modulo">{nombre}</span>
}
