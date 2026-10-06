import { useEffect, useState } from 'react'
import { useSesionStore } from '@/hook/useSesionStore'

/**
 * Nombre del usuario logueado en el topbar, con su propio skeleton mientras carga.
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
  if (!nombreUsuario) return null
  return <span className="topbar__usuario" title={nombreUsuario}>{nombreUsuario}</span>
}
