import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type DetalleEgresoProps = {
  id: number,
  nombre_articulo: string,
  id_unidad_medida: number,
  cantidad: number,
  id_codigo_moneda: number,
  monto: number,
  codigo_asiento:string,
  id_movimiento_financiero: number,
  id_centro_costo: number,
  id_grupo?: number,
  id_concepto?: number,
  is_old?: boolean,
};
export type DetalleEgresoState={
    detallesEgreso:DetalleEgresoProps[],
    detalleEgreso: DetalleEgresoProps,
    
}
export const initialStateDetalleEgreso={
  id: 0,
  nombre_articulo: '',
  id_unidad_medida: 0,
  cantidad: 0,
  id_codigo_moneda: 0,
  monto: 0,
  id_centro_costo: 0,
  id_movimiento_financiero: 0,
  codigo_asiento: '',
  id_grupo: 0,
  id_concepto: 0,
  is_old: false,
}
export const initialStateEgreso: DetalleEgresoState = {
  detalleEgreso: initialStateDetalleEgreso,
  detallesEgreso: [],
};

export const detalleEgresoSlice = createSlice({
  name: "DETALLE_EGRESO",
  initialState: initialStateEgreso,
  reducers: {
    // CREATE
    addDetalleEgreso: (state, action: PayloadAction<DetalleEgresoProps>) => {
      state.detalleEgreso = action.payload;
    },
    deleteDetalleEgreso: (state, action: PayloadAction<number>) => {
      state.detallesEgreso = state.detallesEgreso.filter(detalle => detalle.id !== action.payload);
    },
    updateDetalleEgreso: (state, action: PayloadAction<DetalleEgresoProps>) => {
      const index = state.detallesEgreso.findIndex(detalle => detalle.id === action.payload.id);
      if (index !== -1) {
        state.detallesEgreso[index] = action.payload;
      }
    },
    onSetDataDetalleEgresos: (state, action: PayloadAction<DetalleEgresoProps[]>)=>{
      state.detallesEgreso = action.payload;
    },
    onAddItemDetalleEgresos: (state, action: PayloadAction<DetalleEgresoProps[]>)=>{
      state.detallesEgreso=[...state.detallesEgreso, ...action.payload];
    },
    onResetDataDetalleEgresos: (state)=>{
      state.detallesEgreso=[];
    },
  },
});


export const { addDetalleEgreso, deleteDetalleEgreso, updateDetalleEgreso, onSetDataDetalleEgresos, onAddItemDetalleEgresos, onResetDataDetalleEgresos } = detalleEgresoSlice.actions;
