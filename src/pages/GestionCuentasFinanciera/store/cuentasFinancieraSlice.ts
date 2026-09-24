import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type CuentaFinancieraProps = {
  id: number,
  id_tipo_cuenta: number,
  id_codigo_moneda: number,
  id_banco: number,
  n_cuenta: string,
  cci: string,
  titular: string,
  saldo_inicial: number,
  saldo_actual?: number,
  estado: boolean,
  descripcion: string,
  label_tipo_cuenta?: string|null,
  label_codigo_moneda?: string|null,
  label_banco?: string|null
};
export type CuentaFinancieraState={
    cuentasFinancieras:CuentaFinancieraProps[],
    cuentaFinanciera: CuentaFinancieraProps
}

const initialCuentaFinanciera = {
  id: 0,
  id_tipo_cuenta: 0,
  id_codigo_moneda: 0,
  id_banco: 0,
  n_cuenta: '',
  cci: '',
  titular: '',
  saldo_inicial: 0,
  estado: true,
  descripcion: '',
}
export const initialStateCuentaFinanciera: CuentaFinancieraState = {
  cuentaFinanciera: initialCuentaFinanciera,
  cuentasFinancieras: [],
};

export const cuentasFinancierasSlice = createSlice({
  name: "CUENTAS_FINANCIERAS",
  initialState: initialStateCuentaFinanciera,
  reducers: {
    // CREATE
    addCuentaFinanciera: (state, action: PayloadAction<CuentaFinancieraProps>) => {
      state.cuentaFinanciera = action.payload;
    },
    onSetDataCuentasFinancieras: (state, action: PayloadAction<CuentaFinancieraProps[]>)=>{
      state.cuentasFinancieras = action.payload;
    },
  },
});


export const { addCuentaFinanciera, onSetDataCuentasFinancieras } = cuentasFinancierasSlice.actions;
