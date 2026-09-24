import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type TerminologiaProps = {
  id:number;
  entidad:string;
  grupo: string;
  subgrupo:string;
  valor: string;
};
export type TerminologiaState={
    terminologias:TerminologiaProps[],
    terminologia: TerminologiaProps,
    total: number,
    page: number;
    show: number;
}

const initialTerminologia={
    id: 0,
    entidad: '',
    grupo: '',
    subgrupo:'',
    valor: ''
}
export const initialStateTerminologia: TerminologiaState = {
  terminologias: [initialTerminologia],
  terminologia: initialTerminologia,
  total: 0,
  page: 0,
  show: 0
};

export const terminologiasSlice = createSlice({
  name: "TERMINOLOGIA",
  initialState: initialStateTerminologia,
  reducers: {
    // CREATE
    addTerminologia: (state, action: PayloadAction<TerminologiaProps>) => {
      state.terminologia = action.payload;
    },
    onSetTerminologia: (state, action: PayloadAction<TerminologiaProps[]>)=>{
      state.terminologias = action.payload;
    }
    // obtenerTerminologia: (state,)=>{
    //   state.terminologias;
    // }
  },
});


export const { addTerminologia, onSetTerminologia } = terminologiasSlice.actions;
