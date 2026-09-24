import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

/** Extensión por días hábiles directos: el backend calcula fecha_inicio/fecha_fin desde el vencimiento actual */
export const ID_TIPO_EXTENSION_DIAS_HABILES = 6090
/** Máximo de días que se pueden regalar en una extensión (el backend valida lo mismo) */
export const MAX_DIAS_REGALO = 720

export type ExtRegaloProps = {
  id: number,
  id_tipo_extension: number,
  id_cli: number,
  id_venta: number,
  dias_habiles: number,
  observacion: string,
  fecha_inicio?: string|null,
  fecha_fin?: string|null,
  label_tipo_extension?: string|null,
  label_nombres_apellidos_cli?: string|null,
  label_venta?: string|null,
};
export type ExtRegaloState={
    extRegalos: ExtRegaloProps[],
    extRegalo: ExtRegaloProps,
}

const initialExtRegalo: ExtRegaloProps = {
    id: 0,
    id_tipo_extension: ID_TIPO_EXTENSION_DIAS_HABILES,
    id_cli: 0,
    id_venta: 0,
    dias_habiles: 0,
    observacion: '',
}
export const initialStateExtRegalo: ExtRegaloState = {
  extRegalo: initialExtRegalo,
  extRegalos: [],
};

export const extRegaloSlice = createSlice({
  name: "EXT_REGALO",
  initialState: initialStateExtRegalo,
  reducers: {
    onSetDataExtRegalos: (state, action: PayloadAction<ExtRegaloProps[]>)=>{
      state.extRegalos = action.payload;
    },
  },
});


export const { onSetDataExtRegalos } = extRegaloSlice.actions;
