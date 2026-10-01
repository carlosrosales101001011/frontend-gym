import Swal from "sweetalert2"
import { useCrudhook } from "@/hook/usecrudhook"
import { mensajeError } from "@/helpers/mensajeError"
import { onSetDataSecciones, type SeccionProps } from "@/pages/GestionSecciones/store/seccionSlice"

export const useSeccionesStore = () => {
    const { post, obtener, dataxID, obtenerxID, remove, patch, searcher } = useCrudhook<SeccionProps>('/seccion', onSetDataSecciones)

    /** Crea (id 0) o actualiza la sección. Devuelve true si se guardó; si falla, avisa con el motivo */
    const guardarSeccion = async ({ id, ...datos }: SeccionProps) => {
      try {
        if (id !== 0) await patch(datos, id)
        else await post(datos)
        return true
      } catch (e) {
        await Swal.fire({ icon: 'error', title: 'No se pudo guardar la sección', html: mensajeError(e) })
        return false
      }
    }

  return {
    post,
    obtener,
    dataxID,
    obtenerxID,
    remove,
    patch,
    searcher,
    guardarSeccion,
  }
}
