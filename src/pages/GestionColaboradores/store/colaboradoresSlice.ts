import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type ColaboradorProps = {
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

  //CAMPOS INVALIDOS
  apellido_materno?: string;
  apellido_paterno?: string;
  id_genero?: number;
  id_estado_civil?: number;
  telefono?: string;
  email_personal?: string;
  email_corporativo?: string;
};
export type ColaboradorState={
    colaboradores:ColaboradorProps[],
    colaborador: ColaboradorProps
}

const initialColaborador={
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
export const initialStateColaborador: ColaboradorState = {
  colaborador: initialColaborador,
  colaboradores: [],
};

export const colaboradoresSlice = createSlice({
  name: "COLABORADOR",
  initialState: initialStateColaborador,
  reducers: {
    // CREATE
    addTerminologia: (state, action: PayloadAction<ColaboradorProps>) => {
      state.colaborador = action.payload;
    },
    onSetDataColaboradores: (state, action: PayloadAction<ColaboradorProps[]>)=>{
      state.colaboradores = action.payload;
    },
    
  },
});


export const { addTerminologia, onSetDataColaboradores } = colaboradoresSlice.actions;
