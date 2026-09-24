import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type SeccionxModuloProps = {
  id: number;
  id_modulo?:number;
  label: string;
  sections: SeccionesProps[]
}
export type SeccionesEntidadProps = {
  id?: number;
  id_modulo:number;
  label?: string;
  entities?: EntidadProps[]
}
export type SeccionesProps = {
  id: number;
  label: string;
}
export type EntidadProps = {
  id: number;
  id_entidad:number;
  id_user:number;
  id_estado_CREATE: number;
  id_estado_READ: number;
  id_estado_UPDATE: number;
  id_estado_DELETE: number;
  id_estado_EXPORT?: number;
  id_estado_IMPORT?: number;
  id_seccion: number;
  is_fijado: boolean;
  description:string;
  title:string;
  entidad: {
    valor: string;
  }
}
export type ModuloProps = {
  id: number;
  is_fijado: boolean;
  title: string;
  descripcion: string;
  modulo: {
    label: string;
    descripcion: string;
  }
}
export type UserProps = {
  id?:number;
  uuid: string;
  nombres: string;
  apellidos: string;
  email_corporativo: string;
  email: string;
  telefono: string;
  password: string;
  id_estado:number;
  id_empl: number;
  id_rol: number;
  is_super_user: boolean;
  id_userParent:number;
  fecha_creacion: Date;
};
export type UserState={
    users:UserProps[],
    entidades: SeccionesEntidadProps[],
    secciones: SeccionesProps[],
    user: UserProps,
    modulos: ModuloProps[];
    seccionesxModulo: SeccionxModuloProps[];

}
export type Entidades= EntidadProps[];

export const initialEntidad={
  id_entidad: 0, 
  id_estado_CREATE: 15,
  id_estado_DELETE: 15,
  id_estado_READ: 15,
  id_estado_UPDATE: 15,
  description: '',
  id_seccion: 0,
  is_fijado: false,
  entidad: {
    valor: ''
  },
  id: 0,
  id_user: 0,
  title: ''
}
const initialUser={
    id: 0,
    uuid: '',
    nombres: '',
    apellidos: '',
    email_corporativo: '',
    email: '',
    telefono: '',
    password: '',
    id_estado: 0,
    id_empl: 0,
    id_rol: 0,
    id_userParent:0,
    is_super_user: false,
    fecha_creacion: new Date(),
}
export const initialStateUser: UserState = {
  users: [],
  user: initialUser,
  entidades: [],
  modulos: [],
  secciones: [],
  seccionesxModulo: []
};

export const usuariosSlice = createSlice({
  name: "USER",
  initialState: initialStateUser,
  reducers: {
    // CREATE
    addUser: (state, action: PayloadAction<UserProps>) => {
      state.user = action.payload;
    },
    addSeccionesxEntidad: (state, action: PayloadAction<SeccionesEntidadProps[]>) => {
      state.entidades = action.payload;
    },
    addSecciones: (state, action: PayloadAction<SeccionesProps[]>) => {
      state.secciones = action.payload;
    },
    updateOneEntidad: (state, action:PayloadAction<Partial<EntidadProps> & { id: number }>)=>{
      
      const entidad = state.entidades.find(
        u => u.id === action.payload.id
      );
      if (entidad) {
        Object.assign(entidad, action.payload);
      }
    },
    
    onSetDataModulos: (state, action: PayloadAction<ModuloProps[]>) => {
      state.modulos = action.payload;
    },
    addSeccionesxModulo: (state, action: PayloadAction<SeccionxModuloProps[]>) => {
      state.seccionesxModulo = action.payload;
    },
    onSetDataUsers:(state, action: PayloadAction<UserProps[]>)=>{
      state.users = action.payload;
    }
  },
});


export const { addUser, onSetDataUsers, updateOneEntidad, onSetDataModulos, addSecciones, addSeccionesxModulo, addSeccionesxEntidad } = usuariosSlice.actions;
