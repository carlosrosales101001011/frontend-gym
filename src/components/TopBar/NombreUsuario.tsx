import { useEffect, useState } from 'react'
import { useSesionStore } from '@/hook/useSesionStore'

/**
 * @usuario del usuario logueado en el topbar (si no tiene usuario, su nombre), con su propio skeleton mientras carga.
 * Si la sesión aún no está en el store (se entró directo a un módulo), la pide.
 */
export const NombreUsuario = () => {
  const { usuario, nombreUsuario, obtenerUsuarioSesion } = useSesionStore()
  // Solo se pide si no hay usuario: arranca cargando en ese caso
  const [cargando, setCargando] = useState(!usuario)

  useEffect(() => {
    if (usuario) return
    obtenerUsuarioSesion().finally(() => setCargando(false))
  }, [])

  if (cargando && !usuario) {
    return <span className="skeleton-cr topbar__usuario-skeleton" aria-label="Cargando usuario" />
  }
  const texto = usuario?.usuario ? `@${usuario.usuario}` : nombreUsuario
  if (!texto) return null
  return <span className="topbar__usuario" title={nombreUsuario}>{texto}</span>
}
