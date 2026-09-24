// Montos decimales: el backend puede devolverlos como number o string.
type Monto = number | string

export type VentaInfoProps = {
  id: number
  fecha_venta: string | null
  id_empl: number
  label_nombres_apellidos_empl: string
  label_documento_empl: string
  id_cli: number
  label_nombres_apellidos_cli: string
  label_documento_cli: string
  id_origen: number
  label_origen: string
  id_tipo_comprobante: number
  label_tipo_comprobante: string
  n_comprobante: string
  id_sucursal: number
  label_sucursal: string
  observacion: string
  montoTotal_membresia: Monto
  montoTotal_productos: Monto
  montoPagos: Monto
  montoDescuento: Monto
}

export type DetalleMembresiaProps = {
  id: number
  id_programa: number
  label_programa: string
  id_plan: number
  label_plan: string
  nMeses_plan: number
  id_horario: number
  label_horario: string
  fecha_inicio: string
  fecha_fin: string
  montoSinDescuento: Monto
  montoDescuento: Monto
  montoTotal: Monto
  dias_congelamiento_regalo: number
  citas_nutricion_regalo: number
}

export type DetalleProductoProps = {
  id: number
  id_producto: number
  label_producto: string
  precio_unitario_producto: Monto
  cantidad: number
  montoDescuento: Monto
  montoTotal: Monto
}

export type DetallePagoProps = {
  id: number
  id_forma_pago: number
  monto: Monto
  fecha_pago: string
  observacion: string
}

export type VentaDetalleProps = {
  venta: VentaInfoProps
  membresias: DetalleMembresiaProps[]
  productos: DetalleProductoProps[]
  pagos: DetallePagoProps[]
}

// Payloads que acepta el backend (forbidNonWhitelisted: solo estos campos).
export type VentaEditableForm = {
  id_cli: number
  id_empl: number
  id_origen: number
  id_sucursal: number
  id_tipo_comprobante: number
  n_comprobante: string
  fecha_venta: string
}

export type MembresiaForm = {
  id_programa: number
  id_plan: number
  id_horario: number
  fecha_inicio: string
  fecha_fin: string
  montoSinDescuento: number
  montoDescuento: number
  montoTotal: number
}

export type ProductoForm = {
  id_producto: number
  precio_unitario_producto: number
  cantidad: number
  montoDescuento: number
  montoTotal: number
}

export type PagoForm = {
  id_forma_pago: number
  monto: number
  fecha_pago: string
  observacion: string
}
