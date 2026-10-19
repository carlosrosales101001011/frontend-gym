import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { OpcionesSelect } from '@/types/props';

/** Valor de los seleccionables (nutricionista, estado) que significa "Todos" */
export const ID_TODOS = 0;

/** Cita del rango (de /agenda-nutricionista/rango), con la fecha y la hora ya normalizadas */
export type CitaReporteProps = {
  id: number,
  id_cli: number,
  label_cliente: string,
  /** El nutricionista (colaborador) */
  id_empl: number,
  label_nutricionista: string,
  /** yyyy-MM-dd */
  fecha: string,
  /** HH:mm */
  hora_inicio: string,
  /** Terminología agenda / cita / estado */
  id_estado: number,
};

// Filtros del header del reporte de citas (estado propio de este reporte)
export type ReporteCitasState={
    /** yyyy-MM-dd (vacío hasta que se inicializa con el 1 del mes) */
    fecha_inicio: string,
    /** yyyy-MM-dd (vacío hasta que se inicializa con hoy) */
    fecha_fin: string,
    /** Nutricionistas con citas en el rango de fechas */
    opcionesNutricionistas: OpcionesSelect[],
    idNutricionistaSeleccionado: number,
    idEstadoSeleccionado: number,
}

export const initialStateReporteCitas: ReporteCitasState = {
  fecha_inicio: '',
  fecha_fin: '',
  opcionesNutricionistas: [],
  idNutricionistaSeleccionado: ID_TODOS,
  idEstadoSeleccionado: ID_TODOS,
};

export const reporteCitasSlice = createSlice({
  name: "REPORTE_CITAS",
  initialState: initialStateReporteCitas,
  reducers: {
    onSetFechas: (state, action: PayloadAction<{ fecha_inicio: string, fecha_fin: string }>)=>{
      state.fecha_inicio = action.payload.fecha_inicio;
      state.fecha_fin = action.payload.fecha_fin;
    },
    /**
     * Nutricionistas con citas en el rango. Solo se guardan si el rango sigue siendo el elegido
     * (evita respuestas viejas); si el nutricionista elegido ya no está, vuelve a "Todos".
     */
    onSetNutricionistas: (state, action: PayloadAction<{ fecha_inicio: string, fecha_fin: string, nutricionistas: OpcionesSelect[] }>)=>{
      const { fecha_inicio, fecha_fin, nutricionistas } = action.payload;
      if (fecha_inicio !== state.fecha_inicio || fecha_fin !== state.fecha_fin) return;
      state.opcionesNutricionistas = nutricionistas;
      if (!nutricionistas.some((nutricionista) => nutricionista.value === state.idNutricionistaSeleccionado)) state.idNutricionistaSeleccionado = ID_TODOS;
    },
    onSelectNutricionista: (state, action: PayloadAction<number>)=>{
      state.idNutricionistaSeleccionado = action.payload;
    },
    onSelectEstado: (state, action: PayloadAction<number>)=>{
      state.idEstadoSeleccionado = action.payload;
    },
  },
});


export const { onSetFechas, onSetNutricionistas, onSelectNutricionista, onSelectEstado } = reporteCitasSlice.actions;
