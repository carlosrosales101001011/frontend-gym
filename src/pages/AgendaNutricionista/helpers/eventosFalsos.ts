import { addDays } from 'date-fns'
import { initialStateAgendaNutricionista, type EventoAgendaProps } from '../store/agendaNutricionistaSlice'
import { aFechaISO, DURACION_CITA_DEFAULT, sumarMinutos } from './agendaHelpers'

// TODO: data de prueba mientras no exista /agenda-nutricionista en el backend (ver USAR_DATA_FALSA en el hook)

const ESTADO = { pendiente: 1, confirmado: 2, atendido: 3, noAsistio: 4, importante: 5 }

const NUTRICIONISTAS = [
  { id_nutricionista: 901, label_nutricionista: 'Andrea Salas Paredes' },
  { id_nutricionista: 902, label_nutricionista: 'Miguel Torres Quispe' },
]

/** Fecha relativa a hoy, para que los eventos siempre caigan en la semana/mes actual */
const diaRelativo = (dias: number) => aFechaISO(addDays(new Date(), dias))

/** Cita de un cliente: dura DURACION_CITA_DEFAULT, igual que las que se agendan por defecto desde el modal */
const cita = (
  id: number,
  label_cliente: string,
  nutricionista: number,
  id_estado: number,
  dias: number,
  hora_inicio: string,
): EventoAgendaProps => ({
  id,
  id_cli: 1000 + id,
  label_cliente,
  ...NUTRICIONISTAS[nutricionista],
  id_estado,
  fecha: diaRelativo(dias),
  hora_inicio,
  hora_fin: sumarMinutos(hora_inicio, DURACION_CITA_DEFAULT),
})

/** Evento importante (bloqueado): lo gestiona el administrador y puede ocupar varios slots */
const importante = (id: number, dias: number, hora_inicio: string, minutos: number): EventoAgendaProps => ({
  ...initialStateAgendaNutricionista.evento,
  id,
  id_estado: ESTADO.importante,
  fecha: diaRelativo(dias),
  hora_inicio,
  hora_fin: sumarMinutos(hora_inicio, minutos),
})

/** Citas y eventos importantes que no se cruzan entre sí, con todos los estados para visualizar */
export const EVENTOS_FALSOS: EventoAgendaProps[] = [
  cita(1, 'Lucía Fernández Ríos', 0, ESTADO.atendido, -2, '09:00'),
  cita(2, 'Jorge Ramírez Soto', 1, ESTADO.noAsistio, -2, '09:20'),
  cita(3, 'Carla Mendoza Vega', 0, ESTADO.atendido, -1, '16:00'),
  cita(4, 'Pablo Rojas Ortiz', 1, ESTADO.noAsistio, -1, '16:20'),
  cita(5, 'Diego Castillo Luna', 1, ESTADO.confirmado, 0, '08:00'),
  cita(6, 'Valeria Huamán Cruz', 0, ESTADO.confirmado, 0, '08:20'),
  cita(7, 'Renzo Gutiérrez Díaz', 1, ESTADO.pendiente, 0, '08:40'),
  importante(8, 0, '13:00', 60),
  cita(9, 'Sofía Chávez Rojas', 0, ESTADO.pendiente, 0, '15:20'),
  cita(10, 'Martín Flores Aguilar', 1, ESTADO.confirmado, 1, '10:00'),
  importante(11, 2, '09:00', 60),
  cita(12, 'Camila Paredes León', 0, ESTADO.pendiente, 2, '18:40'),
  cita(13, 'Andrés Vargas Molina', 1, ESTADO.pendiente, 3, '12:00'),
  // Citas anteriores de Diego Castillo (id_cli 1005) para ver su historial en el modal
  { ...cita(14, 'Diego Castillo Luna', 1, ESTADO.atendido, -14, '10:00'), id_cli: 1005 },
  { ...cita(15, 'Diego Castillo Luna', 0, ESTADO.noAsistio, -7, '11:00'), id_cli: 1005 },
]
