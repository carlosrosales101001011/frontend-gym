import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

/** Asistencia (persona_eventos_asistencia): una marcación de entrada, salida, etc. de una persona */
export type AsistenciaProps = {
  id: number;
  id_persona: number;
  /** Lo arma el backend con los nombres de la persona */
  label_nombres_apellidos_persona?: string | null;
  id_tipo_evento: number;
  /** Lo arma el backend con el valor de la terminología */
  label_tipo_evento?: string | null;
  /** Número de serie del dispositivo que registró la marcación (opcional) */
  deviceSN?: string | null;
  /** Fecha y hora de la marcación (la pone el backend al crear) */
  fecha_registro: string;
};

export type AsistenciasState = {
  asistencias: AsistenciaProps[];
};

export const initialStateAsistencias: AsistenciasState = {
  asistencias: [],
};

export const asistenciasSlice = createSlice({
  name: "ASISTENCIAS",
  initialState: initialStateAsistencias,
  reducers: {
    onSetDataAsistencias: (state, action: PayloadAction<AsistenciaProps[]>) => {
      state.asistencias = action.payload;
    },
  },
});

export const { onSetDataAsistencias } = asistenciasSlice.actions;
