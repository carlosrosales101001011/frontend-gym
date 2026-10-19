import { diaEnCurso } from '@/helpers/diasMembresia'
import type { SeguimientoMembresiaProps } from '../store/seguimientoMembresiaSlice'

/** Extensión en curso hoy (congelamiento o regalo) con su día actual y total; null si no hay */
export const extensionEnCurso = (row: SeguimientoMembresiaProps) => {
    if (!(row.es_congelado || row.es_regalo) || !row.fecha_inicio_extension_actual || !row.dias_extension_actual) return null
    const total = row.dias_extension_actual
    return {
        tipo: row.es_congelado ? 'congelamiento' : 'regalo',
        // Un regalo termina el día después de su último día: no pasar del total
        dia: Math.min(Math.max(diaEnCurso(row.fecha_inicio_extension_actual), 1), total),
        total,
    }
}
