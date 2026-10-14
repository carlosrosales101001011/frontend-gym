import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

/** Congelamiento tal como lo devuelve /membresia-extension/congelamientos/search (solo tipo 6089) */
export type ExtCongelamientoProps = {
  id: number,
  id_tipo_extension: number,
  id_cli: number,
  id_venta: number,
  dias_habiles: number,
  observacion?: string|null,
  /** Puede llegar como yyyy-mm-dd o ISO (búsqueda con texto) */
  fecha_inicio: string,
  fecha_fin: string,
  label_nombres_apellidos_cli?: string|null,
  label_venta?: string|null,
  label_nombre_programa?: string|null,
  label_nmes_plan?: string|null,
};
export type ExtCongelamientoState={
    extCongelamientos: ExtCongelamientoProps[],
}

export const initialStateExtCongelamiento: ExtCongelamientoState = {
  extCongelamientos: [],
};

export const extCongelamientoSlice = createSlice({
  name: "EXT_CONGELAMIENTO",
  initialState: initialStateExtCongelamiento,
  reducers: {
    onSetDataExtCongelamientos: (state, action: PayloadAction<ExtCongelamientoProps[]>)=>{
      state.extCongelamientos = action.payload;
    },
  },
});


export const { onSetDataExtCongelamientos } = extCongelamientoSlice.actions;
