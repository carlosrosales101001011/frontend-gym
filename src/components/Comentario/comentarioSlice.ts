import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type ComentarioProps = {
  id: number;
    comentario:string;
    id_user: number;
    uid_location: string;
    nombre_usuario: string;
    fecha_updated: string;
    fecha_created: string;
  usuario: {
    nombres: string;
    apellidos: string;
  }
}
export type ComentarioState={
    comentarios:ComentarioProps[],
    comentario: ComentarioProps
}
export const initialComentario = {
  id: 0,
    comentario: '',
    id_user: 0,
    uid_location: '',
    nombre_usuario: '',
    fecha_updated: '',
    fecha_created: '',
    usuario: {
      nombres: '',
      apellidos: ''
    }
}
export const initialStateComentario: ComentarioState = {
  comentario: initialComentario,
  comentarios: [{...initialComentario}],
};

export const comentarioSlice = createSlice({
  name: "COMENTARIO",
  initialState: initialStateComentario,
  reducers: {
    // CREATE
    addComentario: (state, action: PayloadAction<ComentarioProps>) => {
      state.comentario = action.payload;
    },
    onSetDataComentarios: (state, action: PayloadAction<ComentarioProps[]>)=>{
      state.comentarios = action.payload;
    },
  },
});

export const { addComentario, onSetDataComentarios } = comentarioSlice.actions;
