import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
export type SeccionProps = {
  id: number,
  subSeccion: string,
  label: string,
  url: string,
  icon: string,
  id_children_seccion: number,
  /** La sección está en mantenimiento */
  is_seccion_mantenimiento: boolean,
};
export type SeccionesState={
    secciones:SeccionProps[],
    seccion: SeccionProps
}

const initialSeccion={
  id: 0,
  subSeccion: '',
  label: '',
  url: '',
  icon: '',
  id_children_seccion: 0,
  is_seccion_mantenimiento: false,
}
export const initialStateSeccion: SeccionesState = {
  seccion: initialSeccion,
  secciones: [],
};

export const SeccionSlice = createSlice({
  name: "SECCION",
  initialState: initialStateSeccion,
  reducers: {
    // CREATE
    addSeccion: (state, action: PayloadAction<SeccionProps>) => {
      state.seccion = action.payload;
    },
    onSetDataSecciones: (state, action: PayloadAction<SeccionProps[]>)=>{
      state.secciones = action.payload;
    },
  },
});


export const { addSeccion, onSetDataSecciones } = SeccionSlice.actions;
