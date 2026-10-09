import { useState } from 'react'
import httpClient from '@/common/helpers/httpClient'
import type { MembresiaDetalleProps } from './types'
import { diasVencidos } from '@/helpers/diasMembresia'
import { usePersonaPerfil } from '../../hook/usePersonaPerfil'

/**
 * Membresías (seguimiento) de un cliente con el detalle de su venta (programa, plan, horario, congelamiento, citas):
 * primero se busca a la persona por su uid y luego se piden al backend solo las de ese id_cli. Las vigentes primero, luego las vencidas;
 * dentro de cada grupo, la que vence más tarde primero.
 */
export const useMembresiasCliente = () => {
  const { obtenerIdCliente } = usePersonaPerfil()
  const [membresias, setMembresias] = useState<MembresiaDetalleProps[]>([])
  const [cargando, setCargando] = useState(false)

  const obtenerMembresias = async (uid_person: string) => {
    setCargando(true)
    try {
      const idCliente = await obtenerIdCliente(uid_person)
      if (!idCliente) {
        setMembresias([])
        return
      }
      const { data }: { data: MembresiaDetalleProps[] } = await httpClient.get(`/membresia-seguimiento/id_cli/${idCliente}/detalle`)
      const vigente = (membresia: MembresiaDetalleProps) => diasVencidos(membresia.fecha_vencimiento) <= 0
      setMembresias(
        [...data]
          .sort((a, b) => Number(vigente(b)) - Number(vigente(a)) || b.fecha_vencimiento.localeCompare(a.fecha_vencimiento))
      )
    } catch (error) {
      console.log(error)
      setMembresias([])
    } finally {
      setCargando(false)
    }
  }

  return { membresias, cargando, obtenerMembresias }
}
