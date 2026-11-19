import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

/** Equivalencia de una unidad en gramos (ingrediente_unidad). Ej: 1 Taza = 185 g */
export type UnidadIngredienteProps = {
  /** Terminología nutricion / ingrediente / unidad */
  id_unidad: number,
  label_unidad?: string | null,
  gramos: number | string,
}

/** Alérgeno del ingrediente (ingrediente_alergeno) */
export type AlergenoIngredienteProps = {
  /** Terminología nutricion / ingrediente / alergeno */
  id_alergeno: number,
  label_alergeno?: string | null,
}

/** Ingrediente (de /ingredientes). Kcal y macros son POR CADA 100 g; los decimales pueden llegar como string */
export type IngredienteProps = {
  id: number,
  nombre: string,
  kcal: number | string,
  proteinas_g: number | string,
  carbohidratos_g: number | string,
  grasas_g: number | string,
  unidades: UnidadIngredienteProps[],
  alergenos: AlergenoIngredienteProps[],
};

export type IngredienteState = {
  ingredientes: IngredienteProps[],
  ingrediente: IngredienteProps,
}

const initialIngrediente: IngredienteProps = {
  id: 0,
  nombre: '',
  kcal: 0,
  proteinas_g: 0,
  carbohidratos_g: 0,
  grasas_g: 0,
  unidades: [],
  alergenos: [],
}
export const initialStateIngrediente: IngredienteState = {
  ingrediente: initialIngrediente,
  ingredientes: [],
};

export const ingredienteSlice = createSlice({
  name: "INGREDIENTE",
  initialState: initialStateIngrediente,
  reducers: {
    onSetDataIngredientes: (state, action: PayloadAction<IngredienteProps[]>)=>{
      state.ingredientes = action.payload;
    },
  },
});

export const { onSetDataIngredientes } = ingredienteSlice.actions;
