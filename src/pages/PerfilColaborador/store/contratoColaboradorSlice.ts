import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type ContratoColaboradorProps = {
  id: number,
  uid_empleado: string,
  id_empl: number,
  label_empl?: string,
  id_departamento: number,
  label_departamento?: string,
  id_cargo: number,
  label_cargo?: string,
  id_tipo_contrato: number,
  label_tipo_contrato?: string,
  fecha_inicio: string,
  fecha_fin: string,
  id_estado: number,
  label_estado?: string,
  sueldo: number,
  id_moneda: number,
  label_moneda?: string,
  id_frecuencia_pago: number,
  label_frecuencia_pago?: string,
  fecha_primer_sueldo: string,
}
export type ColaboradorState={
    contratosColaborador: ContratoColaboradorProps[]
}
export const initialContratoColaborador: ContratoColaboradorProps = {
  id: 0,
  uid_empleado: '',
  id_empl: 0,
  id_cargo: 0,
  id_departamento: 0,
  id_tipo_contrato: 0,
  fecha_inicio: '',
  fecha_fin: '',
  id_estado: 0,
  sueldo: 0,
  id_moneda: 0,
  fecha_primer_sueldo: '',
  id_frecuencia_pago: 0,
}
export const initialStateColaborador: ColaboradorState = {
  contratosColaborador: [],
};

export const contratoColaboradorSlice = createSlice({
  name: "CONTRATO_COLABORADOR",
  initialState: initialStateColaborador,
  reducers: {
    onSetContratosColaborador: (state, action: PayloadAction<ContratoColaboradorProps[]>) => {
      state.contratosColaborador = action.payload
    },
  },
});


export const { onSetContratosColaborador } = contratoColaboradorSlice.actions;
