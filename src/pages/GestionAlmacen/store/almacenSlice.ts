import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { OpcionesSelect } from '@/types/props';
export type AlmacenProps = {
  id: number,
  codigo: string,
  nombre: string,
  id_sucursal: number,
  id_tipo: number,
  direccion: string,
  id_responsable: number,
  id_estado: number,
  label_sucursal?: string|null,
    label_tipo?: string|null,
    label_responsable?: string|null,
    label_estado?: string|null,
    capacidad: number,
};
export type SucursalProps = {
  id: number,
  nombre: string,
}
export type SeccionesState={
    almacenes:AlmacenProps[],
    almacen: AlmacenProps,
    opcionesSucursales: OpcionesSelect[]
}

const initialAlmacen={
    id: 0,
    codigo: '',
    nombre: '',
    id_sucursal: 0,
    id_tipo: 0,
    direccion: '',
    id_responsable: 0,
    id_estado: 0,
    capacidad: 0,
}
export const initialStateAlmacen: SeccionesState = {
  almacen: initialAlmacen,
  almacenes: [],
  opcionesSucursales: []
};

export const AlmacenSlice = createSlice({
  name: "ALMACEN",
  initialState: initialStateAlmacen,
  reducers: {
    // CREATE
    addAlmacen: (state, action: PayloadAction<AlmacenProps>) => {
      state.almacen = action.payload;
    },
    onSetDataAlmacenes: (state, action: PayloadAction<AlmacenProps[]>)=>{
      state.almacenes = action.payload;
    },
    onSetDataOpcionesSucursales:(state, action: PayloadAction<OpcionesSelect[]>)=>{
      state.opcionesSucursales = action.payload;
    },
  },
});


export const { addAlmacen, onSetDataAlmacenes, onSetDataOpcionesSucursales } = AlmacenSlice.actions;
