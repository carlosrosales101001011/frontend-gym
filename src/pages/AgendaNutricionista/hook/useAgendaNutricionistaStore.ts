import Swal from 'sweetalert2'
import { useCrudhook } from "@/hook/usecrudhook"
import { useAppDispatch, useAppSelector } from "@/stores/Store"
import { onSetDataEventos, type EventoAgendaProps } from "../store/agendaNutricionistaSlice"
import { EVENTOS_FALSOS } from "../helpers/eventosFalsos"

// TODO: poner en false cuando exista /agenda-nutricionista en el backend.
// Con true, los eventos viven solo en el store (se pierden al recargar la página).
const USAR_DATA_FALSA = true
/**
 * La data falsa se carga una vez por carga del módulo: así lo agregado/editado se mantiene al
 * volver a la pantalla, y si cambia eventosFalsos.ts (recarga en caliente) se vuelve a cargar.
 */
let dataFalsaCargada = false

const mensajeError = (error: unknown) =>
  Array.isArray(error) ? error.join('<br/>') : String(error)

export const useAgendaNutricionistaStore = () => {
    const dispatch = useAppDispatch()
    const { eventos, minutosxcli } = useAppSelector(e=>e.AGENDA_NUTRICIONISTA)
    const { obtenerAll, post, patch, remove } = useCrudhook<EventoAgendaProps>('/agenda-nutricionista', onSetDataEventos)

    const obtenerEventos = async () => {
      if (USAR_DATA_FALSA) {
        if (!dataFalsaCargada) {
          dispatch(onSetDataEventos(EVENTOS_FALSOS))
          dataFalsaCargada = true
        }
        return
      }
      await obtenerAll()
    }

    const guardarEventoApi = async (evento: EventoAgendaProps) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars -- los label_* solo son para mostrar
      const { id, label_cliente, label_nutricionista, ...values } = evento
      if (id !== 0) {
        await patch(values, id)
      } else {
        await post(values)
      }
      // post/patch recargan con el searcher (paginado); el calendario necesita todos los eventos
      await obtenerAll()
    }
    const guardarEventoFalso = (evento: EventoAgendaProps) => {
      const nuevoId = Math.max(0, ...eventos.map((e) => e.id)) + 1
      dispatch(onSetDataEventos(evento.id !== 0
        ? eventos.map((e) => e.id === evento.id ? evento : e)
        : [...eventos, { ...evento, id: nuevoId }]))
    }

    /** Crea o edita según el id. Devuelve true si se guardó. */
    const guardarEvento = async (evento: EventoAgendaProps) => {
      try {
        if (USAR_DATA_FALSA) guardarEventoFalso(evento)
        else await guardarEventoApi(evento)
        return true
      } catch (e) {
        await Swal.fire({ icon: 'error', title: 'No se pudo guardar', html: mensajeError(e) })
        return false
      }
    }
    /** Pide confirmación y elimina. Devuelve true si se eliminó. */
    const eliminarEvento = async (id: number) => {
      const { isConfirmed } = await Swal.fire({
        icon: 'warning',
        title: '¿Eliminar?',
        text: 'Se eliminará el evento de la agenda.',
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
      })
      if (!isConfirmed) return false
      try {
        if (USAR_DATA_FALSA) {
          dispatch(onSetDataEventos(eventos.filter((e) => e.id !== id)))
        } else {
          await remove(id)
          await obtenerAll()
        }
        return true
      } catch (e) {
        await Swal.fire({ icon: 'error', title: 'No se pudo eliminar', html: mensajeError(e) })
        return false
      }
    }
  return {
    eventos,
    minutosxcli,
    obtenerEventos,
    guardarEvento,
    eliminarEvento,
  }
}
