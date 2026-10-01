import Swal from "sweetalert2"
import { useCrudhook } from "@/hook/usecrudhook"
import { useAppSelector } from "@/stores/Store"
import { mensajeError } from "@/helpers/mensajeError"
import { onSetDataAsistencias, type AsistenciaProps } from "../store/asistenciasSlice"

/** Lo que se guarda de una asistencia (los label_* y fecha_registro los pone el backend) */
export type GuardarAsistenciaProps = {
  id: number
  id_persona: number
  id_tipo_evento: number
  deviceSN: string
}

export const useAsistenciasStore = () => {
  const { asistencias } = useAppSelector((state) => state.ASISTENCIAS)
  const { post, patch, remove, searcher } = useCrudhook<AsistenciaProps>('/persona-eventos-asistencia', onSetDataAsistencias)

  /** Crea (id 0) o actualiza la asistencia. Devuelve true si se guardó; si falla, avisa con el motivo */
  const guardarAsistencia = async ({ id, ...payload }: GuardarAsistenciaProps) => {
    try {
      if (id !== 0) await patch(payload, id)
      else await post(payload)
      return true
    } catch (e) {
      await Swal.fire({ icon: 'error', title: 'No se pudo guardar la asistencia', html: mensajeError(e) })
      return false
    }
  }

  /** Pide confirmación y la da de baja */
  const eliminarAsistencia = async (id: number) => {
    const { isConfirmed } = await Swal.fire({
      icon: 'warning',
      title: '¿Eliminar?',
      text: 'Se eliminará la asistencia.',
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
    asistencias,
    searcher,
    guardarAsistencia,
    eliminarAsistencia,
  }
}
