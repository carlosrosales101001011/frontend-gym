import { groupBy } from '@/helpers/arrays'
import { normalizeText } from '@/helpers/strings'
import type { ModuloDisponibleProps, SeccionDisponibleProps } from '../store/usuariosSlice'

/** Fila de GET /modulo-x-user/user/secciones: una sección del usuario con su módulo y las entidades de la sección */
export type FilaSeccionModuloUser = {
  id_seccion: number
  moduloUser: { id_modulo: number, modulo: { label: string } }
  seccion: { label: string, entidades?: { id_entidad: number }[] }
}

/**
 * Agrupa las secciones del usuario por módulo. Todas las secciones se pueden asignar, tengan o no
 * entidades (las entidades solo definen los permisos CRUD del paso "Entidades").
 * Se agrupa por el id real del módulo (no por el modulo_x_user de quien registra).
 */
export const agruparSeccionesPorModulo = (filas: FilaSeccionModuloUser[]): ModuloDisponibleProps[] =>
  Object.values(groupBy(filas, (fila) => fila.moduloUser.id_modulo)).map((filasModulo) => {
    const { id_modulo, modulo } = filasModulo[0].moduloUser
    // Una sección puede venir repetida si está en más de un modulo_x_user del usuario
    const secciones = new Map<number, SeccionDisponibleProps>(filasModulo.map((fila) => [fila.id_seccion, {
      id_seccion: fila.id_seccion,
      id_modulo,
      label: fila.seccion.label,
      ids_entidad: [...new Set((fila.seccion.entidades ?? []).map((entidad) => entidad.id_entidad))],
    }]))
    return { id_modulo, label: modulo.label, secciones: [...secciones.values()] }
  })

/** Módulos con solo sus secciones que cumplen `incluir` (los módulos que quedan vacíos se quitan) */
export const filtrarSecciones = (modulos: ModuloDisponibleProps[], incluir: (seccion: SeccionDisponibleProps) => boolean) =>
  modulos
    .map((modulo) => ({ ...modulo, secciones: modulo.secciones.filter(incluir) }))
    .filter((modulo) => modulo.secciones.length > 0)

/** true si el label de la sección contiene lo buscado (sin tildes ni mayúsculas) */
export const coincideBusqueda = (seccion: SeccionDisponibleProps, busqueda: string) =>
  normalizeText(seccion.label).includes(normalizeText(busqueda))
