import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

/** Sección (tabla nav_seccion) */
export type SeccionProps = {
  id: number;
  label: string;
  icon: string;
  url?: string;
  is_seccion_mantenimiento?: boolean;
};

/** Módulo del catálogo (tabla modulo) */
export type ModuloProps = {
  id: number;
  label: string;
  icono: string;
  descripcion?: string;
  /** En "Mis módulos": las secciones que tiene en él quien administra */
  secciones?: SeccionProps[];
};

/** Módulo asignado a un usuario (tabla modulo_x_user) */
export type ModuloUsuarioProps = {
  id: number;
  uid?: string;
  id_modulo: number;
  is_fijado: boolean;
  is_favorito: boolean;
  modulo: ModuloProps;
  /** Secciones que tiene el usuario en este módulo */
  secciones: SeccionProps[];
};

/** Usuario que puede administrar quien está logueado, con sus módulos activos */
export type UsuarioModulosProps = {
  id: number;
  uuid: string;
  nombres: string;
  apellidos: string;
  usuario?: string | null;
  label_rol?: string | null;
  label_nombres_apellidos_userParent?: string | null;
  modulos: ModuloUsuarioProps[];
};

export type ModulosUsuarioState = {
  usuarios: UsuarioModulosProps[];
};

export const initialStateModulosUsuario: ModulosUsuarioState = {
  usuarios: [],
};

export const modulosUsuarioSlice = createSlice({
  name: 'MODULOS_USUARIO',
  initialState: initialStateModulosUsuario,
  reducers: {
    onSetUsuariosModulos: (state, action: PayloadAction<UsuarioModulosProps[]>) => {
      state.usuarios = action.payload;
    },
  },
});

export const { onSetUsuariosModulos } = modulosUsuarioSlice.actions;
