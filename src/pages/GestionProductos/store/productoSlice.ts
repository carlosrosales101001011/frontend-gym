import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { OpcionesSelect } from '@/types/props';

export type ProductoProps = {
  id: number,
  nombre: string,
  codigo_barra: string,
  codigo_sku: string,
  descripcion?: string,
  stock_actual?: number,
  stock_max?: number,
  stock_min?: number,
  id_sucursal?:number,
  id_almacen?:number,
  id_categoria: number,
  id_marca: number,
  id_unidadMedida: number,
  id_estado: number,
  label_categoria?: string,
  label_marca?: string,
  label_unidadMedida?: string,
  label_estado?: string;
  label_sucursal?:  string,
  label_almacen?:  string,
  precio_venta_actual?:number;
};

export type SucursalProps = {
  id: number,
  nombre: string,
}
export type AlmacenProps = {
  id: number,
  nombre: string,
  id_sucursal: number
}
export type ProductoState={
    productos:ProductoProps[],
    producto: ProductoProps,
    sucursales: OpcionesSelect[],
    almacenes: {id_sucursal:number, label: string, value: number}[],
}

const initialProducto={
  id: 0,
  codigo_barra: '',
  codigo_sku: '',
  nombre: '',
  descripcion: '',
  stock_actual: 0,
  stock_max: 0,
  stock_min: 0,
  id_categoria: 0,
  id_marca: 0,
  id_unidadMedida: 0,
  id_estado: 0,
  id_sucursal: 0,
  id_almacen: 0,
  precio_venta_actual: 0
}
export const initialStateProducto: ProductoState = {
  producto: initialProducto,
  productos: [],
  sucursales: [],
  almacenes: []
};

export const productoSlice = createSlice({
  name: "PRODUCTO",
  initialState: initialStateProducto,
  reducers: {
    // CREATE
    addProducto: (state, action: PayloadAction<ProductoProps>) => {
      state.producto = action.payload;
    },
    onSetDataProductos: (state, action: PayloadAction<ProductoProps[]>)=>{
      state.productos = action.payload;
    },
    onSetDataOpcionesSucursales: (state, action: PayloadAction<OpcionesSelect[]>)=>{
      state.sucursales = action.payload;
    },
    onSetDataOpcionesAlmacenes: (state, action: PayloadAction<{id_sucursal:number, label: string, value: number}[]>)=>{
      state.almacenes = action.payload;
    },
  },
});


export const { addProducto, onSetDataProductos, onSetDataOpcionesSucursales, onSetDataOpcionesAlmacenes } = productoSlice.actions;
