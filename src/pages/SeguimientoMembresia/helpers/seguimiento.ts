import { diaEnCurso } from '@/helpers/diasMembresia'
import type { SeguimientoMembresiaProps } from '../store/seguimientoMembresiaSlice'

/**
 * Solo la última membresía de cada cliente: el seguimiento más reciente (mayor id), como findUltimaActivaByIdCli
 * del backend. Los seguimientos sin cliente se dejan tal cual.
 */
export const ultimaMembresiaPorCliente = (seguimientos: SeguimientoMembresiaProps[]) => {
    const ultimas = new Map<number, SeguimientoMembresiaProps>()
    const sinCliente: SeguimientoMembresiaProps[] = []
    for (const s of seguimientos) {
        if (!s.id_cli) { sinCliente.push(s); continue }
        const actual = ultimas.get(s.id_cli)
        if (!actual || (s.id ?? 0) > (actual.id ?? 0)) ultimas.set(s.id_cli, s)
    }
    return [...ultimas.values(), ...sinCliente]
}

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
