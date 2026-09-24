import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type TCProps = {
  id: number,
  id_codigo_monedaOrigen: number,
  id_codigo_monedaDestino: number,
  label_codigo_monedaOrigen?: string,
  label_codigo_monedaDestino?: string,
  venta: number,
  compra: number,
  fecha: string,
};
export type TCState={
    tcs: TCProps[],
    tc: TCProps
}

const initialTC={
  id: 0,
  id_codigo_monedaOrigen: 0,
  id_codigo_monedaDestino: 0,
  venta: 0,
  compra: 0,
  fecha: new Date().toISOString(),
}
export const initialStateTC: TCState = {
  tc: initialTC,
  tcs: [],
};

export const tcSlice = createSlice({
  name: "TC",
  initialState: initialStateTC,
  reducers: {
    // CREATE
    addTC: (state, action: PayloadAction<TCProps>) => {
      state.tc = action.payload;
    },
    onSetDataTCs: (state, action: PayloadAction<TCProps[]>)=>{
      state.tcs = action.payload;
    },
  },
});


export const { addTC, onSetDataTCs } = tcSlice.actions;
