import { useState } from 'react'
import httpClient from '@/common/helpers/httpClient'
import type { SeguimientoMembresiaProps } from '@/pages/SeguimientoMembresia/store/seguimientoMembresiaSlice'
import { usePersonaPerfil } from './usePersonaPerfil'
import { calcularRacha, type RachaMembresias } from '../helpers/rachaMembresias'

/** Fila de GET /detalleventa-membresias/id_cli/:id_cli */
type MembresiaVendida = {
  id_venta: number
  fecha_inicio: string
  fecha_fin: string
}

/**
 * Desde cuándo está activo el cliente sin cortar y cuántas membresías seguidas lleva.
 * Cada membresía va de su fecha_inicio a su fin real: la fecha_fin vendida o, si el seguimiento de esa
 * venta vence después (extensiones, congelamientos), esa fecha de vencimiento.
 */
export const useRachaCliente = () => {
  const { obtenerIdCliente } = usePersonaPerfil()
  const [racha, setRacha] = useState<RachaMembresias | null>(null)
  const [cargando, setCargando] = useState(false)

  const obtenerRacha = async (uid_person: string) => {
    setCargando(true)
    try {
      const idCliente = await obtenerIdCliente(uid_person)
      if (!idCliente) {
        setRacha(null)
        return
      }
      const [{ data: membresias }, { data: seguimientos }]: [{ data: MembresiaVendida[] }, { data: SeguimientoMembresiaProps[] }] = await Promise.all([
        httpClient.get(`/detalleventa-membresias/id_cli/${idCliente}`),
        httpClient.get(`/membresia-seguimiento/id_cli/${idCliente}`),
      ])
      setRacha(calcularRacha(membresias.map((membresia) => {
        const vencimiento = seguimientos.find((seguimiento) => seguimiento.id_venta === membresia.id_venta)?.fecha_vencimiento
        const fin = vencimiento && vencimiento.slice(0, 10) > membresia.fecha_fin.slice(0, 10) ? vencimiento : membresia.fecha_fin
        return { fecha_inicio: membresia.fecha_inicio, fecha_fin: fin }
      })))
    } catch (error) {
      console.log(error)
      setRacha(null)
    } finally {
      setCargando(false)
    }
  }

  return { racha, cargando, obtenerRacha }
}
