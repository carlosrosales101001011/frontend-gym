import { differenceInCalendarDays, parseISO, subDays } from 'date-fns'

/**
 * Días transcurridos desde la fecha de vencimiento hasta hoy (cuenta domingos).
 * <= 0: la membresía sigue activa; > 0: está vencida hace esos días.
 */
export const diasVencidos = (fecha_vencimiento: string) =>
    differenceInCalendarDays(new Date(), parseISO(fecha_vencimiento))

/** Días calendario de la membresía, de su inicio a su vencimiento (ambos incluidos; ej. 1 al 31 de octubre = 31) */
export const diasMembresia = (fecha_inicio: string, fecha_vencimiento: string) =>
    differenceInCalendarDays(parseISO(fecha_vencimiento), parseISO(fecha_inicio)) + 1

/** Día en curso de una extensión (congelamiento / regalo) que empezó en fecha_inicio: el primer día es 1 */
export const diaEnCurso = (fecha_inicio: string) =>
    differenceInCalendarDays(new Date(), parseISO(fecha_inicio)) + 1

/**
 * Días de entrenamiento que quedan hasta la fecha de vencimiento (incluida; cuenta domingos).
 * Si la membresía aún no empieza (fecha_inicio futura) se cuentan desde su inicio y no desde hoy,
 * así coincide con diasMembresia; 0 si ya venció.
 */
export const sesionesDisponibles = (fecha_vencimiento: string, fecha_inicio?: string | null) => {
    const hoy = new Date()
    const inicio = fecha_inicio ? subDays(parseISO(fecha_inicio), 1) : hoy
    const desde = inicio > hoy ? inicio : hoy
    return Math.max(differenceInCalendarDays(parseISO(fecha_vencimiento), desde), 0)
}
