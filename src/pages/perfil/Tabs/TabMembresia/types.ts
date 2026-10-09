/** GET /membresia-seguimiento/id_cli/:id_cli/detalle: una membresía del cliente con el detalle de su venta */
export type MembresiaDetalleProps = {
  id: number
  id_cli: number
  id_venta: number
  label_venta: string | null
  label_extension_actual: string | null
  sesiones_pendientes: number
  /** yyyy-mm-dd */
  fecha_vencimiento: string
  label_programa: string | null
  label_plan: string | null
  label_horario: string | null
  /** yyyy-mm-dd (null si la venta no tiene detalle de membresía) */
  fecha_inicio: string | null
  /** Días de congelamiento que regala el plan y los que quedan (regalados - días congelados) */
  congelamiento_regalados: number
  congelamiento_disponibles: number
  /** Citas de nutrición que regala el plan y las que quedan (regaladas - citas atendidas en la membresía) */
  citas_regaladas: number
  citas_disponibles: number
  /** Días de las extensiones "Regalo" de la venta (0 = sin regalo) */
  dias_regalo: number
}
