import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
export type SeguimientoMembresiaProps = {
  // id, id_cli, id_venta y label_venta ya los devuelve el backend (los usa GestionExtensionRegalos)
  id?: number;
  id_cli?: number;
  id_venta?: number;
  label_venta?: string;
  label_nombres_apellidos_cli: string;
  telefono_cli: string,
  email_cli: string,
  label_distrito_cli: string,
  label_extension_actual: string;
  sesiones_pendientes: string;
  fecha_vencimiento: string;
};
export type SeccionesState={
    SeguimientoMembresias:SeguimientoMembresiaProps[],
    SeguimientoMembresia: SeguimientoMembresiaProps
}

const initialSeguimientoMembresia={
    label_nombres_apellidos_cli: '',
    telefono_cli: '',
    email_cli: '',
    label_distrito_cli: '',
    label_extension_actual: '',
    sesiones_pendientes: '',
    fecha_vencimiento: ''
}
export const initialStateSeguimientoMembresia: SeccionesState = {
  SeguimientoMembresia: initialSeguimientoMembresia,
  SeguimientoMembresias: [],
};

export const SeguimientoMembresiaSlice = createSlice({
  name: "SEGUIMIENTO_MEMBRESIA",
  initialState: initialStateSeguimientoMembresia,
  reducers: {
    onSetDataSeguimientoMembresias: (state, action: PayloadAction<SeguimientoMembresiaProps[]>)=>{
      state.SeguimientoMembresias = action.payload;
    },
  },
});


export const { onSetDataSeguimientoMembresias } = SeguimientoMembresiaSlice.actions;
