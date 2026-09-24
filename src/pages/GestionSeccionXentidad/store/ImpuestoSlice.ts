import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type ImpuestosProps = {
  id: number,
  codigo: string,
  nombre: string,
  descripcion?: string,
  porcentaje: number,
  monto: number,
  id_tipo: number,
  id_aplica_sobre: number,
  id_base_calculo: number,
};
export type ImpuestosState={
    impuestos:ImpuestosProps[],
    impuesto: ImpuestosProps
}

const initialImpuesto={
  id: 0,
  codigo: '',
  nombre: '',
  descripcion: '',
  porcentaje: 0,
  monto: 0,
  id_tipo: 0,
  id_aplica_sobre: 0,
  id_base_calculo: 0,
}
export const initialStateImpuesto: ImpuestosState = {
  impuesto: initialImpuesto,
  impuestos: [],
};

export const impuestosSlice = createSlice({
  name: "IMPUESTO",
  initialState: initialStateImpuesto,
  reducers: {
    // CREATE
    addImpuesto: (state, action: PayloadAction<ImpuestosProps>) => {
      state.impuesto = action.payload;
    },
    onSetDataImpuestos: (state, action: PayloadAction<ImpuestosProps[]>)=>{
      state.impuestos = action.payload;
    },
  },
});


export const { addImpuesto, onSetDataImpuestos } = impuestosSlice.actions;
