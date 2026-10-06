import Swal from 'sweetalert2'
import httpClient from '@/common/helpers/httpClient'
import { mensajeError } from '@/helpers/mensajeError'
import { payloadDatosPersonales } from '@/helpers/payloadDatosPersonales'
import type { AjusteFoto } from '@/components/Avatar/encuadreFoto'
import type { ModuloUsuarioProps } from '@/pages/GestionModuloxUsuario/store/modulosUsuarioSlice'

/** Id de tipo de persona "colaborador" */
export const ID_TIPO_COLABORADOR = 1

/** Datos de sistema del usuario (users), sin la contraseña */
export type UsuarioSistemaProps = {
  id: number
  uuid: string
  nombres: string
  apellidos: string
  usuario?: string | null
  email?: string | null
  email_corporativo?: string | null
  telefono?: string
  id_rol?: number | null
  label_rol?: string | null
  /** Colaborador vinculado (persona id_tipo 1); 0 = sin colaborador */
  id_empl: number
  id_estado: number
  is_super_user: boolean
  label_nombres_apellidos_userParent?: string | null
}

/** Persona colaborador vinculada al usuario (lo que usa el perfil) */
export type ColaboradorUsuarioProps = {
  id: number
  uid: string
  nombres: string
  apellido_paterno: string
  apellido_materno: string
  email_personal?: string
  telefono?: string
  uid_avatar?: string
  uid_comentario?: string
  uid_contactoEmergencia?: string
  uid_archivos?: string
  url_avatar_ultimo?: string
  avatar_x_ultimo?: number | null
  avatar_y_ultimo?: number | null
  avatar_zoom_ultimo?: number | null
  avatar?: ({ id: number } & AjusteFoto) | null
  // Datos personales (pestaña Datos)
  fecha_nacimiento?: string
  numero_documento?: string
  direccion?: string
  email_corporativo?: string
  id_genero?: number | string
  id_estado_civil?: number | string
  id_tipo_documento?: number | string
  id_distrito?: number | string
}

/** GET /user/perfil/:uuid */
export type PerfilUsuarioProps = {
  usuario: UsuarioSistemaProps
  colaborador: ColaboradorUsuarioProps | null
  /** Quien lo registró o un super usuario */
  puedeEditar: boolean
  /** Solo un super usuario (y no sobre sí mismo) */
  puedeMarcarSuper: boolean
}

/** Lo que se cambia en "Datos Sistema"; lo que no viene no se toca */
export type CambiosSistema = { is_super_user?: boolean, id_rol?: number, id_empl?: number }

/** Opción del select de colaboradores */
export type OpcionColaborador = { value: number, label: string }

/** Llamadas del perfil de usuario: el perfil, sus datos de sistema, los datos de su colaborador y sus módulos */
export const usePerfilUsuario = () => {
  const obtenerPerfil = async (uuid: string): Promise<PerfilUsuarioProps> => {
    const { data } = await httpClient.get(`/user/perfil/${uuid}`)
    return data
  }

  /** Guarda super usuario, rol y colaborador. Avisa el resultado; devuelve true si se guardó */
  const actualizarSistema = async (idUsuario: number, cambios: CambiosSistema) => {
    try {
      await httpClient.patch(`/user/id/${idUsuario}/sistema`, cambios)
      await Swal.fire({ icon: 'success', title: 'Datos de sistema actualizados', timer: 1500, showConfirmButton: false })
      return true
    } catch (e) {
      await Swal.fire({ icon: 'error', title: 'No se pudieron actualizar los datos de sistema', html: mensajeError(e) })
      return false
    }
  }

  /** Guarda los datos personales del colaborador vinculado. Avisa el resultado; devuelve true si se guardó */
  const actualizarDatosColaborador = async (idPersona: number, datos: Record<string, unknown>) => {
    try {
      await httpClient.patch(`/persona/id_tipo/${ID_TIPO_COLABORADOR}/id/${idPersona}`, payloadDatosPersonales(datos))
      await Swal.fire({ icon: 'success', title: 'Datos actualizados', timer: 1500, showConfirmButton: false })
      return true
    } catch (e) {
      await Swal.fire({ icon: 'error', title: 'No se pudieron actualizar los datos', html: mensajeError(e) })
      return false
    }
  }

  /** Colaboradores para el select "Empleado" */
  const obtenerColaboradores = async (): Promise<OpcionColaborador[]> => {
    const { data } = await httpClient.get(`/persona/id_tipo/${ID_TIPO_COLABORADOR}`)
    return (data.lista ?? []).map((p: { id: number, nombres: string, apellido_paterno: string, apellido_materno: string }) => ({
      value: p.id,
      label: [p.nombres, p.apellido_paterno, p.apellido_materno].filter(Boolean).join(' '),
    }))
  }

  /** Módulos del usuario con sus secciones (el backend solo deja a quien lo administra) */
  const obtenerModulos = async (idUsuario: number): Promise<ModuloUsuarioProps[]> => {
    const { data } = await httpClient.get(`/modulo-x-user/usuario/${idUsuario}`)
    return data
  }

  return { obtenerPerfil, actualizarSistema, actualizarDatosColaborador, obtenerColaboradores, obtenerModulos }
}
