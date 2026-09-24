import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
export type SucursalProps = {
  id: number,
  codigo: string,
  nombre: string,
  id_tipo: number,
  label_tipo: string,
  direccion: string,
  ubigeo: string,
  telefono: string,
  email: string,
  id_responsable: number,
  label_responsable: string,
  id_estado: number,
  label_estado: string,
};
export type SeccionesState={
    sucursales:SucursalProps[],
    sucursal: SucursalProps
}

const initialSucursal={
    id: 0,
    codigo: '',
    nombre: '',
    id_tipo: 0,
    label_tipo: '',
    direccion: '',
    ubigeo: '',
    telefono: '',
    email: '',
    id_responsable: 0,
    label_responsable: '',
    id_estado: 0,
    label_estado: '',
}
export const initialStateSucursal: SeccionesState = {
  sucursal: initialSucursal,
  sucursales: [],
};

export const SucursalSlice = createSlice({
  name: "SUCURSAL",
  initialState: initialStateSucursal,
  reducers: {
    // CREATE
    addSucursal: (state, action: PayloadAction<SucursalProps>) => {
      state.sucursal = action.payload;
    },
    onSetDataSucursales: (state, action: PayloadAction<SucursalProps[]>)=>{
      state.sucursales = action.payload;
    },
  },
});


export const { addSucursal, onSetDataSucursales } = SucursalSlice.actions;
