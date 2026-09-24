import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type PromocionProps = {
  id: number,
  codigo: string,
  nombre: string,
  descripcion?: string,
  id_tipo_promocion: number,
  label_tipo_promocion?: string,
  fecha_inicio: string,
  fecha_fin: string,
  hora_inicio: string,
  hora_fin: string,
  is_activo: boolean,
  is_acumulable: boolean,
  prioridad: number,
  cantidad_max_uso?: number,
  cantidad_usos: number,
  monto_minimo?: number,
  monto_maximo?: number,
  observacion?: string,
};
export type PromocionState = {
  promociones: PromocionProps[],
  promocion: PromocionProps
}

const initialPromocion: PromocionProps = {
  id: 0,
  codigo: '',
  nombre: '',
  descripcion: '',
  id_tipo_promocion: 0,
  fecha_inicio: '',
  fecha_fin: '',
  hora_inicio: '',
  hora_fin: '',
  is_activo: true,
  is_acumulable: false,
  prioridad: 0,
  cantidad_max_uso: undefined,
  cantidad_usos: 0,
  monto_minimo: undefined,
  monto_maximo: undefined,
  observacion: '',
}
export const initialStatePromocion: PromocionState = {
  promocion: initialPromocion,
  promociones: [],
};

export const promocionSlice = createSlice({
  name: "PROMOCION",
  initialState: initialStatePromocion,
  reducers: {
    // CREATE
    addPromocion: (state, action: PayloadAction<PromocionProps>) => {
      state.promocion = action.payload;
    },
    onSetDataPromociones: (state, action: PayloadAction<PromocionProps[]>)=>{
      state.promociones = action.payload;
    },
  },
});


export const { addPromocion, onSetDataPromociones } = promocionSlice.actions;
