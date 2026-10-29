import Swal from "sweetalert2"
import httpClient from "@/common/helpers/httpClient"
import { useCrudhook } from "@/hook/usecrudhook"
import { mensajeError } from "@/helpers/mensajeError"
import { useAppSelector } from "@/stores/Store"
import { onSetDataCompromisosPago, type CompromisoPagoProps } from "@/pages/GestionCompromisosPagos/store/compromisoPagoSlice"

/** Venta del cliente (de /venta/id_cli/:id_cli) con lo necesario para saber su deuda */
export type VentaDeudaProps = {
  id: number
  fecha_venta: string
  n_comprobante: string
  montoTotal_membresia: number | string
  montoTotal_productos: number | string
  montoPagos: number | string
}

/** Total de una venta: membresías + productos (los decimales pueden llegar como string) */
export const totalVenta = (venta: VentaDeudaProps) =>
  (Number(venta.montoTotal_membresia) || 0) + (Number(venta.montoTotal_productos) || 0)

/** Deuda de una venta: su total menos lo pagado; nunca negativa */
export const deudaVenta = (venta: VentaDeudaProps) =>
  Math.max(Math.round((totalVenta(venta) - (Number(venta.montoPagos) || 0)) * 100) / 100, 0)

/** Comprobante de la venta para mostrar; sin comprobante (vacío o "0"), "Venta [id]" */
export const nombreVenta = (venta: VentaDeudaProps) =>
  venta.n_comprobante && venta.n_comprobante !== '0' ? venta.n_comprobante : `Venta ${venta.id}`

/** Deuda total del cliente: la suma de la deuda de todas sus ventas */
export const deudaTotal = (ventas: VentaDeudaProps[]) =>
  Math.round(ventas.reduce((total, venta) => total + deudaVenta(venta), 0) * 100) / 100

export const useCompromisoPagoStore = () => {
    const { compromisosPago } = useAppSelector((state) => state.COMPROMISO_PAGO)
    const { post, remove, patch, searcher } = useCrudhook<CompromisoPagoProps>('/compromisos-pago-cliente', onSetDataCompromisosPago)

    /** Ventas del cliente con deuda (saldo pendiente), la más reciente primero */
    const obtenerVentasConDeuda = async (id_cli: number, signal?: AbortSignal): Promise<VentaDeudaProps[]> => {
      try {
        const { data }: { data: { lista: VentaDeudaProps[] } } = await httpClient.get(`/venta/id_cli/${id_cli}`, { signal })
        return data.lista
          .filter((venta) => deudaVenta(venta) > 0)
          .sort((a, b) => b.fecha_venta.localeCompare(a.fecha_venta))
      } catch (error) {
        if (!signal?.aborted) console.log(error)
        return []
      }
    }

    /**
     * Crea o edita según el id. Los nombres y labels los pone el backend, y también el colaborador:
     * es el del usuario logueado (no se envía). Devuelve true si se guardó.
     */
    const guardarCompromisoPago = async (compromiso: CompromisoPagoProps) => {
      const { id, id_cli, id_venta, monto_total_deuda, monto_comprometido, monto_pagado, id_motivo, observacion, id_estado } = compromiso
      const valores = {
        id_cli, id_venta, id_motivo, id_estado,
        monto_total_deuda: Number(monto_total_deuda),
        monto_comprometido: Number(monto_comprometido),
        monto_pagado: Number(monto_pagado) || 0,
        observacion: observacion.trim(),
      }
      try {
        if (id !== 0) await patch(valores, id)
        else await post(valores)
        return true
      } catch (e) {
        await Swal.fire({ icon: 'error', title: 'No se pudo guardar', html: mensajeError(e) })
        return false
      }
    }

    /** Pide confirmación y elimina (borrado lógico). */
    const eliminarCompromisoPago = async (id: number) => {
      const { isConfirmed } = await Swal.fire({
        icon: 'warning',
        title: '¿Eliminar?',
        text: 'Se eliminará el compromiso de pago.',
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
      })
      if (!isConfirmed) return
      try {
        await remove(id)
      } catch (e) {
        await Swal.fire({ icon: 'error', title: 'No se pudo eliminar', html: mensajeError(e) })
      }
    }

  return {
    compromisosPago,
    searcher,
    obtenerVentasConDeuda,
    guardarCompromisoPago,
    eliminarCompromisoPago,
  }
}
