import { useState } from 'react'
import Swal from 'sweetalert2'
import httpClient from '@/common/helpers/httpClient'
import { mensajeError } from '@/helpers/mensajeError'

/** Tipo de notificación: un valor de terminologia */
export type TipoNotificacionProps = {
  id: number
  codigo: string
  valor: string
}

type OpcionTerminologia = { value: number, label: string, codigo: string | null }

/** Dónde viven los tipos de notificación en terminologia */
const TERMINOLOGIA = { entidad: 'sistema', grupo: 'notificacion', subgrupo: 'tipo' }

export const useTiposNotificaciones = () => {
  const [tipos, setTipos] = useState<TipoNotificacionProps[]>([])
  const [cargando, setCargando] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState(false)

  const obtenerTipos = async () => {
    setCargando(true)
    setError(false)
    try {
      const { entidad, grupo, subgrupo } = TERMINOLOGIA
      const { data } = await httpClient.get(`/terminologia/entidad/${entidad}/grupo/${grupo}/subgrupo/${subgrupo}`)
      setTipos((data as OpcionTerminologia[]).map(({ value, label, codigo }) => ({ id: value, codigo: codigo ?? '', valor: label })))
    } catch {
      setError(true)
    } finally {
      setCargando(false)
    }
  }

  /** id 0 = crear. Devuelve si se guardó */
  const guardarTipo = async ({ id, codigo, valor }: TipoNotificacionProps): Promise<boolean> => {
    const cambios = { codigo: codigo.trim(), valor: valor.trim() }
    setGuardando(true)
    try {
      if (id) await httpClient.patch(`/terminologia/id/${id}`, cambios)
      else await httpClient.post('/terminologia', { ...TERMINOLOGIA, ...cambios })
    } catch (e) {
      await Swal.fire({ icon: 'error', title: 'No se pudo guardar el tipo de notificación', html: mensajeError(e) })
      return false
    } finally {
      setGuardando(false)
    }
    await obtenerTipos()
    return true
  }

  /** Borrado lógico (flag = false), con confirmación */
  const eliminarTipo = async ({ id, valor }: TipoNotificacionProps) => {
    const { isConfirmed } = await Swal.fire({
      icon: 'warning',
      title: '¿Eliminar?',
      text: `Se eliminará el tipo de notificación "${valor}".`,
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    })
    if (!isConfirmed) return
    try {
      await httpClient.patch(`/terminologia/delete/id/${id}`)
    } catch (e) {
      await Swal.fire({ icon: 'error', title: 'No se pudo eliminar el tipo de notificación', html: mensajeError(e) })
      return
    }
    await obtenerTipos()
  }

  return { tipos, cargando, guardando, error, obtenerTipos, guardarTipo, eliminarTipo }
}
