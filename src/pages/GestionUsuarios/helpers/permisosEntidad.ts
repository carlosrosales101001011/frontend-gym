import type { PermisoEntidadProps } from '../store/usuariosSlice'

/** Estados de cada acción CRUD (terminología) */
export const ESTADO_PERMISO = {
  AUTORIZADO: 2014,
  DENEGADO: 2015,
  /** Necesita pedir permiso */
  PERMISO: 2016,
} as const

/** Acciones que guarda entidad_x_user */
export const ACCIONES_CRUD = [
  { key: 'CREATE', label: 'Crear' },
  { key: 'READ', label: 'Leer' },
  { key: 'UPDATE', label: 'Editar' },
  { key: 'DELETE', label: 'Eliminar' },
] as const

export type AccionCrud = (typeof ACCIONES_CRUD)[number]['key']

export const campoEstado = (accion: AccionCrud) => `id_estado_${accion}` as const

/** Quien registra solo puede otorgar las acciones que él tiene autorizadas; un super usuario, todas */
export const puedeOtorgar = (permisoCreador: PermisoEntidadProps | undefined, accion: AccionCrud, esSuperUsuario = false) =>
  esSuperUsuario || permisoCreador?.[campoEstado(accion)] === ESTADO_PERMISO.AUTORIZADO

/**
 * Permisos iniciales del nuevo usuario, uno por entidad de las secciones asignadas:
 * "Permiso" en lo que quien registra puede otorgar y "Denegado" en lo demás.
 */
export const armarPermisosIniciales = (idsEntidad: number[], permisosCreador: PermisoEntidadProps[], labelEntidad: (idEntidad: number) => string, esSuperUsuario = false): PermisoEntidadProps[] =>
  idsEntidad.map((idEntidad) => {
    const creador = permisosCreador.find((permiso) => permiso.id_entidad === idEntidad)
    const estado = (accion: AccionCrud) => puedeOtorgar(creador, accion, esSuperUsuario) ? ESTADO_PERMISO.PERMISO : ESTADO_PERMISO.DENEGADO
    return {
      id_entidad: idEntidad,
      label_entidad: creador?.label_entidad || labelEntidad(idEntidad),
      id_estado_CREATE: estado('CREATE'),
      id_estado_READ: estado('READ'),
      id_estado_UPDATE: estado('UPDATE'),
      id_estado_DELETE: estado('DELETE'),
    }
  })

/** Acciones de una entidad que quien registra puede otorgar */
export const accionesOtorgables = (permisoCreador: PermisoEntidadProps | undefined, esSuperUsuario = false) =>
  ACCIONES_CRUD.filter(({ key }) => puedeOtorgar(permisoCreador, key, esSuperUsuario)).map(({ key }) => key)

/**
 * Valor de la columna "Todos": el estado común de las acciones otorgables (las bloqueadas no cuentan),
 * "Permiso" si difieren, o "Denegado" si no se puede otorgar ninguna.
 */
export const estadoComun = (permiso: PermisoEntidadProps, acciones: AccionCrud[]) => {
  if (acciones.length === 0) return ESTADO_PERMISO.DENEGADO
  const estados = new Set(acciones.map((accion) => permiso[campoEstado(accion)]))
  return estados.size === 1 ? [...estados][0] : ESTADO_PERMISO.PERMISO
}
