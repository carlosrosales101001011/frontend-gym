import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type grupoFinanzaProps = {
  id: number,
  nombre: string,
  descripcion?: string,
  orden?: number,
  id_tipo_movimiento?: number,
};
export type GrupoFinanzasState={
    gruposFinanzas:grupoFinanzaProps[],
    grupoFinanza: grupoFinanzaProps
}

const initialImpuesto: grupoFinanzaProps = {
  id: 0,
  nombre: '',
  descripcion: '',
  orden: 0,
  id_tipo_movimiento: 0,
}
export const initialStateGrupoFinanzas: GrupoFinanzasState = {
  grupoFinanza: initialImpuesto,
  gruposFinanzas: [],
};

export const grupoFinanzasSlice = createSlice({
  name: "GRUPO_FINANZAS",
  initialState: initialStateGrupoFinanzas,
  reducers: {
    // CREATE
    addImpuesto: (state, action: PayloadAction<grupoFinanzaProps>) => {
      state.grupoFinanza = action.payload;
    },
    onSetDataImpuestos: (state, action: PayloadAction<grupoFinanzaProps[]>)=>{
      state.gruposFinanzas = action.payload;
    },
  },
});


export const { addImpuesto, onSetDataImpuestos } = grupoFinanzasSlice.actions;
