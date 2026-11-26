import { useState } from 'react'
import Swal from 'sweetalert2'
import httpClient from '@/common/helpers/httpClient'
import { mensajeError } from '@/helpers/mensajeError'

/** Alérgeno: un valor de terminologia */
export type AlergenoProps = {
  id: number
  valor: string
}

type OpcionTerminologia = { value: number, label: string }

/** Dónde viven los alérgenos en terminologia */
const TERMINOLOGIA = { entidad: 'nutricion', grupo: 'alergenos', subgrupo: 'alimentos' }

export const useAlergenos = () => {
  const [alergenos, setAlergenos] = useState<AlergenoProps[]>([])
  const [cargando, setCargando] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState(false)

  const obtenerAlergenos = async () => {
    setCargando(true)
    setError(false)
    try {
      const { entidad, grupo, subgrupo } = TERMINOLOGIA
      const { data } = await httpClient.get(`/terminologia/entidad/${entidad}/grupo/${grupo}/subgrupo/${subgrupo}`)
      setAlergenos((data as OpcionTerminologia[]).map(({ value, label }) => ({ id: value, valor: label })))
    } catch {
      setError(true)
    } finally {
      setCargando(false)
    }
  }

  /** id 0 = crear. Devuelve si se guardó */
  const guardarAlergeno = async ({ id, valor }: AlergenoProps): Promise<boolean> => {
    const cambios = { valor: valor.trim() }
    setGuardando(true)
    try {
      if (id) await httpClient.patch(`/terminologia/id/${id}`, cambios)
      else await httpClient.post('/terminologia', { ...TERMINOLOGIA, ...cambios })
    } catch (e) {
      await Swal.fire({ icon: 'error', title: 'No se pudo guardar el alérgeno', html: mensajeError(e) })
      return false
    } finally {
      setGuardando(false)
    }
    await obtenerAlergenos()
    return true
  }

  /** Borrado lógico (flag = false), con confirmación */
  const eliminarAlergeno = async ({ id, valor }: AlergenoProps) => {
    const { isConfirmed } = await Swal.fire({
      icon: 'warning',
      title: '¿Eliminar?',
      text: `Se eliminará el alérgeno "${valor}".`,
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    })
    if (!isConfirmed) return
    try {
      await httpClient.patch(`/terminologia/delete/id/${id}`)
    } catch (e) {
      await Swal.fire({ icon: 'error', title: 'No se pudo eliminar el alérgeno', html: mensajeError(e) })
      return
    }
    await obtenerAlergenos()
  }

  return { alergenos, cargando, guardando, error, obtenerAlergenos, guardarAlergeno, eliminarAlergeno }
}
