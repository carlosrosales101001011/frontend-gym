import { useState } from 'react'
import httpClient from '@/common/helpers/httpClient'
import { usePersonaPerfil } from '../../hook/usePersonaPerfil'

/** Venta de GET /venta/id_cli/:id_cli (solo lo que muestra el perfil) */
export type VentaClienteProps = {
  id: number
  fecha_venta: string
  label_tipo_comprobante: string
  n_comprobante: string
  label_nombres_apellidos_empl: string
  montoTotal_membresia: number | string
  montoTotal_productos: number | string
  montoPagos: number | string
}

/** Total vendido de una venta (membresía + productos). Los decimales pueden llegar como string */
export const totalVenta = (venta: VentaClienteProps) =>
  (Number(venta.montoTotal_membresia) || 0) + (Number(venta.montoTotal_productos) || 0)

/**
 * Ventas de un cliente: primero se busca a la persona por su uid y luego se piden sus ventas por id_cli.
 * La más reciente primero.
 */
export const useVentasCliente = () => {
  const { obtenerIdCliente } = usePersonaPerfil()
  const [ventas, setVentas] = useState<VentaClienteProps[]>([])
  const [cargando, setCargando] = useState(false)

  const obtenerVentas = async (uid_person: string) => {
    setCargando(true)
    try {
      const idCliente = await obtenerIdCliente(uid_person)
      if (!idCliente) {
        setVentas([])
        return
      }
      const { data }: { data: { lista: VentaClienteProps[] } } = await httpClient.get(`/venta/id_cli/${idCliente}`)
      setVentas([...data.lista].sort((a, b) => b.fecha_venta.localeCompare(a.fecha_venta)))
    } catch (error) {
      console.log(error)
      setVentas([])
    } finally {
      setCargando(false)
    }
  }

  return { ventas, cargando, obtenerVentas }
}
