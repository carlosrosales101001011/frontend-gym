import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

/** Usuario logueado (GET /user/me) */
export type UsuarioSesionProps = {
    id: number,
    nombres: string,
    apellidos: string,
    label_rol: string,
    /** Puede otorgar cualquier permiso y cambiar contraseñas de otros usuarios */
    is_super_user?: boolean,
    /** Foto de su colaborador (última imagen y encuadre); null si no tiene */
    avatar?: AvatarPersonaProps | null,
}

/** Foto de una persona tal como la devuelve el backend (url de blob_storage y encuadre) */
export type AvatarPersonaProps = {
    url_avatar_ultimo: string,
    avatar_x_ultimo: number | null,
    avatar_y_ultimo: number | null,
    avatar_zoom_ultimo: number | null,
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
