import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

/** Compromiso de pago (de /compromisos-pago-cliente); los decimales pueden llegar como string */
export type CompromisoPagoProps = {
  id: number,
  id_cli: number,
  nombres_apellidos_clientes?: string | null,
  id_venta: number,
  monto_total_deuda: number | string,
  monto_comprometido: number | string,
  monto_pagado: number | string,
  /** Terminología compromiso / pago / motivo */
  id_motivo: number,
  label_motivo?: string | null,
  observacion: string,
  /** Terminología compromiso / pago / estado */
  id_estado: number,
  label_estado?: string | null,
  /** Colaborador a cargo */
  id_empl: number,
  nombres_apellidos_empl?: string | null,
};

export type CompromisoPagoState = {
  compromisosPago: CompromisoPagoProps[],
  compromisoPago: CompromisoPagoProps,
}

const initialCompromisoPago: CompromisoPagoProps = {
  id: 0,
  id_cli: 0,
  id_venta: 0,
  monto_total_deuda: 0,
  monto_comprometido: 0,
  monto_pagado: 0,
  id_motivo: 0,
  observacion: '',
  id_estado: 0,
  id_empl: 0,
}
export const initialStateCompromisoPago: CompromisoPagoState = {
  compromisoPago: initialCompromisoPago,
  compromisosPago: [],
};

export const compromisoPagoSlice = createSlice({
  name: "COMPROMISO_PAGO",
  initialState: initialStateCompromisoPago,
  reducers: {
    onSetDataCompromisosPago: (state, action: PayloadAction<CompromisoPagoProps[]>)=>{
      state.compromisosPago = action.payload;
    },
  },
});


export const { onSetDataCompromisosPago } = compromisoPagoSlice.actions;
