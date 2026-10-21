import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { formatDate } from '@/helpers/FormatDate';
import type { OpcionesSelect } from '@/types/props';

/** Fila de GET /persona-eventos-asistencia/reporte-clientes: una asistencia con el programa y horario de su membresía */
export type AsistenciaReporteProps = {
  id: number,
  id_persona: number,
  label_nombres_apellidos_persona: string,
  fecha_registro: string,
  label_nombres_apellidos_usercreated?: string | null,
  id_seguimiento?: number | null,
  fecha_vencimiento?: string | null,
  id_programa?: number | null,
  label_programa?: string | null,
  id_horario?: number | null,
  label_horario?: string | null,
  label_plan?: string | null,
};

/** Valor del seleccionable de programa que significa "Todos" */
export const ID_TODOS_PROGRAMAS = 0;

export type FiltrosReporteAsistencia = {
  /** yyyy-mm-dd (fecha de la asistencia, inclusive) */
  fecha_inicio: string,
  fecha_fin: string,
  /** ID_TODOS_PROGRAMAS = todos */
  id_programa: number,
  /** Texto dentro del horario de la membresía (ej. "07:00") */
  horario: string,
};

/** GET /persona-eventos-asistencia/reporte-clientes/resumen: clientes con membresía vigente en el rango (del programa) */
export type ResumenClientesProps = {
  /** No asistieron en el rango */
  clientes_sin_asistir: number,
  /** Última asistencia hace 7–13 días (hasta la fecha fin) */
  clientes_en_riesgo: number,
  /** Última asistencia hace ≥ 14 días (hasta la fecha fin) */
  clientes_criticos: number,
  /** Sin ninguna asistencia */
  clientes_nunca_asistieron: number,
};

export type ReporteAsistenciaState = {
  filtros: FiltrosReporteAsistencia,
  /** Opciones del seleccionable de programa ("Todos" primero) */
  opcionesProgramas: OpcionesSelect[],
  asistencias: AsistenciaReporteProps[],
  /** Lo calcula el backend */
  resumen: ResumenClientesProps,
  cargando: boolean,
};

const hoy = () => formatDate(new Date(), 'yyyy-mm-dd', 'yyyy-mm-dd');

export const initialStateReporteAsistencia: ReporteAsistenciaState = {
  // Por defecto: hoy
  filtros: { fecha_inicio: hoy(), fecha_fin: hoy(), id_programa: ID_TODOS_PROGRAMAS, horario: '' },
  opcionesProgramas: [],
  asistencias: [],
  resumen: { clientes_sin_asistir: 0, clientes_en_riesgo: 0, clientes_criticos: 0, clientes_nunca_asistieron: 0 },
  cargando: false,
};

export const reporteAsistenciaSlice = createSlice({
  name: 'REPORTE_ASISTENCIA',
  initialState: initialStateReporteAsistencia,
  reducers: {
    onSetFiltroReporteAsistencia: (state, action: PayloadAction<Partial<FiltrosReporteAsistencia>>) => {
      state.filtros = { ...state.filtros, ...action.payload };
    },
    onSetOpcionesProgramas: (state, action: PayloadAction<OpcionesSelect[]>) => {
      state.opcionesProgramas = action.payload;
    },
    onSetAsistenciasReporte: (state, action: PayloadAction<{ asistencias: AsistenciaReporteProps[], resumen: ResumenClientesProps }>) => {
      state.asistencias = action.payload.asistencias;
      state.resumen = action.payload.resumen;
    },
    onSetCargandoReporte: (state, action: PayloadAction<boolean>) => {
      state.cargando = action.payload;
    },
  },
});

export const { onSetFiltroReporteAsistencia, onSetOpcionesProgramas, onSetAsistenciasReporte, onSetCargandoReporte } = reporteAsistenciaSlice.actions;
