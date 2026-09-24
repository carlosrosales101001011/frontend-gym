import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { IconName } from '@/components/Icons/IconCR';
export type moduloProp = {
      id: number;
    id_user: number;
    id_modulo: number;
    id_modulouser:number;
    is_favorito: boolean;
    is_fijado: boolean;
    id_seccion: number;
    seccion:{
        id: number;
        subSeccion: string;
        label: string;
        url:string
    },
    modulo:{
        id_tipo: number,
        icono?: IconName,
        label: string,
        descripcion: string
    }
}
export type SeccionProp = {
    id_modulouser:number;
    id_seccion: number;
    seccion:{
        id: number;
        subSeccion: string;
        label: string;
        url:string
    }
}
export type EntidadProp = {
    id?: number,
    id_entidad: number,
    id_user?: number,
    id_estado_CREATE: number,
    id_estado_READ: number,
    id_estado_UPDATE: number,
    id_estado_DELETE: number,
}
export type permisoState={
    modulos: moduloProp[],
    secciones: SeccionProp[],
    entidades: EntidadProp[]
}
export const permisoInitialState: permisoState = {
    modulos: [],
    secciones: [],
    entidades: [],
};

export const permisoSlice = createSlice({
    name: "PERMISOS",
    initialState: permisoInitialState,
    reducers: {
        onSetModulos: (state, action:PayloadAction<moduloProp[]>)=>{
        state.modulos =action.payload
        },
        onSetSecciones: (state, action:PayloadAction<SeccionProp[]>)=>{
        state.secciones = action.payload
        },
        onSetEntidades: (state, action:PayloadAction<EntidadProp[]>)=>{
        state.entidades = action.payload
        },
    },
});

export const { onSetModulos, onSetSecciones, onSetEntidades } = permisoSlice.actions;
