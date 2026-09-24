import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type ClienteProps = {
  uid: string;
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
  uid_avatar?: string;
  url_avatar?: string;

  //CAMPOS INVALIDOS
  apellido_materno?: string;
  apellido_paterno?: string;
  id_genero?: number;
  id_estado_civil?: number;
  telefono?: string;
  email_personal?: string;
  email_corporativo?: string;

  label_tipo_documento?:string;
};
export type ClienteState={
    clientes:ClienteProps[],
    cliente: ClienteProps
}

const initialCliente={
  uid: '',
  id: 0,
  id_tipo_documento: 0,
  nombres: '',
  apodo: '',
  numero_documento: '',
  fecha_nacimiento: new Date().toISOString(),
  id_nacionalidad: 0,
  id_distrito: 0,
  direccion: '',
  id_estado: 0,
  id_tipo: 2,
  uid_avatar: '',
  url_avatar: '',

  //CAMPOS INVALIDOS
  apellido_materno: '',
  apellido_paterno: '',
  id_genero: 0,
  id_estado_civil: 0,
  telefono: '',
  email_personal: '',
  email_corporativo: '',
  label_tipo_documento: ''
}
export const initialStateClientes: ClienteState = {
  cliente: initialCliente,
  clientes: [],
};

export const clientesSlice = createSlice({
  name: "CLIENTE",
  initialState: initialStateClientes,
  reducers: {
    // CREATE
    addCliente: (state, action: PayloadAction<ClienteProps>) => {
      state.cliente = action.payload;
    },
    onSetDataClientes: (state, action: PayloadAction<ClienteProps[]>)=>{
      state.clientes = action.payload;
    },

  },
});


export const { addCliente, onSetDataClientes } = clientesSlice.actions;
