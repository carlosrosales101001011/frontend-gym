import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { OpcionesSelect } from '@/types/props';

export type grupoFinanzaProps = {
  id: number,
  nombre: string,
  descripcion?: string,
  orden?: number,
  id_tipo_movimiento?: number,
  
};
export type TermFinanzasProps = {
  id: number,
  id_tipo: number,
  parentId: number,
  id_grupo: number,
  concepto: string,
  codigo: string,
  fecha_fin: string,
  fecha_inicio: string,
  monto_proyectado: number,
  orden: number,
  is_limit: boolean,
  is_promediado: boolean,
  grupo?: grupoFinanzaProps,
};
export type TermFinanzasState={
    termFinanzas:TermFinanzasProps[],
    termFinanza: TermFinanzasProps,
    opcionesGruposFinanzas: OpcionesSelect[],
}

const initialTermFinanza={
  id: 0,
  id_tipo: 0,
  parentId: 0,
  id_grupo: 0,
  concepto: '',
  codigo: '',
  fecha_fin: new Date().toISOString(),
  fecha_inicio: new Date().toISOString(),
  monto_proyectado: 0,
  orden: 0,
  is_limit: true,
  is_promediado: false,
}
export const initialStateTermFinanza: TermFinanzasState = {
  termFinanza: initialTermFinanza,
  termFinanzas: [],
  opcionesGruposFinanzas: []
};

export const termFinanzasSlice = createSlice({
  name: "TERM_FINANZA",
  initialState: initialStateTermFinanza,
  reducers: {
    // CREATE
    addTermFinanza: (state, action: PayloadAction<TermFinanzasProps>) => {
      state.termFinanza = action.payload;
    },
    onSetDataTermFinanzas: (state, action: PayloadAction<TermFinanzasProps[]>)=>{
      state.termFinanzas = action.payload;
    },
    onSetDataOpcionesGruposFinanzas:(state, action: PayloadAction<OpcionesSelect[]>)=>{
      state.opcionesGruposFinanzas = action.payload;
    }
  },
});


export const { addTermFinanza, onSetDataTermFinanzas, onSetDataOpcionesGruposFinanzas } = termFinanzasSlice.actions;
