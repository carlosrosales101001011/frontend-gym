import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type ProveedorProps = {
  id: number,
  id_tipo_documento: number;
  numero_documento: string;
  nombres: string;
  apodo: string;
  fecha_nacimiento:string;
  id_nacionalidad:number;
  id_distrito:number;
  direccion: string;
  id_estado: number;
  id_tipo: number;

  //CAMPOS INVALIDOS
  apellido_materno?: string;
  apellido_paterno?: string;
  id_genero?: number;
  id_estado_civil?: number;
  telefono?: string;
  email_personal?: string;
  email_corporativo?: string;
};
export type ProveedoresState={
    proveedores:ProveedorProps[],
    proveedor: ProveedorProps
}

const initialProveedor={
  id: 0,
  id_tipo_documento: 0,
  nombres: '',
  apodo: '',
  numero_documento: '',
  fecha_nacimiento: '2000-01-01',
  id_nacionalidad: 0,
  id_distrito: 0,
  direccion: '',
  id_estado: 0,
  id_tipo: 3,

  //CAMPOS INVALIDOS
  apellido_materno: '',
  apellido_paterno: '',
  id_genero: 0,
  id_estado_civil: 0,
  telefono: '',
  email_personal: '',
  email_corporativo: '',
}
export const initialStateProveedor: ProveedoresState = {
  proveedor: initialProveedor,
  proveedores: [],
};

export const proveedorSlice = createSlice({
  name: "PROVEEDOR",
  initialState: initialStateProveedor,
  reducers: {
    // CREATE
    addProveedor: (state, action: PayloadAction<ProveedorProps>) => {
      state.proveedor = action.payload;
    },
    onSetDataProveedores: (state, action: PayloadAction<ProveedorProps[]>)=>{
      state.proveedores = action.payload;
    },
  },
});


export const { addProveedor, onSetDataProveedores } = proveedorSlice.actions;