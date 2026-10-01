import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { OpcionesSelect } from '@/types/props';

/** Valor de los seleccionables (asesor, sucursal, programa, origen) que significa "Todos" */
export const ID_TODOS = 0;

/** Membresía de una venta (programa, plan y su monto con descuento) */
export type MembresiaVentaReporteProps = {
  id_programa: number,
  id_plan: number,
  montoTotal: number,
};

/** Plan de entrenamiento (de /entrenamiento-plan): cada programa tiene sus propios planes */
export type PlanReporteVentasProps = {
  id: number,
  id_programa: number,
  label_programa: string,
  nMeses: number,
  label_tipo_tarifa: string,
};

/**
 * Venta del rango (de /venta/rango-fechas), con sus membresías.
 * Los decimales pueden llegar como string. Los montoTotal_* ya tienen el descuento restado.
 */
export type VentaReporteVentasProps = {
  id: number,
  fecha_venta: string,
  id_cli: number,
  id_empl: number,
  label_nombres_apellidos_empl: string,
  id_sucursal: number,
  id_origen: number,
  label_origen: string,
  montoTotal_membresia: number | string,
  montoTotal_productos: number | string,
  montoPagos: number | string,
  membresias: MembresiaVentaReporteProps[],
};

// Filtros del header del reporte de ventas (estado propio de este reporte)
export type ReporteVentasState={
    /** yyyy-MM-dd (vacío hasta que se inicializa con el 1 del mes) */
    fecha_inicio: string,
    /** yyyy-MM-dd (vacío hasta que se inicializa con hoy) */
    fecha_fin: string,
    /** Asesores que vendieron en el rango de fechas */
    opcionesAsesores: OpcionesSelect[],
    opcionesSucursales: OpcionesSelect[],
    opcionesProgramas: OpcionesSelect[],
    /** Todos los planes; las opciones del seleccionable se filtran por el programa elegido */
    planes: PlanReporteVentasProps[],
    idAsesorSeleccionado: number,
    idSucursalSeleccionada: number,
    idProgramaSeleccionado: number,
    idPlanSeleccionado: number,
    /** Origen de la venta (terminología origenVenta) */
    idOrigenSeleccionado: number,
}

export const initialStateReporteVentas: ReporteVentasState = {
  fecha_inicio: '',
  fecha_fin: '',
  opcionesAsesores: [],
  opcionesSucursales: [],
  opcionesProgramas: [],
  planes: [],
  idAsesorSeleccionado: ID_TODOS,
  idSucursalSeleccionada: ID_TODOS,
  idProgramaSeleccionado: ID_TODOS,
  idPlanSeleccionado: ID_TODOS,
  idOrigenSeleccionado: ID_TODOS,
};

export const reporteVentasSlice = createSlice({
  name: "REPORTE_VENTAS",
  initialState: initialStateReporteVentas,
  reducers: {
    onSetFechas: (state, action: PayloadAction<{ fecha_inicio: string, fecha_fin: string }>)=>{
      state.fecha_inicio = action.payload.fecha_inicio;
      state.fecha_fin = action.payload.fecha_fin;
    },
    /**
     * Asesores que vendieron en el rango. Solo se guardan si el rango sigue siendo el elegido
     * (evita respuestas viejas); si el asesor elegido ya no está, vuelve a "Todos".
     */
    onSetAsesores: (state, action: PayloadAction<{ fecha_inicio: string, fecha_fin: string, asesores: OpcionesSelect[] }>)=>{
      const { fecha_inicio, fecha_fin, asesores } = action.payload;
      if (fecha_inicio !== state.fecha_inicio || fecha_fin !== state.fecha_fin) return;
      state.opcionesAsesores = asesores;
      if (!asesores.some((asesor) => asesor.value === state.idAsesorSeleccionado)) state.idAsesorSeleccionado = ID_TODOS;
    },
    onSetSucursales: (state, action: PayloadAction<OpcionesSelect[]>)=>{
      state.opcionesSucursales = action.payload;
    },
    onSetProgramas: (state, action: PayloadAction<OpcionesSelect[]>)=>{
      state.opcionesProgramas = action.payload;
    },
    onSelectAsesor: (state, action: PayloadAction<number>)=>{
      state.idAsesorSeleccionado = action.payload;
    },
    onSelectSucursal: (state, action: PayloadAction<number>)=>{
      state.idSucursalSeleccionada = action.payload;
    },
    /** Los planes dependen del programa: si el plan elegido no es del nuevo programa (o se elige "Todos"), vuelve a "Todos" */
    onSelectPrograma: (state, action: PayloadAction<number>)=>{
      state.idProgramaSeleccionado = action.payload;
      const plan = state.planes.find((p) => p.id === state.idPlanSeleccionado);
      if (!plan || plan.id_programa !== action.payload) state.idPlanSeleccionado = ID_TODOS;
    },
    onSetPlanes: (state, action: PayloadAction<PlanReporteVentasProps[]>)=>{
      state.planes = action.payload;
    },
    onSelectPlan: (state, action: PayloadAction<number>)=>{
      state.idPlanSeleccionado = action.payload;
    },
    onSelectOrigen: (state, action: PayloadAction<number>)=>{
      state.idOrigenSeleccionado = action.payload;
    },
  },
});


export const { onSetFechas, onSetAsesores, onSetSucursales, onSetProgramas, onSelectAsesor, onSelectSucursal, onSelectPrograma, onSetPlanes, onSelectPlan, onSelectOrigen } = reporteVentasSlice.actions;
