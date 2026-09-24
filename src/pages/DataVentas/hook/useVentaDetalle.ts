import { useCallback, useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import httpClient from '@/common/helpers/httpClient'
import type { MembresiaForm, PagoForm, ProductoForm, VentaDetalleProps, VentaEditableForm } from '../types'

const mensajeError = (error: unknown) =>
  Array.isArray(error) ? error.join('<br/>') : String(error)

/**
 * Carga la venta con sus membresías, productos y pagos (GET /venta/id/:id/detalle)
 * y expone las acciones de edición. Cada acción recarga el detalle y llama a `onCambio`
 * (ej. refrescar la tabla de ventas). Los totales de la venta los recalcula el backend.
 */
export const useVentaDetalle = (id: number, onCambio?: () => void) => {
  const [data, setData] = useState<VentaDetalleProps | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const cargar = useCallback(async (signal?: AbortSignal) => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const { data } = await httpClient.get(`/venta/id/${id}/detalle`, { signal })
      setData(data as VentaDetalleProps)
    } catch (e) {
      if ((e as { name?: string })?.name === 'CanceledError' || signal?.aborted) return
      setError(mensajeError(e))
    } finally {
      if (!signal?.aborted) setLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (!id) {
      setData(null)
      return
    }
    const ctrl = new AbortController()
    cargar(ctrl.signal)
    return () => ctrl.abort()
  }, [id, cargar])

  // Ejecuta una mutación; devuelve true si salió bien.
  const ejecutar = async (accion: () => Promise<unknown>) => {
    try {
      await accion()
      await cargar()
      onCambio?.()
      return true
    } catch (e) {
      await Swal.fire({ icon: 'error', title: 'No se pudo guardar', html: mensajeError(e) })
      return false
    }
  }

  const confirmarEliminar = async (texto: string) => {
    const { isConfirmed } = await Swal.fire({
      icon: 'warning',
      title: '¿Eliminar?',
      text: texto,
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    })
    return isConfirmed
  }

  const guardarDetalle = (modelo: string, values: object, idDetalle?: number) =>
    ejecutar(() => idDetalle
      ? httpClient.patch(`${modelo}/id/${idDetalle}`, values)
      : httpClient.post(modelo, { ...values, id_venta: id }))

  const eliminarDetalle = async (modelo: string, idDetalle: number, texto: string) => {
    if (!(await confirmarEliminar(texto))) return false
    return ejecutar(() => httpClient.delete(`${modelo}/id/${idDetalle}`))
  }

  return {
    data,
    loading,
    error,
    recargar: cargar,
    actualizarVenta: (values: Partial<VentaEditableForm>) =>
      ejecutar(() => httpClient.patch(`/venta/id/${id}`, values)),
    guardarMembresia: (values: MembresiaForm, idDetalle?: number) =>
      guardarDetalle('/detalleventa-membresias', values, idDetalle),
    eliminarMembresia: (idDetalle: number) =>
      eliminarDetalle('/detalleventa-membresias', idDetalle, 'Se eliminará la membresía y su seguimiento.'),
    guardarProducto: (values: ProductoForm, idDetalle?: number) =>
      guardarDetalle('/detalleventa-productos', values, idDetalle),
    eliminarProducto: (idDetalle: number) =>
      eliminarDetalle('/detalleventa-productos', idDetalle, 'Se eliminará el producto de la venta.'),
    guardarPago: (values: PagoForm, idDetalle?: number) =>
      guardarDetalle('/detalleventa-pagos', values, idDetalle),
    eliminarPago: (idDetalle: number) =>
      eliminarDetalle('/detalleventa-pagos', idDetalle, 'Se eliminará el pago de la venta.'),
  }
}

export type UseVentaDetalle = ReturnType<typeof useVentaDetalle>
