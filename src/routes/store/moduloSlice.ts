import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { IconName } from '@/components/Icons/IconCR';

export type moduloProps = {
  id: number;
  id_user: number;
  id_modulo: number;
  id_modulouser:number;
  is_favorito: boolean;
  is_fijado: boolean;
  id_seccion: number;
  seccion:{
    id: number;
    subSeccion: string;
    label: string;
    url:string
  },
  modulo:{
    id_tipo: number,
    icono?: IconName,
    label: string,
    descripcion: string
  }
};
export type moduloState={
    modulos: moduloProps[],
    moduloActivo: moduloProps
}

const initialModulos={
  id: 0,
  id_user: 0,
  id_modulo: 0,
  id_modulouser: 0,
  is_favorito: false,
  is_fijado: false,
  id_seccion: 0,
  seccion: {
    id: 0,
    subSeccion: '',
    label: '',
    url: ''
  },
  modulo: {
    id_tipo: 0,
    icono: '' as IconName,
    descripcion: '',
    label: '',
  }
}
export const initialStateModulo: moduloState = {
  modulos: [initialModulos],
  moduloActivo: initialModulos
};

export const moduloSlice = createSlice({
  name: "MODULO",
  initialState: initialStateModulo,
  reducers: {
    // CREATE
    onSetModulos: (state, action:PayloadAction<moduloProps[]>)=>{
      state.modulos =action.payload
    },
    onGetModulosxID:(state, action)=>{
      state.moduloActivo =  state.modulos.find((m) => m.id_modulo === action.payload.id) || initialModulos
    }
  },
});


export const { onSetModulos, onGetModulosxID } = moduloSlice.actions;
