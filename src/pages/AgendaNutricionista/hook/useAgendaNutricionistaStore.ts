import Swal from 'sweetalert2'
import httpClient from '@/common/helpers/httpClient'
import { mensajeError } from '@/helpers/mensajeError'
import { useAppDispatch, useAppSelector } from '@/stores/Store'
import { onSetDataEventos, onSetEstadosCita, type EventoAgendaProps } from '../store/agendaNutricionistaSlice'
import { armarEstados, duracionEvento, sumarMinutos } from '../helpers/agendaHelpers'

/** Cita tal como la devuelve /agenda-nutricionista */
type CitaApi = {
  id: number
  id_cli: number
  label_nombres_apellidos_cli?: string | null
  id_empl: number
  label_nombres_apellidos_empl?: string | null
  /** yyyy-MM-dd (o ISO con hora) */
  fecha: string
  /** HH:mm[:ss] (o ISO 1970-01-01THH:mm) */
  hora_inicio: string
  duracionxmin: number
  id_estado: number
  label_estado?: string | null
}

/** "HH:mm" a partir de lo que devuelve la columna time del backend */
const aHoraHHmm = (hora: string) => (hora.includes('T') ? hora.split('T')[1] : hora).slice(0, 5)

/** Del backend al calendario (que trabaja con hora de fin y nombres cortos) */
const desdeApi = (cita: CitaApi): EventoAgendaProps => {
  const hora_inicio = aHoraHHmm(cita.hora_inicio)
  return {
    id: cita.id,
    id_cli: cita.id_cli,
    id_nutricionista: cita.id_empl,
    id_estado: cita.id_estado,
    fecha: cita.fecha.slice(0, 10),
    hora_inicio,
    hora_fin: sumarMinutos(hora_inicio, cita.duracionxmin),
    label_cliente: cita.label_nombres_apellidos_cli ?? undefined,
    label_nutricionista: cita.label_nombres_apellidos_empl ?? undefined,
  }
}

/** Del calendario al backend (los label_* los pone el backend) */
const haciaApi = (evento: EventoAgendaProps) => ({
  id_cli: evento.id_cli,
  id_empl: evento.id_nutricionista,
  fecha: evento.fecha,
  hora_inicio: evento.hora_inicio,
  duracionxmin: duracionEvento(evento),
  id_estado: evento.id_estado,
})

/** Citas de la agenda del nutricionista y sus estados (terminología agenda / cita / estado) */
export const useAgendaNutricionistaStore = () => {
    const dispatch = useAppDispatch()
    const { eventos, minutosxcli, estados } = useAppSelector(e=>e.AGENDA_NUTRICIONISTA)

    /** Todas las citas (el calendario las necesita todas para mostrar y validar cruces) */
    const obtenerEventos = async () => {
      try {
        const { data } = await httpClient.get('/agenda-nutricionista')
        dispatch(onSetDataEventos((data.lista as CitaApi[]).map(desdeApi)))
      } catch (e) {
        await Swal.fire({ icon: 'error', title: 'No se pudo cargar la agenda', html: mensajeError(e) })
      }
    }

    /** Estados de cita con su color; se piden una vez */
    const obtenerEstados = async () => {
      if (estados.length) return
      try {
        const { data } = await httpClient.get('/terminologia/entidad/agenda/grupo/cita/subgrupo/estado')
        dispatch(onSetEstadosCita(armarEstados(data)))
      } catch (error) {
        console.log(error)
      }
    }

    /** Crea o edita según el id. Devuelve true si se guardó. */
    const guardarEvento = async (evento: EventoAgendaProps) => {
      try {
        if (evento.id !== 0) await httpClient.patch(`/agenda-nutricionista/id/${evento.id}`, haciaApi(evento))
        else await httpClient.post('/agenda-nutricionista', haciaApi(evento))
        await obtenerEventos()
        return true
      } catch (e) {
        await Swal.fire({ icon: 'error', title: 'No se pudo guardar', html: mensajeError(e) })
        return false
      }
    }

    /** Pide confirmación y elimina (borrado lógico). Devuelve true si se eliminó. */
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
        await httpClient.delete(`/agenda-nutricionista/id/${id}`)
        await obtenerEventos()
        return true
      } catch (e) {
        await Swal.fire({ icon: 'error', title: 'No se pudo eliminar', html: mensajeError(e) })
        return false
      }
    }

  return {
    eventos,
    minutosxcli,
    estados,
    obtenerEventos,
    obtenerEstados,
    guardarEvento,
    eliminarEvento,
  }
}
