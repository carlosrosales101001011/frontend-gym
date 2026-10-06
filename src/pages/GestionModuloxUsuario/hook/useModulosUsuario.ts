import Swal from 'sweetalert2'
import httpClient from '@/common/helpers/httpClient'
import { useCrudhook } from '@/hook/usecrudhook'
import { mensajeError } from '@/helpers/mensajeError'
import {
  onSetUsuariosModulos,
  type ModuloProps,
  type ModuloUsuarioProps,
  type UsuarioModulosProps,
} from '../store/modulosUsuarioSlice'

/** Usuario del select del modal */
export type OpcionUsuario = Omit<UsuarioModulosProps, 'modulos'>

/** Módulo que queda asignado al guardar, con las secciones (de las que tiene quien administra) */
export type ModuloAsignado = { id_modulo: number, is_fijado: boolean, is_favorito: boolean, ids_seccion: number[] }

/**
 * Módulos por usuario: la tabla (usuarios que administra quien está logueado, con sus módulos)
 * y lo que usa el modal para asignarlos. El backend valida quién puede y qué módulos puede dar.
 */
export const useModulosUsuario = () => {
  const { searcher } = useCrudhook<UsuarioModulosProps>('/modulo-x-user/usuarios', onSetUsuariosModulos)

  /** Usuarios que puede administrar (select del modal) */
  const obtenerOpcionesUsuarios = async (): Promise<OpcionUsuario[]> => {
    const { data } = await httpClient.get('/modulo-x-user/usuarios/opciones')
    return data
  }

  /** "Mis módulos": los que puede asignar (el super usuario, todos) */
  const obtenerModulosDisponibles = async (): Promise<ModuloProps[]> => {
    const { data } = await httpClient.get('/modulo-x-user/disponibles')
    return data
  }

  /** Módulos activos de un usuario */
  const obtenerModulosDeUsuario = async (idUsuario: number): Promise<ModuloUsuarioProps[]> => {
    const { data } = await httpClient.get(`/modulo-x-user/usuario/${idUsuario}`)
    return data
  }

  /** Deja al usuario con estos módulos y refresca la tabla. Devuelve true si se guardó */
  const guardarModulos = async (idUsuario: number, modulos: ModuloAsignado[]) => {
    try {
      await httpClient.put(`/modulo-x-user/usuario/${idUsuario}`, { modulos })
      await searcher()
      await Swal.fire({ icon: 'success', title: 'Módulos guardados', timer: 1500, showConfirmButton: false })
      return true
    } catch (e) {
      await Swal.fire({ icon: 'error', title: 'No se pudieron guardar los módulos', html: mensajeError(e) })
      return false
    }
  }

  return {
    searcher,
    obtenerOpcionesUsuarios,
    obtenerModulosDisponibles,
    obtenerModulosDeUsuario,
    guardarModulos,
  }
}
