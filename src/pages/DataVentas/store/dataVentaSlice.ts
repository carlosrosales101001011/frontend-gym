import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type DataVentaProps = {
  id:number;
  label_nombres_apellidos_empl: string,
  label_nombres_apellidos_cli: string,
  montoTotal_membresia: number;
  montoTotal_productos: number;
  montoPagos:number;
  label_origen: string,
  label_tipo_comprobante: string,
  n_comprobante: string,
  observacion: string
};
export type DataVentaState={
    dataVentas:DataVentaProps[],
}

// const initialVenta={
//   label_nombre_empl: '',
//   label_nombre_cli: '',
//   label_origen: '',
//   label_tipo_comprobante: '',
//   n_comprobante: '',
//   observacion: ''
// }
export const initialStateVenta: DataVentaState = {
  dataVentas: [],
};

export const dataVentaSlice = createSlice({
  name: "DATAVENTAS",
  initialState: initialStateVenta,
  reducers: {
    // CREATE
    onSetDataVentas: (state, action: PayloadAction<DataVentaProps[]>)=>{
      state.dataVentas = action.payload;
    },

  },
});


export const {  onSetDataVentas } = dataVentaSlice.actions;
