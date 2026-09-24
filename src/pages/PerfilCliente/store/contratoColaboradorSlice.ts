import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type ContratoColaboradorProps = {
  id: number,
  id_empl: number,
  id_departamento: number,
  id_cargo: number,
  id_tipo_contrato: number,
  fecha_inicio: string,
  fecha_fin: string,
  id_estado: number,
  sueldo: number,
  id_moneda: string,
  id_frecuencia_pago: number,
  fecha_primer_sueldo: string;
}
export type ColaboradorState={
    contratoColaborador: ContratoColaboradorProps,
    contratosColaborador: ContratoColaboradorProps[]
}
export const initialContratoColaborador = {
  id: 0,
  id_empl: 0,
  id_cargo: 0,
  id_departamento: 0,
  id_tipo_contrato: 0,
  fecha_inicio: '',
  fecha_fin: '',
  id_estado: 0,
  sueldo: 0,
  id_moneda: '',
  fecha_primer_sueldo: '',
  id_frecuencia_pago: 0,
}
export const initialStateColaborador: ColaboradorState = {
  contratoColaborador: initialContratoColaborador,
  contratosColaborador: [initialContratoColaborador]
};

export const contratoColaboradorSlice = createSlice({
  name: "CONTRATO_COLABORADOR",
  initialState: initialStateColaborador,
  reducers: {
    onSetDataColaborador: (state, action: PayloadAction<ContratoColaboradorProps>) => {
      state.contratoColaborador = {
        ...action.payload
      };
    },
    onSetContratosColaborador: (state, action: PayloadAction<ContratoColaboradorProps[]>) => {
      state.contratosColaborador = action.payload
    },
    
  },
});


export const { onSetDataColaborador, onSetContratosColaborador } = contratoColaboradorSlice.actions;
