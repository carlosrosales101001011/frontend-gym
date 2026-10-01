import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AsesorMetaProps, MetaProps } from '@/pages/GestionMeta/store/metaSlice';

/** Asesor involucrado en la meta (de /detallemeta-asesor), con su monto de meta */
export type AsesorReporteProps = Pick<AsesorMetaProps, 'id_empl' | 'label_empl' | 'monto'>;

/** Venta del periodo de la meta (de /venta/rango-fechas); los decimales pueden llegar como string */
export type VentaReporteProps = {
  id: number,
  fecha_venta: string,
  id_empl: number,
  montoTotal_membresia: number | string,
};

/** Valor del seleccionable de asesor que significa "Todos" */
export const ID_TODOS_ASESORES = 0;

export type ReporteMetaState={
    /** Metas disponibles (de aquí salen las opciones del seleccionable y las fechas de la meta elegida) */
    metas: MetaProps[],
    /** Meta elegida en el header (0 = ninguna); el resto del reporte se basa en esta */
    idMetaSeleccionada: number,
    /** Asesores de la meta elegida */
    asesoresMeta: AsesorReporteProps[],
    /** Asesor elegido en el header (ID_TODOS_ASESORES = todos) */
    idAsesorSeleccionado: number,
}

export const initialStateReporteMeta: ReporteMetaState = {
  metas: [],
  idMetaSeleccionada: 0,
  asesoresMeta: [],
  idAsesorSeleccionado: ID_TODOS_ASESORES,
};

export const reporteMetaSlice = createSlice({
  name: "REPORTE_META",
  initialState: initialStateReporteMeta,
  reducers: {
    onSetMetas: (state, action: PayloadAction<MetaProps[]>)=>{
      state.metas = action.payload;
    },
    /** Al cambiar de meta el asesor vuelve a "Todos" y se limpian los asesores de la meta anterior */
    onSelectMeta: (state, action: PayloadAction<number>)=>{
      state.idMetaSeleccionada = action.payload;
      state.asesoresMeta = [];
      state.idAsesorSeleccionado = ID_TODOS_ASESORES;
    },
    /** Solo se guardan si siguen siendo de la meta elegida (evita respuestas viejas al cambiar rápido de meta) */
    onSetAsesoresMeta: (state, action: PayloadAction<{ id_meta: number, asesores: AsesorReporteProps[] }>)=>{
      if (action.payload.id_meta === state.idMetaSeleccionada) state.asesoresMeta = action.payload.asesores;
    },
    onSelectAsesor: (state, action: PayloadAction<number>)=>{
      state.idAsesorSeleccionado = action.payload;
    },
  },
});


export const { onSetMetas, onSelectMeta, onSetAsesoresMeta, onSelectAsesor } = reporteMetaSlice.actions;
