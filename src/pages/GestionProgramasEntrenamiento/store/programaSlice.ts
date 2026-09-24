import type { OpcionesSelect } from '@/types/props';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type ProgramaBaseBackend = {
  id: number,
  uid_avatar?: string,
  url_avatar?: string,
  nombre: string,
  sigla: string,
  descripcion: string,
  minutos: number,
  estado: boolean,
}

export type programaProps = {
  id: number,
  uid_avatar?: string,
  url_avatar?: string,
  nombre: string,
  sigla: string,
  descripcion: string,
  minutos: string,
  estado: boolean,
  categorias: CategoriaProgramaProps[],
  planes: PlanesProps[],
  sucursales: SucursalProgramaProps[],
  horarios: HorarioProps[]
};
// Filas "pivote" (programa <-> categoria / sucursal): id = id de la fila en el backend
// (ausente si aun no se guarda), *_id = el id de la categoria/sucursal seleccionada.
export type CategoriaProgramaProps = {
  id?: number,
  id_categoria: number,
}
export type SucursalProgramaProps = {
  id?: number,
  id_sucursal: number,
}
export type PlanesProps={
    id?: number,
    nMeses: number,
    precioTotal: number,
    id_tipo_tarifa: number,
    label_tipo_tarifa: string,
    citas_nutricion_regalo: number,
    dias_congelamiento_regalo: number,
    estado: boolean
}
export type EmpleadoProps = {
  id_empl: number,
  label_empl: string,
}
export type HorarioProps={
    id?: number,
    horarioInicio: string,
    horarioFin: string,
    id_empl: number,
    label_empl: string,
    is_lunes: boolean,
    is_martes: boolean,
    is_miercoles: boolean,
    is_jueves: boolean,
    is_viernes: boolean,
    is_sabado: boolean,
    is_domingo: boolean,
    estado: boolean
}
// Snapshot de lo que existe en el backend al abrir un programa para editar.
// Se usa para calcular que crear/actualizar/eliminar al guardar (ver helpers/sincronizarColeccion.ts).
export type OriginalesPrograma = {
  categorias: CategoriaProgramaProps[],
  sucursales: SucursalProgramaProps[],
  planes: PlanesProps[],
  horarios: HorarioProps[],
}
export type ProductoState={
    // el listado de tarjetas solo necesita los datos base (sin categorias/sucursales/planes/horarios,
    // que se cargan aparte al editar un programa puntual, ver obtenerProgramaCompleto)
    programas:ProgramaBaseBackend[],
    programa: programaProps,
    originales: OriginalesPrograma,
    opcionesEmpleados: OpcionesSelect[],
    opcionesSucursales: OpcionesSelect[]
}

// Suma los minutos del programa a una hora "HH:mm" para obtener la hora de fin
const addMinutosAHora = (horaInicio: string, minutos: string | number): string => {
    const totalMinutos = Number(minutos);
    const [horas, mins] = horaInicio.split(':').map(Number);
    if (!horaInicio || Number.isNaN(horas) || Number.isNaN(mins) || Number.isNaN(totalMinutos)) {
        return '';
    }
    const totalFin = ((horas * 60 + mins + totalMinutos) % 1440 + 1440) % 1440;
    const horasFin = String(Math.floor(totalFin / 60)).padStart(2, '0');
    const minsFin = String(totalFin % 60).padStart(2, '0');
    return `${horasFin}:${minsFin}`;
}

const initialPlanes: PlanesProps = {
    nMeses: 0,
    precioTotal: 0,
    id_tipo_tarifa: 0,
    label_tipo_tarifa: '',
    citas_nutricion_regalo: 0,
    dias_congelamiento_regalo: 0,
    estado: true
}
const initialHorarios: HorarioProps = {
    horarioInicio: '06:00',
    horarioFin: '',
    id_empl: 0,
    label_empl: '',
    is_lunes: true,
    is_martes: true,
    is_miercoles: true,
    is_jueves: true,
    is_viernes: true,
    is_sabado: false,
    is_domingo: false,
    estado: true
}
const initialProgramas: programaProps = {
  id: 0,
  nombre: '',
  sigla: '',
  descripcion: '',
  minutos: '',
  estado: false,
  categorias: [],
  sucursales: [],
  planes: [initialPlanes],
  horarios: [initialHorarios]
}
const initialOriginales: OriginalesPrograma = {
  categorias: [],
  sucursales: [],
  planes: [],
  horarios: []
}
export const initialStateProducto: ProductoState = {
  programa: initialProgramas,
  programas: [],
  originales: initialOriginales,
  opcionesEmpleados: [],
  opcionesSucursales: []
};

export const programaSlice = createSlice({
  name: "PROGRAMA",
  initialState: initialStateProducto,
  reducers: {
    // CREATE
    addProducto: (state, action: PayloadAction<programaProps>) => {
      state.programa = action.payload;
    },
    onSetDataProductos: (state, action: PayloadAction<ProgramaBaseBackend[]>)=>{
      state.programas = action.payload;
    },
    // Snapshot de las colecciones tal cual estan en el backend (para poder editar un programa existente)
    onSetOriginales: (state, action: PayloadAction<OriginalesPrograma>) => {
      state.originales = action.payload;
    },
    // FORM - Informacion
    onChangeInformacion: (state, action: PayloadAction<Partial<programaProps>>) => {
      state.programa = { ...state.programa, ...action.payload };
      if ('minutos' in action.payload) {
        state.programa.horarios = state.programa.horarios.map((horario) => ({
          ...horario,
          horarioFin: addMinutosAHora(horario.horarioInicio, state.programa.minutos),
        }));
      }
    },
    onToggleCategoria: (state, action: PayloadAction<number>) => {
      const id_categoria = action.payload;
      const yaSeleccionada = state.programa.categorias.some((categoria) => categoria.id_categoria === id_categoria);
      if (yaSeleccionada) {
        state.programa.categorias = state.programa.categorias.filter((categoria) => categoria.id_categoria !== id_categoria);
        return;
      }
      // si ya existia en el backend, se reusa su id para no borrarla y recrearla al guardar
      const original = state.originales.categorias.find((categoria) => categoria.id_categoria === id_categoria);
      state.programa.categorias.push(original ? { ...original } : { id_categoria });
    },
    onToggleSucursal: (state, action: PayloadAction<number>) => {
      const id_sucursal = action.payload;
      const yaSeleccionada = state.programa.sucursales.some((sucursal) => sucursal.id_sucursal === id_sucursal);
      if (yaSeleccionada) {
        state.programa.sucursales = state.programa.sucursales.filter((sucursal) => sucursal.id_sucursal !== id_sucursal);
        return;
      }
      const original = state.originales.sucursales.find((sucursal) => sucursal.id_sucursal === id_sucursal);
      state.programa.sucursales.push(original ? { ...original } : { id_sucursal });
    },
    // FORM - Planes
    onAddPlan: (state) => {
      state.programa.planes.push({ ...initialPlanes });
    },
    onUpdatePlan: (state, action: PayloadAction<{ index: number, name: keyof PlanesProps, value: string | number | boolean }>) => {
      const { index, name, value } = action.payload;
      (state.programa.planes[index] as unknown as Record<string, string | number | boolean>)[name] = value;
    },
    onRemovePlan: (state, action: PayloadAction<number>) => {
      state.programa.planes = state.programa.planes.filter((_, index) => index !== action.payload);
    },
    // FORM - Horarios
    onAddHorario: (state) => {
      state.programa.horarios.push({
        ...initialHorarios,
        horarioFin: addMinutosAHora(initialHorarios.horarioInicio, state.programa.minutos),
      });
    },
    onUpdateHorario: (state, action: PayloadAction<{ index: number, name: keyof HorarioProps, value: string | number | boolean }>) => {
      const { index, name, value } = action.payload;
      (state.programa.horarios[index] as unknown as Record<string, string | number | boolean>)[name] = value;
      if (name === 'horarioInicio') {
        state.programa.horarios[index].horarioFin = addMinutosAHora(value as string, state.programa.minutos);
      }
    },
    onRemoveHorario: (state, action: PayloadAction<number>) => {
      state.programa.horarios = state.programa.horarios.filter((_, index) => index !== action.payload);
    },
    // RESET
    onResetPrograma: (state) => {
      state.programa = initialProgramas;
      state.originales = initialOriginales;
    },
    onSetDataOpcionesEmpleado:(state, action: PayloadAction<OpcionesSelect[]>)=>{
      state.opcionesEmpleados = action.payload;
    },
    onSetDataOpcionesSucursal:(state, action: PayloadAction<OpcionesSelect[]>)=>{
      state.opcionesSucursales = action.payload;
    },
  },
});


export const {
  addProducto,
  onSetDataProductos,
  onSetOriginales,
  onChangeInformacion,
  onToggleCategoria,
  onToggleSucursal,
  onAddPlan,
  onUpdatePlan,
  onRemovePlan,
  onAddHorario,
  onUpdateHorario,
  onRemoveHorario,
  onResetPrograma,
  onSetDataOpcionesEmpleado,
  onSetDataOpcionesSucursal
} = programaSlice.actions;
