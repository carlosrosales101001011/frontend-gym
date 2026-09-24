import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
} from 'date-fns'
import { es } from 'date-fns/locale'
import type { EventoAgendaProps } from '../store/agendaNutricionistaSlice'

export type VistaCalendario = 'mes' | 'semana' | 'dia'

export const VISTAS_CALENDARIO: { value: VistaCalendario, label: string }[] = [
  { value: 'mes', label: 'Mes' },
  { value: 'semana', label: 'Semana' },
  { value: 'dia', label: 'Día' },
]

type EstadoEvento = {
  value: number,
  label: string,
  color: string,
  /** El evento no se puede abrir ni editar desde la agenda (lo gestiona el administrador) */
  bloqueado?: boolean,
}

// TODO: si el backend agrega los estados a terminologia, cargarlos con useTerminologiaPersona
export const ESTADOS_EVENTO: EstadoEvento[] = [
  { value: 1, label: 'Pendiente', color: '#f59f00' },
  { value: 2, label: 'Confirmado', color: '#1c7ed6' },
  { value: 3, label: 'Atendido', color: '#2f9e44' },
  { value: 4, label: 'No asistió', color: '#e03131' },
  { value: 5, label: 'Importante', color: '#868e96', bloqueado: true },
]

/** Estados que el nutricionista puede asignar en el formulario (los bloqueados no) */
export const ESTADOS_SELECCIONABLES = ESTADOS_EVENTO.filter((estado) => !estado.bloqueado)

export const obtenerEstado = (id_estado: number) =>
  ESTADOS_EVENTO.find((estado) => estado.value === id_estado) ?? ESTADOS_EVENTO[0]

export const esEventoBloqueado = (evento: EventoAgendaProps) => Boolean(obtenerEstado(evento.id_estado).bloqueado)

export const TEXTO_EVENTO_BLOQUEADO = 'Evento importante'

/** Rango de horas de atención (vista semana) */
export const HORA_INICIO_AGENDA = 7
export const HORA_FIN_AGENDA = 21
/** Alto en px de cada slot en la vista semana */
export const ALTO_SLOT = 26

/** Duraciones que se pueden elegir al agendar una cita (en minutos) */
export const DURACIONES_CITA = [
  { value: 20, label: '20 minutos' },
  { value: 30, label: '30 minutos' },
]
export const DURACION_CITA_DEFAULT = DURACIONES_CITA[0].value

/** La semana empieza el lunes */
const OPCIONES_SEMANA = { weekStartsOn: 1 as const }

export const aFechaISO = (fecha: Date) => format(fecha, 'yyyy-MM-dd')

/** "HH:mm" -> minutos desde las 00:00 */
export const aMinutos = (hora: string) => {
  const [h, m] = hora.split(':').map(Number)
  return h * 60 + (m || 0)
}

/** minutos desde las 00:00 -> "HH:mm" */
const aHora = (minutos: number) =>
  `${String(Math.floor(minutos / 60)).padStart(2, '0')}:${String(minutos % 60).padStart(2, '0')}`

/** "HH:mm" + minutos -> "HH:mm" (hora de fin de una cita) */
export const sumarMinutos = (hora: string, minutos: number) => aHora(aMinutos(hora) + minutos)

/** Horas de inicio de cada slot del día ("07:00", "07:20", ...) según la duración de la cita */
export const slotsDelDia = (minutosxcli: number) => {
  const slots: string[] = []
  for (let m = HORA_INICIO_AGENDA * 60; m + minutosxcli <= HORA_FIN_AGENDA * 60; m += minutosxcli) {
    slots.push(aHora(m))
  }
  return slots
}

/** Dos eventos se cruzan si son el mismo día y sus horarios se superponen (terminar a la hora en que empieza el otro sí se permite) */
const seCruzan = (a: EventoAgendaProps, b: EventoAgendaProps) =>
  a.fecha === b.fecha
  && aMinutos(a.hora_inicio) < aMinutos(b.hora_fin)
  && aMinutos(b.hora_inicio) < aMinutos(a.hora_fin)

/** Devuelve el primer evento (distinto al que se edita) que se cruza con `evento`, o undefined */
export const buscarCruce = (evento: EventoAgendaProps, eventos: EventoAgendaProps[]) =>
  eventos.find((otro) => otro.id !== evento.id && seCruzan(evento, otro))

/** Duración de un evento en minutos (hora_fin - hora_inicio) */
export const duracionEvento = (evento: EventoAgendaProps) => aMinutos(evento.hora_fin) - aMinutos(evento.hora_inicio)

/** Citas de un cliente (sin el evento que se edita), de la más reciente a la más antigua */
export const citasDelCliente = (eventos: EventoAgendaProps[], id_cli: number, idExcluir: number) =>
  eventos
    .filter((evento) => evento.id_cli === id_cli && evento.id !== idExcluir)
    .sort((a, b) => b.fecha.localeCompare(a.fecha) || aMinutos(b.hora_inicio) - aMinutos(a.hora_inicio))

export const eventosDelDia = (eventos: EventoAgendaProps[], dia: Date) => {
  const fecha = aFechaISO(dia)
  return eventos
    .filter((evento) => evento.fecha === fecha)
    .sort((a, b) => aMinutos(a.hora_inicio) - aMinutos(b.hora_inicio))
}

/** Días que muestra la vista mes: semanas completas de lunes a domingo */
export const diasDelMes = (fecha: Date) => eachDayOfInterval({
  start: startOfWeek(startOfMonth(fecha), OPCIONES_SEMANA),
  end: endOfWeek(endOfMonth(fecha), OPCIONES_SEMANA),
})

export const diasDeLaSemana = (fecha: Date) => {
  const inicio = startOfWeek(fecha, OPCIONES_SEMANA)
  return Array.from({ length: 7 }, (_, i) => addDays(inicio, i))
}

const capitalizar = (texto: string) => texto.charAt(0).toUpperCase() + texto.slice(1)

export const tituloVista = (vista: VistaCalendario, fecha: Date) => {
  if (vista === 'mes') return capitalizar(format(fecha, "MMMM 'de' yyyy", { locale: es }))
  if (vista === 'dia') return capitalizar(format(fecha, "EEEE d 'de' MMMM 'de' yyyy", { locale: es }))
  const dias = diasDeLaSemana(fecha)
  return `${format(dias[0], "d MMM", { locale: es })} - ${format(dias[6], "d MMM yyyy", { locale: es })}`
}
