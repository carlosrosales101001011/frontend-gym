import { useState } from 'react'
import { useDispatch } from 'react-redux'
import Swal from 'sweetalert2'
import { addDays, addMonths, format } from 'date-fns'
import httpClient from '@/common/helpers/httpClient'
import { mensajeError } from '@/helpers/mensajeError'
import { formatoMoneda } from '../DetalleItemsVenta/Carrito/Carrito'
import { ID_SUCURSAL_POR_DEFECTO, initialVenta, onRepetirVenta, type PlanProps, type VentaProps } from '../store/ventaSlice'

/** GET /venta/id/:id/detalle (solo lo que se usa para repetirla; los decimales pueden llegar como string) */
type DetalleVentaApi = {
  venta: {
    id: number
    id_cli: number
    id_empl: number | null
    label_nombres_apellidos_empl: string | null
    label_documento_empl: string | null
    id_origen: number | null
    id_sucursal: number | null
    id_tipo_comprobante: number | null
  }
  membresias: {
    id_programa: number
    label_programa: string | null
    id_plan: number
    id_horario: number
    label_horario: string | null
    montoTotal: number | string
    montoDescuento: number | string
    montoSinDescuento: number | string
  }[]
  productos: {
    id_producto: number
    label_producto: string | null
    precio_unitario_producto: number | string
    cantidad: number
    montoTotal: number | string
  }[]
  pagos: { id_forma_pago: number, monto: number | string }[]
}

/** GET /producto/id/:id: precio_venta_actual solo si el backend lo envía */
type ProductoActual = { id: number, nombre: string, precio_venta_actual?: number | string | null } | null

const mismoMonto = (a: number | string, b: number | string) => Math.abs(Number(a) - Number(b)) < 0.005

/**
 * "Repetir venta" del historial del cliente: arma una venta nueva con el mismo cliente, asesor, origen, sucursal,
 * tipo de comprobante, membresía, productos y pagos (mismos precios y descuentos). La membresía empieza mañana.
 * Si el precio del plan cambió (o el plan / un producto ya no existe) se avisa y NO se repite.
 */
export const useRepetirVenta = () => {
  const dispatch = useDispatch()
  const [repitiendoId, setRepitiendoId] = useState<number | null>(null)

  /** true si la venta quedó cargada para registrarse */
  const repetirVenta = async (id_venta: number) => {
    setRepitiendoId(id_venta)
    try {
      const { data }: { data: DetalleVentaApi } = await httpClient.get(`/venta/id/${id_venta}/detalle`)
      const { venta, productos, pagos } = data
      // Como el proceso del seguimiento: la membresía de la venta es la última
      const membresia = data.membresias.at(-1)
      const cambios: string[] = []

      // Membresía: el plan debe seguir activo y con el mismo precio
      let plan: PlanProps | undefined
      if (membresia) {
        const { data: planes }: { data: { lista: PlanProps[] } } = await httpClient.get(`/entrenamiento-plan/id_programa/${membresia.id_programa}`)
        plan = planes.lista.find((p) => p.id === membresia.id_plan)
        const nombre = `Membresía ${membresia.label_programa ?? ''}`.trim()
        if (!plan || !plan.estado) cambios.push(`${nombre}: el plan ya no está disponible`)
        else if (!mismoMonto(plan.precioTotal, membresia.montoSinDescuento)) {
          cambios.push(`${nombre}: el precio del plan cambió de ${formatoMoneda.format(Number(membresia.montoSinDescuento))} a ${formatoMoneda.format(Number(plan.precioTotal))}`)
        }
      }

      // Productos: deben seguir existiendo; si el backend da su precio actual, debe ser el mismo
      const actuales: ProductoActual[] = await Promise.all(productos.map((p) =>
        httpClient.get(`/producto/id/${p.id_producto}`).then(({ data }) => data || null).catch(() => null)))
      productos.forEach((p, i) => {
        const actual = actuales[i]
        const nombre = p.label_producto ?? `Producto ${p.id_producto}`
        if (!actual) cambios.push(`${nombre}: ya no está disponible`)
        else if (actual.precio_venta_actual != null && !mismoMonto(actual.precio_venta_actual, p.precio_unitario_producto)) {
          cambios.push(`${nombre}: el precio cambió de ${formatoMoneda.format(Number(p.precio_unitario_producto))} a ${formatoMoneda.format(Number(actual.precio_venta_actual))}`)
        }
      })

      if (cambios.length > 0) {
        await Swal.fire({
          icon: 'warning',
          title: 'No se puede repetir la venta',
          html: `Cambió desde la venta original:<ul class="text-start mt-2 mb-0">${cambios.map((c) => `<li>${c}</li>`).join('')}</ul>`,
        })
        return false
      }

      // La membresía nueva empieza mañana (la venta se registra hoy) y dura los meses de su plan
      const fechaInicio = addDays(new Date(), 1)
      const nuevaVenta: VentaProps = {
        ...initialVenta,
        id_cli: venta.id_cli,
        id_empl: venta.id_empl ?? 0,
        id_origen: venta.id_origen ?? 0,
        id_sucursal: venta.id_sucursal || ID_SUCURSAL_POR_DEFECTO,
        id_tipo_comprobante: venta.id_tipo_comprobante ?? 0,
        detalleventa_membresias: membresia && plan ? {
          id_programa: membresia.id_programa,
          id_plan: plan.id,
          id_horario: membresia.id_horario,
          fecha_inicio: format(fechaInicio, 'yyyy-MM-dd'),
          fecha_fin: format(addMonths(fechaInicio, plan.nMeses), 'yyyy-MM-dd'),
          label_programa: membresia.label_programa ?? '',
          label_horario: membresia.label_horario ?? '',
          label_nmeses: `${plan.nMeses} ${plan.nMeses === 1 ? 'mes' : 'meses'}`,
          label_precio: formatoMoneda.format(plan.precioTotal),
          montoTotal: Number(membresia.montoTotal),
          montoDescuento: Number(membresia.montoDescuento),
          montoSinDescuento: Number(membresia.montoSinDescuento),
          max_descuento_plan: Number(plan.max_descuento) || 0,
        } : initialVenta.detalleventa_membresias,
        detalleventa_productos: productos.map((p) => ({
          id_producto: p.id_producto,
          cantidad: p.cantidad,
          label_producto: p.label_producto ?? '',
          precio_unitario_producto: String(p.precio_unitario_producto),
          precio_unitario: Number(p.precio_unitario_producto),
          montoTotal: Number(p.montoTotal),
        })),
        detalleventa_pagos: pagos.map((p) => ({ id_forma_pago: p.id_forma_pago, montoPagos: Number(p.monto) })),
      }

      const asesor = venta.id_empl ? {
        id: venta.id_empl,
        nombre: venta.label_nombres_apellidos_empl ?? '',
        dni: (venta.label_documento_empl ?? '').replace(/^\D+:\s*/, ''),
        telefono: '',
        email_personal: '',
        idTipo: 1,
      } : null
      dispatch(onRepetirVenta({ venta: nuevaVenta, asesor }))
      return true
    } catch (error) {
      await Swal.fire({ icon: 'error', title: 'No se pudo repetir la venta', html: mensajeError(error) })
      return false
    } finally {
      setRepitiendoId(null)
    }
  }

  return { repetirVenta, repitiendoId }
}
