import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSunday,
  startOfMonth,
  startOfWeek,
} from 'date-fns'
import { es } from 'date-fns/locale'
import { normalizeText } from '@/helpers/strings'
import type { EventoAgendaProps } from '../store/agendaNutricionistaSlice'

export type VistaCalendario = 'mes' | 'semana' | 'dia'

export const VISTAS_CALENDARIO: { value: VistaCalendario, label: string }[] = [
  { value: 'mes', label: 'Mes' },
  { value: 'semana', label: 'Semana' },
  { value: 'dia', label: 'Día' },
]

export type EstadoEvento = {
  value: number,
  label: string,
  color: string,
  /** El evento no se puede abrir ni editar desde la agenda (lo gestiona el administrador) */
  bloqueado?: boolean,
}

/** Color (y si bloquea el evento) de cada estado, por su nombre en la terminología agenda / cita / estado */
const ESTILO_ESTADO: Record<string, { color: string, bloqueado?: boolean }> = {
  'pendiente': { color: '#f59f00' },
  'confirmado': { color: '#1c7ed6' },
  'atendido': { color: '#2f9e44' },
  'no asistio': { color: '#e03131' },
  'importante': { color: '#868e96', bloqueado: true },
}
/** Estado nuevo en la terminología sin color asignado aquí */
const COLOR_OTRO_ESTADO = '#adb5bd'

/** Estados de la terminología (value/label) con su color; en el orden en que se crearon */
export const armarEstados = (terminologias: { value: number, label: string }[]): EstadoEvento[] =>
  [...terminologias]
    .sort((a, b) => a.value - b.value)
    .map(({ value, label }) => ({ value, label, ...(ESTILO_ESTADO[normalizeText(label)] ?? { color: COLOR_OTRO_ESTADO }) }))

export const obtenerEstado = (estados: EstadoEvento[], id_estado: number): EstadoEvento =>
  estados.find((estado) => estado.value === id_estado) ?? { value: id_estado, label: 'Sin estado', color: COLOR_OTRO_ESTADO }

export const esEventoBloqueado = (estados: EstadoEvento[], evento: EventoAgendaProps) =>
  Boolean(obtenerEstado(estados, evento.id_estado).bloqueado)

/** Estados que el nutricionista puede asignar en el formulario (los bloqueados no) */
export const estadosSeleccionables = (estados: EstadoEvento[]) => estados.filter((estado) => !estado.bloqueado)

/** Estado con el que nace una cita: Pendiente (o el primero que se pueda elegir) */
export const idEstadoInicial = (estados: EstadoEvento[]) =>
  (estados.find((estado) => normalizeText(estado.label) === 'pendiente') ?? estadosSeleccionables(estados)[0])?.value ?? 0

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
/** La agenda no atiende domingos: se muestra de lunes a sábado */
const DIAS_VISIBLES = 6

/** Si la fecha cae domingo, el siguiente día de atención en esa dirección (1 = lunes, -1 = sábado) */
export const saltarDomingo = (fecha: Date, direccion: 1 | -1 = 1) => isSunday(fecha) ? addDays(fecha, direccion) : fecha

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

/** Días que muestra la vista mes: semanas completas de lunes a sábado (sin domingos) */
export const diasDelMes = (fecha: Date) => eachDayOfInterval({
  start: startOfWeek(startOfMonth(fecha), OPCIONES_SEMANA),
  end: endOfWeek(endOfMonth(fecha), OPCIONES_SEMANA),
}).filter((dia) => !isSunday(dia))

export const diasDeLaSemana = (fecha: Date) => {
  const inicio = startOfWeek(fecha, OPCIONES_SEMANA)
  return Array.from({ length: DIAS_VISIBLES }, (_, i) => addDays(inicio, i))
}

const capitalizar = (texto: string) => texto.charAt(0).toUpperCase() + texto.slice(1)

export const tituloVista = (vista: VistaCalendario, fecha: Date) => {
  if (vista === 'mes') return capitalizar(format(fecha, "MMMM 'de' yyyy", { locale: es }))
  if (vista === 'dia') return capitalizar(format(fecha, "EEEE d 'de' MMMM 'de' yyyy", { locale: es }))
  // "Octubre 5 - 10"; si la semana cruza de mes: "Octubre 26 - Noviembre 1"
  const dias = diasDeLaSemana(fecha)
  const inicio = dias[0]
  const fin = dias[dias.length - 1]
  const mismoMes = inicio.getMonth() === fin.getMonth()
  return `${capitalizar(format(inicio, 'MMMM d', { locale: es }))} - ${mismoMes ? format(fin, 'd') : capitalizar(format(fin, 'MMMM d', { locale: es }))}`
}
