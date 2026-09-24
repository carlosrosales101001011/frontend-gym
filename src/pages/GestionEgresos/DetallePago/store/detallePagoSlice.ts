import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type DetallePagoProps = {
  id: number,
  id_forma_pago: number,
  id_codigo_moneda: number,
  monto: string,
  fecha_pago: string,
  observacion: string,
  id_movimiento_financiero: number;
};
export type DetallePagoState={
    detallesPago:DetallePagoProps[],
    detallePago: DetallePagoProps
}

export const initialStateDetallePago={
    id: 0,
    id_forma_pago: 0,
    id_codigo_moneda: 0,
    monto: '',
    fecha_pago: '',
    observacion: '',
    id_movimiento_financiero: 0,
}
export const initialStatePago: DetallePagoState = {
  detallePago: initialStateDetallePago,
  detallesPago: [],
};

export const detallePagoSlice = createSlice({
  name: "DETALLE_GASTOPAGO",
  initialState: initialStatePago,
  reducers: {
    // CREATE
    addDetalleGastoPago: (state, action: PayloadAction<DetallePagoProps>) => {
      state.detallePago = action.payload;
    },
    deleteDetalleGastoPago: (state, action: PayloadAction<number>) => {
      state.detallesPago = state.detallesPago.filter(detalle => detalle.id !== action.payload);
    },
    updateDetalleGastoPago: (state, action: PayloadAction<DetallePagoProps>) => {
      const index = state.detallesPago.findIndex(detalle => detalle.id === action.payload.id);
      if (index !== -1) {
        state.detallesPago[index] = action.payload;
      }
    },
    onSetDataDetallesGastoPago: (state, action: PayloadAction<DetallePagoProps[]>)=>{
      state.detallesPago = action.payload;
    },
    onAddItemDetallesGastoPago: (state, action: PayloadAction<DetallePagoProps[]>)=>{
      state.detallesPago=[...state.detallesPago, ...action.payload];
    },
    onResetDataDetallesGastoPago: (state)=>{
      state.detallesPago=[];
    }
  },
});


export const { addDetalleGastoPago, deleteDetalleGastoPago, updateDetalleGastoPago, onSetDataDetallesGastoPago, onAddItemDetallesGastoPago, onResetDataDetallesGastoPago } = detallePagoSlice.actions;
