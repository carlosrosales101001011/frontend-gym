import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { OpcionesSelect } from '@/types/props';

/** Plan tal como lo devuelve /entrenamiento-plan (un plan pertenece a un solo programa) */
export type PlanEntrenamientoProps = {
  id: number,
  id_programa: number,
  nMeses: number,
  precioTotal: number,
  id_tipo_tarifa: number,
  citas_nutricion_regalo: number,
  dias_congelamiento_regalo: number,
  /** Monto máximo de descuento al vender el plan (0 = sin límite). Decimal: puede llegar como string */
  max_descuento: number,
  estado: boolean,
  label_programa?: string|null,
  label_tipo_tarifa?: string|null,
};
/**
 * Formulario: al crear se eligen varios programas (id_programas) y se registra un plan por cada uno.
 * Al editar se usa id_programa (el plan ya pertenece a un programa).
 */
export type FormPlanEntrenamientoProps = PlanEntrenamientoProps & {
  id_programas: number[],
}
export type PlanEntrenamientoState={
    planes: PlanEntrenamientoProps[],
    plan: FormPlanEntrenamientoProps,
    opcionesProgramas: OpcionesSelect[],
}

const initialPlan: FormPlanEntrenamientoProps = {
    id: 0,
    id_programa: 0,
    id_programas: [],
    nMeses: 0,
    precioTotal: 0,
    id_tipo_tarifa: 0,
    citas_nutricion_regalo: 0,
    dias_congelamiento_regalo: 0,
    max_descuento: 0,
    estado: true,
}
export const initialStatePlanEntrenamiento: PlanEntrenamientoState = {
  plan: initialPlan,
  planes: [],
  opcionesProgramas: [],
};

export const planEntrenamientoSlice = createSlice({
  name: "PLAN_ENTRENAMIENTO",
  initialState: initialStatePlanEntrenamiento,
  reducers: {
    onSetDataPlanes: (state, action: PayloadAction<PlanEntrenamientoProps[]>)=>{
      state.planes = action.payload;
    },
    onSetDataOpcionesProgramas: (state, action: PayloadAction<OpcionesSelect[]>)=>{
      state.opcionesProgramas = action.payload;
    },
  },
});


export const { onSetDataPlanes, onSetDataOpcionesProgramas } = planEntrenamientoSlice.actions;
