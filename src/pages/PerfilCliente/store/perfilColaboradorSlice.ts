import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

//id_tipo: 1, EL ID EMPLEADO
export type ColaboradorProps = {
  id: number,
  uuid: string;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  id_tipo_documento: number;
  numero_documento: string;
  fecha_nacimiento:string;
  id_genero: number;
  id_estado_civil:number;
  id_nacionalidad:number;
  telefono: string;
  email_personal:string;
  email_corporativo: string;
  id_distrito:number;
  direccion: string;
  uid_comentario:string;
  uid_contactoEmergencia:string;
};
export type ColaboradorState={
    colaborador: ColaboradorProps,
    contratosColaborador: ContratoColaboradorProps[]
}

const initialColaborador={
    id: 0,
    uuid: '',
    nombres: '',
    apellido_paterno: '',
    apellido_materno: '',
    id_tipo_documento: 0,
    numero_documento: '',
    fecha_nacimiento: new Date().toISOString(),
    id_genero: 0,
    id_estado_civil: 0,
    id_nacionalidad: 0,
    telefono: '',
    email_personal: '',
    email_corporativo: '',
    id_distrito: 0,
    direccion: '',
    uid_comentario: '',
    uid_contactoEmergencia: ''
}
export type ContratoColaboradorProps = {
  id: number,
  id_empl: number,
  id_cargo: number,
  id_departamento: number,
  id_tipo_contrato: number,
  fecha_inicio: string,
  fecha_fin: string,
  id_estado: number,
  sueldo_base: number,
  moneda: string,
  id_tipo_pago: number,
}
export const initialContratoColaborador = {
  id: 0,
  id_empl: 0,
  id_cargo: 0,
  id_departamento: 0,
  id_tipo_contrato: 0,
  fecha_inicio: '',
  fecha_fin: '',
  id_estado: 0,
  sueldo_base: 0,
  moneda: '',
  id_tipo_pago: 0,
  
}
export const initialStateColaborador: ColaboradorState = {
  colaborador: initialColaborador,
  contratosColaborador: [initialContratoColaborador]
};

export const perfilColaboradorSlice = createSlice({
  name: "PERFIL_COLABORADOR",
  initialState: initialStateColaborador,
  reducers: {
    onSetDataColaborador: (state, action: PayloadAction<ColaboradorProps>) => {
      state.colaborador = {
        ...action.payload,
        fecha_nacimiento: action.payload.fecha_nacimiento
      };
    },
    onSetContratosColaborador: (state, action: PayloadAction<ContratoColaboradorProps[]>) => {
      state.contratosColaborador = action.payload
    },
    
  },
});


export const { onSetDataColaborador, onSetContratosColaborador } = perfilColaboradorSlice.actions;
