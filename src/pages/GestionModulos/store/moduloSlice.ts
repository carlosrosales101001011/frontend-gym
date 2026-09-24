import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type ModuloProps = {
  id: number,
  icono:string,
  label: string,
  descripcion: string,
  url: string,
  id_tipo: number
};
export type ModuloState={
    modulos:ModuloProps[],
    modulo: ModuloProps
}

const initialModulo={
  id: 0,
  icono:'',
  label: '',
  descripcion: '',
  url: '',
  id_tipo: 0
}
export const initialStateModulo: ModuloState = {
  modulo: initialModulo,
  modulos: [],
};

export const moduloSlice = createSlice({
  name: "MODULO",
  initialState: initialStateModulo,
  reducers: {
    // CREATE
    addModulo: (state, action: PayloadAction<ModuloProps>) => {
      state.modulo = action.payload;
    },
    onSetDataModulos: (state, action: PayloadAction<ModuloProps[]>)=>{
      state.modulos = action.payload;
    },
  },
});


export const { addModulo, onSetDataModulos } = moduloSlice.actions;
