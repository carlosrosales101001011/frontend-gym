import Swal from "sweetalert2";
import httpClient from "@/common/helpers/httpClient";
import { useCrudhook } from "@/hook/usecrudhook";
import { useAppDispatch, useAppSelector } from "@/stores/Store";
import { mensajeError } from "@/helpers/mensajeError";
import {
  onResetRegistro,
  onSetDataUsers,
  onSetModulosDisponibles,
  onSetOpcionesEmpleados,
  onSetPermisosCreador,
  onSetSeccionesAsignadas,
  onSetUser,
  type PermisoEntidadProps,
  type UserProps,
} from "../store/usuariosSlice";
import { agruparSeccionesPorModulo, type FilaSeccionModuloUser } from "../helpers/seccionesPorModulo";

/** Colaborador (persona id_tipo 1) para el select "Empleado" */
type ColaboradorProps = {
  id: number;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
}

/** Fila de GET /entidad-x-user/user/all */
type EntidadUserBackend = Omit<PermisoEntidadProps, 'label_entidad'> & { entidad?: { valor: string } }

/** Fila creada por POST /modulo-x-user/bulk */
type ModuloUserBackend = { id: number, id_modulo: number }

export const useGestionUsuariosStore = () => {
  const dispatch = useAppDispatch()
  const { user, idsSeccionAsignadas, modulosDisponibles, permisosCreador, opcionesEmpleados } = useAppSelector((state) => state.USER)
  const { searcher } = useCrudhook<UserProps>('/user', onSetDataUsers)
  const { obtenerAll: obtenerColaboradoresApi } = useCrudhook<ColaboradorProps>('/persona/id_tipo/1')

  const obtenerOpcionesEmpleados = async () => {
    try {
      const data = await obtenerColaboradoresApi()
      dispatch(onSetOpcionesEmpleados(data.lista.map((persona: ColaboradorProps) => ({
        value: persona.id,
        label: [persona.nombres, persona.apellido_paterno, persona.apellido_materno].filter(Boolean).join(' '),
      }))))
    } catch (error) {
      console.log(error);
    }
  }

  /** Módulos, secciones y permisos de quien registra: es lo máximo que puede darle al nuevo usuario */
  const obtenerAccesosCreador = async () => {
    try {
      const [respuestaSecciones, respuestaEntidades] = await Promise.all([
        httpClient.get('/modulo-x-user/user/secciones'),
        httpClient.get('/entidad-x-user/user/all'),
      ])
      const secciones: FilaSeccionModuloUser[] = respuestaSecciones.data
      const entidades: EntidadUserBackend[] = respuestaEntidades.data
      dispatch(onSetModulosDisponibles(agruparSeccionesPorModulo(secciones)))
      dispatch(onSetPermisosCreador(entidades.map(({ entidad, ...permiso }) => ({
        id_entidad: permiso.id_entidad,
        label_entidad: entidad?.valor ?? '',
        id_estado_CREATE: permiso.id_estado_CREATE,
        id_estado_READ: permiso.id_estado_READ,
        id_estado_UPDATE: permiso.id_estado_UPDATE,
        id_estado_DELETE: permiso.id_estado_DELETE,
      }))))
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Registra el usuario con sus accesos, en orden: usuario → módulos → secciones de cada módulo → permisos.
   * Los módulos salen de las secciones asignadas. Devuelve true si se guardó (y refresca la tabla).
   */
  const guardarUsuario = async (permisos: PermisoEntidadProps[]) => {
    try {
      // id_userParent no se envía: el backend lo toma del token de quien registra
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id_userParent, ...datosUsuario } = user
      const { data: usuario }: { data?: UserProps } = await httpClient.post('/user/register', { ...datosUsuario, fecha_creacion: new Date() })
      if (!usuario?.id) throw 'No se pudo registrar el usuario'
      const id_user = usuario.id

      const secciones = modulosDisponibles
        .flatMap((modulo) => modulo.secciones)
        .filter((seccion) => idsSeccionAsignadas.includes(seccion.id_seccion))
      const idsModulo = [...new Set(secciones.map((seccion) => seccion.id_modulo))]

      const { data: modulosUser }: { data: ModuloUserBackend[] } = await httpClient.post('/modulo-x-user/bulk',
        idsModulo.map((id_modulo) => ({ id_user, id_modulo, is_fijado: false, is_favorito: false })))
      await httpClient.post('/seccion-x-modulouser/bulk', secciones.map((seccion) => ({
        id_modulouser: modulosUser.find((moduloUser) => moduloUser.id_modulo === seccion.id_modulo)?.id,
        id_seccion: seccion.id_seccion,
      })))
      if (permisos.length > 0) {
        await httpClient.post('/entidad-x-user/bulk', permisos.map((permiso) => ({
          id_user,
          id_entidad: permiso.id_entidad,
          id_estado_CREATE: permiso.id_estado_CREATE,
          id_estado_READ: permiso.id_estado_READ,
          id_estado_UPDATE: permiso.id_estado_UPDATE,
          id_estado_DELETE: permiso.id_estado_DELETE,
        })))
      }

      dispatch(onResetRegistro())
      await searcher()
      await Swal.fire({ icon: 'success', title: 'Usuario registrado', timer: 1500, showConfirmButton: false })
      return true
    } catch (e) {
      await Swal.fire({ icon: 'error', title: 'No se pudo registrar el usuario', html: mensajeError(e) })
      return false
    }
  }

  return {
    user,
    idsSeccionAsignadas,
    modulosDisponibles,
    permisosCreador,
    opcionesEmpleados,
    searcher,
    obtenerOpcionesEmpleados,
    obtenerAccesosCreador,
    guardarUsuario,
    guardarInformacion: (data: UserProps) => dispatch(onSetUser(data)),
    asignarSecciones: (ids: number[]) => dispatch(onSetSeccionesAsignadas(ids)),
    resetRegistro: () => dispatch(onResetRegistro()),
  }
}
