import httpClient from '@/common/helpers/httpClient'
import { ID_ESTADO_ACTIVO } from '@/pages/GestionUsuarios/store/usuariosSlice'

/** Usuario que puede administrar quien está logueado (GET /modulo-x-user/usuarios/opciones) */
export type UsuarioActivoProps = {
  id: number
  uuid: string
  nombres: string
  apellidos: string
  usuario?: string | null
  label_rol?: string | null
  id_estado: number
}

/** Usuarios activos que administra quien está logueado (super usuario: todos; los demás: los que registró) */
export const useUsuariosActivos = () => {
  const obtenerUsuariosActivos = async (): Promise<UsuarioActivoProps[]> => {
    const { data } = await httpClient.get('/modulo-x-user/usuarios/opciones')
    return (data as UsuarioActivoProps[]).filter((u) => u.id_estado === ID_ESTADO_ACTIVO)
  }

  return { obtenerUsuariosActivos }
}
