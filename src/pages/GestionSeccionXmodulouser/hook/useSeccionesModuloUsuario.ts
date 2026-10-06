import Swal from 'sweetalert2'
import httpClient from '@/common/helpers/httpClient'
import { useCrudhook } from '@/hook/usecrudhook'
import { mensajeError } from '@/helpers/mensajeError'
import type { UsuarioModulosProps } from '@/pages/GestionModuloxUsuario/store/modulosUsuarioSlice'
import { onSetUsuariosSecciones, type DetalleSeccionesProps } from '../store/seccionxmodulouserSlice'

/**
 * Secciones por módulo de usuario: la tabla (usuarios que administra quien está logueado, con sus módulos)
 * y lo que usa el modal de secciones de un módulo. El backend valida quién puede y qué secciones puede dar.
 */
export const useSeccionesModuloUsuario = () => {
  const { searcher } = useCrudhook<UsuarioModulosProps>('/modulo-x-user/usuarios', onSetUsuariosSecciones)

  /** Módulo del usuario con sus secciones, el catálogo y las que se pueden dar */
  const obtenerDetalle = async (idModuloUser: number): Promise<DetalleSeccionesProps> => {
    const { data } = await httpClient.get(`/seccion-x-modulouser/modulo-usuario/${idModuloUser}`)
    return data
  }

  /** Deja el módulo del usuario con estas secciones y refresca la tabla. Devuelve true si se guardó */
  const guardarSecciones = async (idModuloUser: number, ids_seccion: number[]) => {
    try {
      await httpClient.put(`/seccion-x-modulouser/modulo-usuario/${idModuloUser}`, { ids_seccion })
      await searcher()
      await Swal.fire({ icon: 'success', title: 'Secciones guardadas', timer: 1500, showConfirmButton: false })
      return true
    } catch (e) {
      await Swal.fire({ icon: 'error', title: 'No se pudieron guardar las secciones', html: mensajeError(e) })
      return false
    }
  }

  return { searcher, obtenerDetalle, guardarSecciones }
}
