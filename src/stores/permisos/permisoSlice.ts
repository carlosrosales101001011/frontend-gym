import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { IconName } from '@/components/Icons/IconCR';
import { leerModuloActualGuardado } from '@/helpers/moduloActual';
export type moduloProp = {
      id: number;
    /** uid de modulo_x_user: con él se piden las secciones del módulo */
    uid?: string;
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
        descripcion: string,
        /** Va en la URL del front: /:url_modulo/:seccion (ej. "venta") */
        url?: string
    }
}

/** Módulo en el que está el usuario (ver hook/useModuloActual) */
export type ModuloActualProps = {
    /** uid de modulo_x_user: con él se piden las secciones */
    uid_modulo: string;
    /** id de modulo_x_user */
    id: number;
    url: string;
    label: string;
}
/** Tipo de módulo que se muestra en el Home y en "Mis módulos" (los personales no) */
export const ID_TIPO_MODULO_EMPRESARIAL = 2012;

export type SeccionProp = {
    id_modulouser:number;
    id_seccion: number;
    seccion:{
        id: number;
        subSeccion: string;
        label: string;
        url:string;
        /** Sección en mantenimiento: se muestra un aviso en lugar de la página */
        is_seccion_mantenimiento?: boolean
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
    entidades: EntidadProp[],
    moduloActual: ModuloActualProps | null
}
export const permisoInitialState: permisoState = {
    modulos: [],
    secciones: [],
    entidades: [],
    // Se recupera de localStorage para tenerlo al recargar la página
    moduloActual: leerModuloActualGuardado<ModuloActualProps>(),
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
        onSetModuloActual: (state, action:PayloadAction<ModuloActualProps | null>)=>{
        state.moduloActual = action.payload
        },
    },
});

export const { onSetModulos, onSetSecciones, onSetEntidades, onSetModuloActual } = permisoSlice.actions;
