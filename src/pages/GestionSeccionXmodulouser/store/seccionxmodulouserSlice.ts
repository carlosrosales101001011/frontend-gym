import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  ModuloUsuarioProps, SeccionProps, UsuarioModulosProps,
} from '@/pages/GestionModuloxUsuario/store/modulosUsuarioSlice';

/** GET /seccion-x-modulouser/modulo-usuario/:id: lo que necesita el modal de secciones */
export type DetalleSeccionesProps = {
  /** El módulo del usuario con sus secciones y su dueño */
  moduloUsuario: ModuloUsuarioProps & { id_user: number, usuario?: Omit<UsuarioModulosProps, 'modulos'> };
  /** Todas las secciones (nav_seccion) */
  catalogo: SeccionProps[];
  /** Las que puede dar quien administra (super usuario: todas; los demás: las suyas en el módulo) */
  idsPermitidas: number[];
};

export type SeccionxmodulouserState = {
  /** Usuarios que administra quien está logueado, con sus módulos y secciones */
  usuarios: UsuarioModulosProps[];
};

export const initialStateSeccionxmodulouser: SeccionxmodulouserState = {
  usuarios: [],
};

export const seccionxmodulouserSlice = createSlice({
  name: "SECCIONXMODULOUSER",
  initialState: initialStateSeccionxmodulouser,
  reducers: {
    onSetUsuariosSecciones: (state, action: PayloadAction<UsuarioModulosProps[]>) => {
      state.usuarios = action.payload;
    },
  },
});

export const { onSetUsuariosSecciones } = seccionxmodulouserSlice.actions;
