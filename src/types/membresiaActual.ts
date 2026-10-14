/** GET /membresia-seguimiento/id_cli/:id_cli/resumen-actual */
export type MembresiaActualProps = {
  id_venta: number
  label_venta?: string | null
  label_programa: string | null
  label_plan: string | null
  label_horario: string | null
  /** Inicio de la membresía vendida (null si no se encontró el detalle) */
  fecha_inicio?: string | null
  fecha_vencimiento: string
  montoTotal: number
  montoPagado: number
  /** La venta de la membresía ya está pagada por completo */
  pagado: boolean
}
