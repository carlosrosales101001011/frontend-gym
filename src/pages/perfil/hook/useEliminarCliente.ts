import { useState } from 'react'
import Swal from 'sweetalert2'
import httpClient from '@/common/helpers/httpClient'
import { mensajeError } from '@/helpers/mensajeError'

/** Id de tipo de persona "cliente" */
const ID_TIPO_CLIENTE = 2

/** Elimina al cliente del perfil (el backend lo da de baja: flag = false) */
export const useEliminarCliente = () => {
  const [eliminando, setEliminando] = useState(false)

  /** Pide confirmación y lo elimina; devuelve true si se eliminó. Si falla, avisa con el motivo */
  const eliminarCliente = async (id: number, nombre: string) => {
    const { isConfirmed } = await Swal.fire({
      icon: 'warning',
      title: '¿Eliminar el cliente?',
      text: nombre,
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    })
    if (!isConfirmed) return false
    setEliminando(true)
    try {
      await httpClient.delete(`/persona/id_tipo/${ID_TIPO_CLIENTE}/id/${id}`)
      return true
    } catch (error) {
      await Swal.fire({ icon: 'error', title: 'No se pudo eliminar el cliente', html: mensajeError(error) })
      return false
    } finally {
      setEliminando(false)
    }
  }

  return { eliminando, eliminarCliente }
}
