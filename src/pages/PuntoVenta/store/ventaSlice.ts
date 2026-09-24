import type { OpcionesSelect } from "@/types/props";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ItemResultado } from "@/components/ModalSearching/ModalSearching";

export type PersonaProps = {
  id: number;
  uid: string;
  id_tipo: number;
  id_tipo_documento: number;
  numero_documento: string;
  nombres: string;
  apodo: string;
  apellido_paterno: string;
  apellido_materno: string;
  telefono: string;
  email_personal: string;
  email_corporativo: string;
  uid_avatar?: string;
  url_avatar?: string;
}
export type DetalleMembresiaVentaProps = {
  id_programa: number;
  id_plan: number;
  id_horario: number;
  fecha_inicio: string;
  label_programa: string;
  label_horario: string;
  label_nmeses: string;
  label_precio: string;
  fecha_fin: string;
  montoTotal: number;
}

export type DetalleProductoVentaProps = {
  id_producto: number;
  cantidad: number;
  label_producto: string;
  precio_unitario_producto: string;
  stock_actual?: number;
  url_avatar?: string;
  montoTotal: number;
  precio_unitario?:number;
}

export type DetallePagoVentaProps = {
  id_forma_pago: number;
  montoPagos: number;
}

export type VentaProps ={
  id_cli: number;
  id_empl: number;
  id_tipo_comprobante: number;
  n_comprobante: string;
  id_origen: number;
  id_sucursal: number;
  observacion: string;
  montoTotal: number;
  detalleventa_membresias: DetalleMembresiaVentaProps;
  detalleventa_productos: DetalleProductoVentaProps[];
  detalleventa_pagos: DetallePagoVentaProps[];
}

export type ProgramaProps = {
  id: number;
  uid_avatar?: string;
  url_avatar?: string;
  nombre: string;
  sigla: string;
  descripcion: string;
  minutos: number;
  estado: boolean;
}

export type PlanProps = {
  id: number;
  nMeses: number;
  precioTotal: number;
  id_tipo_tarifa: number;
  label_tipo_tarifa: string;
  estado: boolean;
}

export type HorariosProps = {
  id: number;
  horarioInicio: string;
  horarioFin: string;
  label_empl: string;
  is_lunes: boolean;
  is_martes: boolean;
  is_miercoles: boolean;
  is_jueves: boolean;
  is_viernes: boolean;
  is_sabado: boolean;
  is_domingo: boolean;
}

export type DataVentaProps = {
  id:number;
  label_nombres_apellidos_empl: string,
  label_nombres_apellidos_cli: string,
  montoTotal_membresia: number;
  montoTotal_productos: number;
  montoPagos:number;
  label_origen: string,
  label_tipo_comprobante: string,
  n_comprobante: string,
  observacion: string
};
export type ProductoProps = {
  id: number;
  nombre: string;
  uid_avatar?: string;
  url_avatar?: string;
  stock_actual?: number;
  precio_venta_actual?: number;
  label_categoria?: string;
  label_marca?: string;
  label_unidadMedida?: string;
}

export type SucursalProps = {
  id: number,
  nombre: string,
}
export type PersonaState = {
  personas: PersonaProps[],
  persona: PersonaProps,
  venta: VentaProps,
  sucursales: OpcionesSelect[],
  clienteSeleccionado: ItemResultado | null,
  asesorSeleccionado: ItemResultado | null,
  programas: ProgramaProps[],
  planes: PlanProps[],
  idProgramaSeleccionado: number | null,
  productos: ProductoProps[],
  horarios: OpcionesSelect[],
  dataVentas: DataVentaProps[]
}

export const initialPersona: PersonaProps = {
  id: 0,
  uid: '',
  id_tipo: 0,
  id_tipo_documento: 0,
  numero_documento: '',
  nombres: '',
  apodo: '',
  apellido_paterno: '',
  apellido_materno: '',
  telefono: '',
  email_personal: '',
  email_corporativo: '',
  uid_avatar: '',
  url_avatar: '',
}
const initialDetalleMembresia: DetalleMembresiaVentaProps = {
  id_programa: 0,
  id_plan: 0,
  id_horario: 0,
  fecha_inicio: '',
  // labels
  label_programa: '',
  label_horario: '',
  label_nmeses: '',
  label_precio: '',
  fecha_fin: '',
  montoTotal: 0
}

export const initialVenta: VentaProps = {
  id_cli: 0,
  id_empl: 0,
  id_tipo_comprobante: 0,
  n_comprobante: '',
  id_origen: 0,
  id_sucursal: 0,
  observacion: '',
  montoTotal: 0,
  detalleventa_membresias: initialDetalleMembresia,
  detalleventa_productos: [],
  detalleventa_pagos: [],
}
export const initialStateVenta: PersonaState = {
  personas: [],
  persona: initialPersona,
  venta: initialVenta,
  sucursales: [],
  clienteSeleccionado: null,
  asesorSeleccionado: null,
  programas: [],
  horarios: [],
  planes: [],
  idProgramaSeleccionado: null,
  productos: [],
  dataVentas: []
};

export const ventaSlice = createSlice({
  name: "VENTA",
  initialState: initialStateVenta,
  reducers: {
    addPersona: (state, action: PayloadAction<PersonaProps>) => {
      state.persona = action.payload;
    },
    onSetDataPersona: (state, action: PayloadAction<PersonaProps[]>) => {
      state.personas = action.payload;
    },
    onSetDataOpcionesSucursales: (state, action: PayloadAction<OpcionesSelect[]>)=>{
      state.sucursales = action.payload;
    },
    onSetClienteSeleccionado: (state, action: PayloadAction<ItemResultado | null>) => {
      state.clienteSeleccionado = action.payload;
      state.venta.id_cli = action.payload?.id ?? 0;
    },
    onSetAsesorSeleccionado: (state, action: PayloadAction<ItemResultado | null>) => {
      state.asesorSeleccionado = action.payload;
      state.venta.id_empl = action.payload?.id ?? 0;
    },
    onActualizarVentaCampo: (state, action: PayloadAction<{ name: 'id_origen' | 'id_sucursal' | 'id_tipo_comprobante' | 'n_comprobante' | 'observacion', value: string | number }>) => {
      const { name, value } = action.payload;
      (state.venta[name] as string | number) = value;
    },
    onSetDataProgramas: (state, action: PayloadAction<ProgramaProps[]>) => {
      state.programas = action.payload;
    },
    onSetDataPlanes: (state, action: PayloadAction<PlanProps[]>) => {
      state.planes = action.payload;
    },
    onSetDataHorario: (state, action: PayloadAction<OpcionesSelect[]>) => {
      state.horarios = action.payload;
    },
    onSetProgramaSeleccionado: (state, action: PayloadAction<number | null>) => {
      state.idProgramaSeleccionado = action.payload;
      state.planes = [];
      state.horarios = [];
      state.venta.detalleventa_membresias = initialDetalleMembresia;
    },
    onSetDataProductos: (state, action: PayloadAction<ProductoProps[]>) => {
      state.productos = action.payload;
    },
    onSetMembresiaVenta: (state, action: PayloadAction<DetalleMembresiaVentaProps>) => {
      state.venta.detalleventa_membresias = action.payload;
    },
    onQuitarMembresiaVenta: (state) => {
      state.venta.detalleventa_membresias = initialDetalleMembresia;
      state.idProgramaSeleccionado = null;
      state.planes = [];
    },
    onAgregarProductoVenta: (state, action: PayloadAction<ProductoProps>) => {
      const producto = action.payload;
      const existente = state.venta.detalleventa_productos.find((item) => item.id_producto === producto.id);
      if (existente) {
        const maxStock = producto.stock_actual ?? existente.cantidad + 1;
        existente.cantidad = Math.min(existente.cantidad + 1, maxStock);
        existente.montoTotal = existente.cantidad * Number(existente.precio_unitario_producto);
      } else {
        const precioUnitario = producto.precio_venta_actual ?? 0;
        state.venta.detalleventa_productos.push({
          id_producto: producto.id,
          cantidad: 1,
          label_producto: producto.nombre,
          precio_unitario_producto: precioUnitario.toString(),
          stock_actual: producto.stock_actual,
          url_avatar: producto.url_avatar,
          montoTotal: precioUnitario,
        });
      }
    },
    onSumarProductoVenta: (state, action: PayloadAction<number>) => {
      const item = state.venta.detalleventa_productos.find((producto) => producto.id_producto === action.payload);
      if (item) {
        const maxStock = item.stock_actual ?? item.cantidad + 1;
        item.cantidad = Math.min(item.cantidad + 1, maxStock);
        item.montoTotal = item.cantidad * Number(item.precio_unitario_producto);
      }
    },
    onRestarProductoVenta: (state, action: PayloadAction<number>) => {
      const item = state.venta.detalleventa_productos.find((producto) => producto.id_producto === action.payload);
      if (item) {
        item.cantidad = Math.max(1, item.cantidad - 1);
        item.montoTotal = item.cantidad * Number(item.precio_unitario_producto);
      }
    },
    onQuitarProductoVenta: (state, action: PayloadAction<number>) => {
      state.venta.detalleventa_productos = state.venta.detalleventa_productos.filter((producto) => producto.id_producto !== action.payload);
    },
    onAgregarPagoVenta: (state, action: PayloadAction<DetallePagoVentaProps>) => {
      state.venta.detalleventa_pagos = state.venta.detalleventa_pagos.filter((pago) => pago.id_forma_pago !== action.payload.id_forma_pago);
      state.venta.detalleventa_pagos.push(action.payload);
    },
    onActualizarPagoVenta: (state, action: PayloadAction<{ index: number, name: keyof DetallePagoVentaProps, value: number }>) => {
      const { index, name, value } = action.payload;
      state.venta.detalleventa_pagos[index][name] = value;
    },
    onEliminarPagoVenta: (state, action: PayloadAction<number>) => {
      state.venta.detalleventa_pagos.splice(action.payload, 1);
    },
    onResetVenta: (state) => {
      state.venta = initialVenta;
      state.clienteSeleccionado = null;
      state.asesorSeleccionado = null;
      state.idProgramaSeleccionado = null;
      state.planes = [];
      state.horarios = [];
    },
    onSetDataVentas: (state, action: PayloadAction<DataVentaProps[]>)=>{
      state.dataVentas = action.payload;
    },
    onSetDataVentasMembresias: (state, action: PayloadAction<DataVentaProps[]>)=>{
      state.dataVentas = action.payload;
    },


  },
});

export const {
  onSetDataVentasMembresias,
  onSetDataVentas,
  addPersona,
  onSetDataHorario,
  onSetDataPersona,
  onSetDataOpcionesSucursales,
  onSetClienteSeleccionado,
  onSetAsesorSeleccionado,
  onActualizarVentaCampo,
  onSetDataProgramas,
  onSetDataPlanes,
  onSetProgramaSeleccionado,
  onSetDataProductos,
  onSetMembresiaVenta,
  onQuitarMembresiaVenta,
  onAgregarProductoVenta,
  onSumarProductoVenta,
  onRestarProductoVenta,
  onQuitarProductoVenta,
  onAgregarPagoVenta,
  onActualizarPagoVenta,
  onEliminarPagoVenta,
  onResetVenta,
} = ventaSlice.actions;
