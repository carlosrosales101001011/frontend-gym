import { useState } from 'react'
import httpClient from '@/common/helpers/httpClient'
import type { SeguimientoMembresiaProps } from '@/pages/SeguimientoMembresia/store/seguimientoMembresiaSlice'
import { diasVencidos } from '@/helpers/diasMembresia'
import { usePersonaPerfil } from '../../hook/usePersonaPerfil'

/**
 * Membresías (seguimiento) de un cliente: primero se busca a la persona por su uid y luego se piden
 * al backend solo los seguimientos de ese id_cli. Las vigentes primero, luego las vencidas;
 * dentro de cada grupo, la que vence más tarde primero.
 */
export const useMembresiasCliente = () => {
  const { obtenerIdCliente } = usePersonaPerfil()
  const [membresias, setMembresias] = useState<SeguimientoMembresiaProps[]>([])
  const [cargando, setCargando] = useState(false)

  const obtenerMembresias = async (uid_person: string) => {
    setCargando(true)
    try {
      const idCliente = await obtenerIdCliente(uid_person)
      if (!idCliente) {
        setMembresias([])
        return
      }
      const { data }: { data: SeguimientoMembresiaProps[] } = await httpClient.get(`/membresia-seguimiento/id_cli/${idCliente}`)
      const vigente = (membresia: SeguimientoMembresiaProps) => diasVencidos(membresia.fecha_vencimiento) <= 0
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
