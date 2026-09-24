import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { OpcionesSelect } from '@/types/props';

export type MovProductoProps = {
  id: number,
  id_producto:number,
  label_producto?: string,
  label_marca_producto?: string,
  id_tipo_movimiento:number,
  label_tipo_movimiento?:string|null,
  id_sucursal_origen:number,
  label_sucursal_origen?: string |null,
  id_almacen_origen: number,
  label_almacen_origen?: string | null,
  id_sucursal_destino:number,
  label_sucursal_destino?: string | null,
  id_almacen_destino: number,
  label_almacen_destino?: string | null,
  id_motivo: number,
  label_motivo?: string | null,
  cantidad_movimiento:number,
};
export type MovProductoState={
    movProductos:MovProductoProps[],
    movProducto: MovProductoProps,
    opcionesSucursales: OpcionesSelect[],
    opcionesAlmacenes: OpcionesSelect[],
    opcionesProductos: OpcionesSelect[]
}

const initialMovProducto={
  id: 0,
  id_producto:0,
  id_tipo_movimiento:0,
  id_sucursal_origen:0,
  id_almacen_origen: 0,
  id_sucursal_destino: 0,
  id_almacen_destino: 0,
  id_motivo: 0,
  cantidad_movimiento:0,
}
export const initialStateMovProducto: MovProductoState = {
  movProducto: initialMovProducto,
  movProductos: [],
  opcionesSucursales: [],
  opcionesAlmacenes: [],
  opcionesProductos: []
};

export const movProductoSlice = createSlice({
  name: "MOVPRODUCTO",
  initialState: initialStateMovProducto,
  reducers: {
    // CREATE
    addMovProducto: (state, action: PayloadAction<MovProductoProps>) => {
      state.movProducto = action.payload;
    },
    onSetDataMovProductos: (state, action: PayloadAction<MovProductoProps[]>)=>{
      state.movProductos = action.payload;
    },
    onSetDataOpcionesSucursales: (state, action: PayloadAction<OpcionesSelect[]>)=>{
      state.opcionesSucursales = action.payload;
    },
    onSetDataOpcionesAlmacenes: (state, action: PayloadAction<OpcionesSelect[]>)=>{
      state.opcionesAlmacenes = action.payload;
    },
    onSetDataOpcionesProductos: (state, action: PayloadAction<OpcionesSelect[]>)=>{
      state.opcionesProductos = action.payload;
    },
  },
});


export const { addMovProducto, onSetDataMovProductos, onSetDataOpcionesSucursales, onSetDataOpcionesAlmacenes, onSetDataOpcionesProductos } = movProductoSlice.actions;
