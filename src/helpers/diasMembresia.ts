import { addDays, differenceInCalendarDays, isSunday, parseISO } from 'date-fns'

/**
 * Días transcurridos desde la fecha de vencimiento hasta hoy (cuenta domingos).
 * <= 0: la membresía sigue activa; > 0: está vencida hace esos días.
 */
export const diasVencidos = (fecha_vencimiento: string) =>
    differenceInCalendarDays(new Date(), parseISO(fecha_vencimiento))

/** Cuenta los días de (desde, hasta] sin contar los domingos; 0 si hasta <= desde */
const contarDiasSinDomingo = (desde: Date, hasta: Date) => {
    const total = differenceInCalendarDays(hasta, desde)
    let dias = 0
    for (let i = 1; i <= total; i++) {
        if (!isSunday(addDays(desde, i))) dias++
    }
    return dias
}

/** Días de entrenamiento que quedan desde hoy hasta la fecha de vencimiento (sin domingos) */
export const sesionesDisponibles = (fecha_vencimiento: string) =>
    contarDiasSinDomingo(new Date(), parseISO(fecha_vencimiento))
