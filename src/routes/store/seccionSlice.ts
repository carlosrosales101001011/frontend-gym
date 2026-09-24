import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
export type seccionProps = {
  id_modulouser: number;
  id_seccion: number;
  seccion: {
    id: number;
    subSeccion: string;
    label: string;
    url: string;
  }
};
export type SeccionState={
    secciones: seccionProps[],
}

const initialSeccion={
    id_modulouser: 0,
    id_seccion: 0,
    seccion: {
        id: 0,
        subSeccion: '',
        label: '',
        url: ''
    }
}
export const initialStateSeccion: SeccionState = {
  secciones: [initialSeccion]
};

export const seccionSlice = createSlice({
  name: "SECCION",
  initialState: initialStateSeccion,
  reducers: {
    // CREATE
    onSetSecciones: (state, action:PayloadAction<seccionProps[]>)=>{
      state.secciones =action.payload
    }
  },
});


export const { onSetSecciones } = seccionSlice.actions;
