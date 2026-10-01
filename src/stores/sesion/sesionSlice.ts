import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

/** Usuario logueado (GET /user/me) */
export type UsuarioSesionProps = {
    id: number,
    nombres: string,
    apellidos: string,
    label_rol: string,
}
export type sesionState = {
    usuario: UsuarioSesionProps | null,
}
export const sesionInitialState: sesionState = {
    usuario: null,
};

export const sesionSlice = createSlice({
    name: "SESION",
    initialState: sesionInitialState,
    reducers: {
        onSetUsuarioSesion: (state, action: PayloadAction<UsuarioSesionProps | null>) => {
            state.usuario = action.payload
        },
    },
});

export const { onSetUsuarioSesion } = sesionSlice.actions;
