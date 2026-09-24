import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

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
    eventos: EventoAgendaProps[],
    evento: EventoAgendaProps,
    /** Duración de cada cita en minutos: la vista semana se divide en slots de este tamaño */
    minutosxcli: number
}

const initialEvento: EventoAgendaProps = {
  id: 0,
  id_cli: 0,
  id_nutricionista: 0,
  id_estado: 1,
  fecha: '',
  hora_inicio: '',
  hora_fin: '',
}
export const initialStateAgendaNutricionista: AgendaNutricionistaState = {
  evento: initialEvento,
  eventos: [],
  minutosxcli: 10,
};

export const agendaNutricionistaSlice = createSlice({
  name: "AGENDA_NUTRICIONISTA",
  initialState: initialStateAgendaNutricionista,
  reducers: {
    onSetDataEventos: (state, action: PayloadAction<EventoAgendaProps[]>)=>{
      state.eventos = action.payload;
    },
  },
});


export const { onSetDataEventos } = agendaNutricionistaSlice.actions;
