import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { EstadoEvento } from '../helpers/agendaHelpers';

export type EventoAgendaProps = {
  id: number,
  id_cli: number,
  id_nutricionista: number,
  id_estado: number,
  /** yyyy-MM-dd */
  fecha: string,
  /** HH:mm */
  hora_inicio: string,
  /** HH:mm */
  hora_fin: string,
  label_cliente?: string,
  label_nutricionista?: string,
};
export type AgendaNutricionistaState={
    /** Citas del rango que se ve en el calendario */
    eventos: EventoAgendaProps[],
    /** Citas (de cualquier fecha) del cliente buscado en el buscador de la agenda */
    eventosBuscados: EventoAgendaProps[],
    /** true mientras se piden citas (el calendario muestra el skeleton de eventos) */
    cargandoEventos: boolean,
    evento: EventoAgendaProps,
    /** Duración de cada cita en minutos: la vista semana se divide en slots de este tamaño */
    minutosxcli: number
    /** Estados de cita (terminología agenda / cita / estado) con su color */
    estados: EstadoEvento[]
}

const initialEvento: EventoAgendaProps = {
  id: 0,
  id_cli: 0,
  id_nutricionista: 0,
  id_estado: 0,
  fecha: '',
  hora_inicio: '',
  hora_fin: '',
}
export const initialStateAgendaNutricionista: AgendaNutricionistaState = {
  evento: initialEvento,
  eventos: [],
  eventosBuscados: [],
  cargandoEventos: false,
  minutosxcli: 10,
  estados: [],
};

export const agendaNutricionistaSlice = createSlice({
  name: "AGENDA_NUTRICIONISTA",
  initialState: initialStateAgendaNutricionista,
  reducers: {
    onSetDataEventos: (state, action: PayloadAction<EventoAgendaProps[]>)=>{
      state.eventos = action.payload;
    },
    onSetEventosBuscados: (state, action: PayloadAction<EventoAgendaProps[]>)=>{
      state.eventosBuscados = action.payload;
    },
    onSetCargandoEventos: (state, action: PayloadAction<boolean>)=>{
      state.cargandoEventos = action.payload;
    },
    onSetEstadosCita: (state, action: PayloadAction<EstadoEvento[]>)=>{
      state.estados = action.payload;
    },
  },
});


export const { onSetDataEventos, onSetEventosBuscados, onSetCargandoEventos, onSetEstadosCita } = agendaNutricionistaSlice.actions;
