import { useState } from 'react'
import Swal from 'sweetalert2'
import httpClient from '@/common/helpers/httpClient'
import { mensajeError } from '@/helpers/mensajeError'

/** Id de tipo de persona "cliente" */
const ID_TIPO_CLIENTE = 2

type PersonaFoto = { id: number, uid_avatar?: string }

/**
 * Sube la foto de la persona al Azure Blob Storage (contenedor de avatares) con el endpoint que ya
 * usa el modal de clientes: POST /persona/avatar/:uid_avatar. Si la persona aún no tiene uid_avatar,
 * primero se le asigna uno. Devuelve true si se subió.
 */
export const useFotoPerfil = () => {
  const [subiendo, setSubiendo] = useState(false)

  const subirFoto = async (persona: PersonaFoto, archivo: File) => {
    if (!archivo.type.startsWith('image/')) {
      await Swal.fire({ icon: 'warning', title: 'Archivo no válido', text: 'Elige una imagen (JPG, PNG, ...).' })
      return false
    }
    setSubiendo(true)
    try {
      const uid_avatar = persona.uid_avatar || crypto.randomUUID().toUpperCase()
      if (!persona.uid_avatar) {
        await httpClient.patch(`/persona/id_tipo/${ID_TIPO_CLIENTE}/id/${persona.id}`, { uid_avatar })
      }
      const formData = new FormData()
      formData.append('file', archivo)
      await httpClient.post(`/persona/avatar/${uid_avatar}`, formData)
      return true
    } catch (error) {
      await Swal.fire({ icon: 'error', title: 'No se pudo subir la foto', html: mensajeError(error) })
      return false
    } finally {
      setSubiendo(false)
    }
  }

  /** Pide confirmación y quita la foto (DELETE /persona/avatar/:uid_avatar). Devuelve true si se eliminó */
  const eliminarFoto = async (persona: PersonaFoto) => {
    if (!persona.uid_avatar) return false
    const { isConfirmed } = await Swal.fire({
      icon: 'warning',
      title: '¿Eliminar la foto?',
      text: 'La persona quedará sin foto de perfil.',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    })
    if (!isConfirmed) return false
    setSubiendo(true)
    try {
      await httpClient.delete(`/persona/avatar/${persona.uid_avatar}`)
      return true
    } catch (error) {
      await Swal.fire({ icon: 'error', title: 'No se pudo eliminar la foto', html: mensajeError(error) })
      return false
    } finally {
      setSubiendo(false)
    }
  }

  return { subiendo, subirFoto, eliminarFoto }
}
