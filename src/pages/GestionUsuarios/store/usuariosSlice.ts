import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { OpcionesSelect } from '@/types/props';

export type UserProps = {
  id?:number;
  uuid: string;
  nombres: string;
  apellidos: string;
  email_corporativo: string;
  email: string;
  /** Para iniciar sesión (además del email); único */
  usuario: string;
  telefono: string;
  password: string;
  id_estado:number;
  id_empl: number;
  id_rol: number;
  is_super_user: boolean;
  id_userParent:number;
  /** "Nombres Apellidos" de quien lo registró (lo pone el backend) */
  label_nombres_apellidos_userParent?: string;
  /** La pone guardarUsuario al registrar; en el store va como texto (Redux solo guarda valores serializables) */
  fecha_creacion: string;
};

/** Sección que quien registra puede asignar (sale de sus propios módulos) */
export type SeccionDisponibleProps = {
  id_seccion: number;
  id_modulo: number;
  label: string;
  /** Entidades de la sección (sus permisos CRUD se eligen en el paso "Entidades") */
  ids_entidad: number[];
}

export type ModuloDisponibleProps = {
  id_modulo: number;
  label: string;
  secciones: SeccionDisponibleProps[];
}

/** Permisos CRUD de un usuario sobre una entidad (entidad_x_user) */
export type PermisoEntidadProps = {
  id_entidad: number;
  label_entidad: string;
  id_estado_CREATE: number;
  id_estado_READ: number;
  id_estado_UPDATE: number;
  id_estado_DELETE: number;
}

export type UserState = {
  users: UserProps[],
  /** Datos del paso "Información" del usuario que se está registrando */
  user: UserProps,
  /** Secciones elegidas en el paso "Módulos" */
  idsSeccionAsignadas: number[],
  /** Módulos y secciones de quien registra: solo puede asignar lo que él tiene */
  modulosDisponibles: ModuloDisponibleProps[],
  /** Permisos de quien registra: solo puede otorgar las acciones que tiene autorizadas */
  permisosCreador: PermisoEntidadProps[],
  /** Quien registra es super usuario: puede otorgar todas las acciones, tenga o no el permiso */
  creadorEsSuperUsuario: boolean,
  opcionesEmpleados: OpcionesSelect[],
}

export const initialUser: UserProps = {
    id: 0,
    uuid: '',
    nombres: '',
    apellidos: '',
    email_corporativo: '',
    email: '',
    usuario: '',
    telefono: '',
    password: '',
    id_estado: 0,
    id_empl: 0,
    id_rol: 0,
    id_userParent:0,
    is_super_user: false,
    fecha_creacion: '',
}
export const initialStateUser: UserState = {
  users: [],
  user: initialUser,
  idsSeccionAsignadas: [],
  modulosDisponibles: [],
  permisosCreador: [],
  creadorEsSuperUsuario: false,
  opcionesEmpleados: [],
};

export const usuariosSlice = createSlice({
  name: "USER",
  initialState: initialStateUser,
  reducers: {
    onSetUser: (state, action: PayloadAction<UserProps>) => {
      state.user = action.payload;
    },
    onSetSeccionesAsignadas: (state, action: PayloadAction<number[]>) => {
      state.idsSeccionAsignadas = action.payload;
    },
    onSetModulosDisponibles: (state, action: PayloadAction<ModuloDisponibleProps[]>) => {
      state.modulosDisponibles = action.payload;
    },
    onSetPermisosCreador: (state, action: PayloadAction<{ permisos: PermisoEntidadProps[], esSuperUsuario: boolean }>) => {
      state.permisosCreador = action.payload.permisos;
      state.creadorEsSuperUsuario = action.payload.esSuperUsuario;
    },
    onSetOpcionesEmpleados: (state, action: PayloadAction<OpcionesSelect[]>) => {
      state.opcionesEmpleados = action.payload;
    },
    /** Limpia el registro en curso (al guardar o cerrar el modal) */
    onResetRegistro: (state) => {
      state.user = initialUser;
      state.idsSeccionAsignadas = [];
    },
    onSetDataUsers:(state, action: PayloadAction<UserProps[]>)=>{
      state.users = action.payload;
    }
  },
});

export const {
  onSetUser,
  onSetSeccionesAsignadas,
  onSetModulosDisponibles,
  onSetPermisosCreador,
  onSetOpcionesEmpleados,
  onResetRegistro,
  onSetDataUsers,
} = usuariosSlice.actions;
