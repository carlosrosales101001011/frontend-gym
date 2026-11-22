/** Ids de id_accion_realizada (user_auditoria) */
export const ACCION_AUDITORIA = { CREATE: 6200, READ: 6201, UPDATE: 6202, DELETE: 6203, LOGIN: 6204 } as const

export type AccionAuditoria = typeof ACCION_AUDITORIA[keyof typeof ACCION_AUDITORIA]

/** Clases de Bootstrap de una acción: fondo del card y fondo + color del ícono */
export type ColoresAuditoria = {
  /** Fondo del card (suave) */
  fondo: string
  /** Fondo del ícono (fuerte) */
  fondoIcono: string
  /** Color del ícono sobre su fondo */
  colorIcono: string
}

/**
 * Colores por acción: creado azul, actualizado amarillo, eliminado rojo.
 * Azul = info: en este tema primary es rojo ($primary: $red).
 */
export const COLORES_AUDITORIA: Record<AccionAuditoria, ColoresAuditoria> = {
  [ACCION_AUDITORIA.CREATE]: { fondo: 'bg-info-subtle', fondoIcono: 'bg-info', colorIcono: 'text-white' },
  [ACCION_AUDITORIA.READ]: { fondo: '', fondoIcono: 'bg-light', colorIcono: 'text-dark' },
  [ACCION_AUDITORIA.UPDATE]: { fondo: 'bg-warning-subtle', fondoIcono: 'bg-warning', colorIcono: 'text-dark' },
  [ACCION_AUDITORIA.DELETE]: { fondo: 'bg-danger-subtle', fondoIcono: 'bg-danger', colorIcono: 'text-white' },
  [ACCION_AUDITORIA.LOGIN]: { fondo: '', fondoIcono: 'bg-secondary', colorIcono: 'text-white' },
}
