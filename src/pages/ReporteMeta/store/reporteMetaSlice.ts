import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AsesorMetaProps, MetaProps } from '@/pages/GestionMeta/store/metaSlice';

/** Asesor involucrado en la meta (de /detallemeta-asesor), con su monto de meta */
export type AsesorReporteProps = Pick<AsesorMetaProps, 'id_empl' | 'label_empl' | 'monto'>;

/** Venta del periodo de la meta (de /venta/rango-fechas); los decimales pueden llegar como string */
export type VentaReporteProps = {
  id: number,
  fecha_venta: string,
  /** Con por_fecha_pago: primer pago de la venta dentro del periodo (yyyy-MM-dd); null por fecha de venta */
  fecha_pago: string | null,
  id_empl: number,
  label_nombres_apellidos_empl: string | null,
  label_nombres_apellidos_cli: string | null,
  label_documento_cli: string | null,
  n_comprobante: string | null,
  montoTotal_membresia: number | string,
  montoTotal_productos: number | string,
  /** Tipo de cliente de la venta: Nuevo, Renovación, Reinscripción (terminología venta/cliente/tipo) */
  id_tipo_cli: number | null,
  label_tipo_cli: string | null,
};

/** Pago (ingreso) del periodo de la meta (de /detalleventa-pagos/rango-fechas) */
export type PagoReporteProps = {
  id: number,
  id_venta: number,
  /** yyyy-MM-dd */
  fecha_pago: string,
  id_forma_pago: number,
  monto: number,
  /** Total de la venta del pago (membresías + productos) */
  monto_venta: number,
  n_comprobante: string | null,
  id_empl: number,
  label_nombres_apellidos_empl: string | null,
  label_nombres_apellidos_cli: string | null,
  label_documento_cli: string | null,
  id_tipo_cli: number | null,
  label_tipo_cli: string | null,
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
    /** true: el periodo se aplica a la fecha de pago (por defecto); false: a la fecha de venta */
    porFechaPago: boolean,
}

export const initialStateReporteMeta: ReporteMetaState = {
  metas: [],
  idMetaSeleccionada: 0,
  asesoresMeta: [],
  idAsesorSeleccionado: ID_TODOS_ASESORES,
  porFechaPago: true,
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
    onSetPorFechaPago: (state, action: PayloadAction<boolean>)=>{
      state.porFechaPago = action.payload;
    },
  },
});


export const { onSetMetas, onSelectMeta, onSetAsesoresMeta, onSelectAsesor, onSetPorFechaPago } = reporteMetaSlice.actions;
