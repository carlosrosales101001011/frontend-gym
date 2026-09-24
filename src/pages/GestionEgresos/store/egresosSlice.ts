import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { OpcionesSelect } from '@/types/props';

export type EgresosProps = {
  id: number,
  n_comprobante: string,
  fecha_comprobante: string,
  id_tipo_comprobante: number,
  id_proveedor: number,
  observacion: string,
  monto_detalle: number,
  monto_pagos: number,
  id_codigo_moneda:number,
  tipoComprobante?: {
    valor?: number;
  }
};
export type ProveedorProps = {
  id: number,
  id_tipo_documento: number;
  numero_documento: string;
  nombres: string;
  apodo: string;
};
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
};

export type grupoFinanzaProps = {
  id: number,
  nombre: string,
  descripcion: string,
  estado: number,
  fecha_creacion: string,
}
export type conceptoFinanzaProps={
  id: number,
  concepto: string,
  descripcion: string,
  estado: number,
}
export type EgresosState={
    egresos:EgresosProps[],
    egreso: EgresosProps,
    opcionesProveedores: OpcionesSelect[],
    opcionesCuentasFinancieras: OpcionesSelect[],
    opcionesGruposFinanzas: OpcionesSelect[],
    opcionesConceptosFinanzas: OpcionesSelect[],
}

const initialEgreso={
  id: 0,
  n_comprobante: '',
  fecha_comprobante: new Date().toISOString(),
  id_tipo_comprobante: 0,
  id_proveedor: 0,
  observacion: '',
  monto_detalle: 0,
  monto_pagos: 0,
  id_codigo_moneda: 0,
  tipoComprobante: {
    valor: 0,
  }
}
export const initialStateEgreso: EgresosState = {
  egreso: initialEgreso,
  egresos: [],
  opcionesProveedores: [],
  opcionesCuentasFinancieras: [],
  opcionesGruposFinanzas: [],
  opcionesConceptosFinanzas: []
};

export const egresosSlice = createSlice({
  name: "EGRESO",
  initialState: initialStateEgreso,
  reducers: {
    // CREATE
    addEgreso: (state, action: PayloadAction<EgresosProps>) => {
      state.egreso = action.payload;
    },
    onSetDataEgresos: (state, action: PayloadAction<EgresosProps[]>)=>{
      state.egresos = action.payload;
    },
    onSetDataOpcionesProveedores:(state, action: PayloadAction<OpcionesSelect[]>)=>{
      state.opcionesProveedores = action.payload;
    },
    onSetDataOpcionesCuentasFinancieras:(state, action: PayloadAction<OpcionesSelect[]>)=>{
      state.opcionesCuentasFinancieras = action.payload;
    },
    onSetDataOpcionesGruposFinanzas:(state, action: PayloadAction<OpcionesSelect[]>)=>{
      state.opcionesGruposFinanzas = action.payload;
    },
    onSetDataOpcionesConceptosFinanzas:(state, action: PayloadAction<OpcionesSelect[]>)=>{
      state.opcionesConceptosFinanzas = action.payload;
    }
  },
});


export const { addEgreso, onSetDataEgresos, onSetDataOpcionesProveedores, onSetDataOpcionesCuentasFinancieras, onSetDataOpcionesGruposFinanzas, onSetDataOpcionesConceptosFinanzas } = egresosSlice.actions;
