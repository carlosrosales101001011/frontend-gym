import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
export type SeguimientoMembresiaProps = {
  // id, id_cli, id_venta y label_venta ya los devuelve el backend (los usa GestionExtensionRegalos)
  id?: number;
  id_cli?: number;
  /** uid de la persona del cliente: link a su perfil (lo agrega el backend) */
  uid_cli?: string | null;
  id_venta?: number;
  label_venta?: string;
  label_nombres_apellidos_cli: string;
  /** Asesor / vendedor de la venta */
  id_empl?: number;
  label_nombres_apellidos_empl?: string;
  telefono_cli: string,
  email_cli: string,
  label_distrito_cli: string,
  label_extension_actual: string;
  /** Su extensión en curso hoy es un congelamiento (lo calcula el backend) */
  es_congelado?: boolean;
  /** Su extensión en curso hoy es un regalo de días (lo calcula el backend) */
  es_regalo?: boolean;
  /** Extensión en curso hoy: su inicio (yyyy-mm-dd) y sus días (null si no hay) */
  fecha_inicio_extension_actual?: string | null;
  dias_extension_actual?: number | null;
  sesiones_pendientes: string;
  fecha_vencimiento: string;
  /** Programa y plan de la membresía vendida (0 / '' si la venta no los tiene) */
  id_programa?: number;
  label_programa?: string;
  id_plan?: number;
  /** Nombre del plan, ej. "3 Meses" */
  n_plan?: string;
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
