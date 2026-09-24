import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type ContactoEmergenciaProps = {
  id: number;
  id_cargo:number;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  telefono: string;
  email: string;
  observacion: string;
  tipoPariente: {
    valor: string;
  }
}
export type ContactoEmergenciaState={
    contactosEmergencia:ContactoEmergenciaProps[],
    contactoEmergencia: ContactoEmergenciaProps
}
export const initialContactoEmergencia = {
  id: 0,
  id_cargo: 0,
  nombres: '',
  apellido_paterno: '',
  apellido_materno: '',
  telefono: '',
  email: '',
  observacion:'',
  tipoPariente: {
    valor: ''
  }
}
export const initialStateContactoEmergencia: ContactoEmergenciaState = {
    contactosEmergencia: [{...initialContactoEmergencia}],
    contactoEmergencia: initialContactoEmergencia,
};

export const ContactoEmergenciaSlice = createSlice({
  name: "CONTACTO_EMERGENCIA",
  initialState: initialStateContactoEmergencia,
  reducers: {
    // CREATE
    addContactoEmergencia: (state, action: PayloadAction<ContactoEmergenciaProps>) => {
      state.contactoEmergencia = action.payload;
    },
    onSetDataContactosEmergencia: (state, action: PayloadAction<ContactoEmergenciaProps[]>)=>{
      state.contactosEmergencia = action.payload;
    },
  },
});

export const { addContactoEmergencia, onSetDataContactosEmergencia } = ContactoEmergenciaSlice.actions;
