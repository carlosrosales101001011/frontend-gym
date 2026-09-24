import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type SeccionxmodulouserProps = {
  id?: number,
  id_modulouser:number,
  id_seccion:number,
};
export type SeccionxmodulouserState={
    seccionxmodulouser: SeccionxmodulouserProps[],
    seccionxmodulouserItem: SeccionxmodulouserProps
}

const initialseccionxmodulouser: SeccionxmodulouserProps = {
  id: 0,
  id_modulouser: 0,
  id_seccion: 0,
}
export const initialStateSeccionxmodulouser: SeccionxmodulouserState = {
  seccionxmodulouserItem: initialseccionxmodulouser,
  seccionxmodulouser: [],
};

export const seccionxmodulouserSlice = createSlice({
  name: "SECCIONXMODULOUSER",
  initialState: initialStateSeccionxmodulouser,
  reducers: {
    // CREATE
    addSeccionxmodulouser: (state, action: PayloadAction<SeccionxmodulouserProps>) => {
      state.seccionxmodulouserItem = action.payload;
    },
    onSetDataSeccionxmodulouser: (state, action: PayloadAction<SeccionxmodulouserProps[]>)=>{
      state.seccionxmodulouser = action.payload;
    },
  },
});


export const { addSeccionxmodulouser, onSetDataSeccionxmodulouser } = seccionxmodulouserSlice.actions;
