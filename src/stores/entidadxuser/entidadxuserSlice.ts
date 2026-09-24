import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type EntidadxUserProps = {
  id: number,
  id_entidad: number,
  id_user: number,
  id_estado_CREATE: number,
  id_estado_READ: number,
  id_estado_UPDATE: number,
  id_estado_DELETE: number,
};
export type EntidadxUserState={
    entidadesxUser: EntidadxUserProps[],
    entidadxUser: EntidadxUserProps
}

const initialEntidadxUser={
  id: 0,
  id_entidad: 0,
  id_user: 0,
  id_estado_CREATE: 0,
  id_estado_READ: 0,
  id_estado_UPDATE: 0,
  id_estado_DELETE: 0,
}
export const initialStateEntidadxUser: EntidadxUserState = {
  entidadxUser: initialEntidadxUser,
  entidadesxUser: [],
};

export const entidadxuserSlice = createSlice({
  name: "ENTIDADXUSER",
  initialState: initialStateEntidadxUser,
  reducers: {
    // CREATE
    addEntidadxUser: (state, action: PayloadAction<EntidadxUserProps>) => {
      state.entidadxUser = action.payload;
    },
    onSetDataEntidadesxUser: (state, action: PayloadAction<EntidadxUserProps[]>)=>{
      state.entidadesxUser = action.payload;
    },
  },
});


export const { addEntidadxUser, onSetDataEntidadesxUser } = entidadxuserSlice.actions;

