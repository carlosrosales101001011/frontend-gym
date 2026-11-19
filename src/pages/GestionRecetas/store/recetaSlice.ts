import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

/** Dificultades permitidas (las mismas que valida el backend) */
export const DIFICULTADES_RECETA = ['Fácil', 'Media', 'Difícil'] as const;
export type DificultadReceta = typeof DIFICULTADES_RECETA[number];

/** Kcal y macros en gramos */
export type NutricionProps = {
  kcal: number,
  proteinas_g: number,
  carbohidratos_g: number,
  grasas_g: number,
}

/** Ingrediente dentro de la receta (recetas_ingrediente). gramos lo calcula el backend */
export type RecetaIngredienteProps = {
  id_ingrediente: number,
  label_ingrediente?: string | null,
  /** Una de las unidades registradas en el ingrediente */
  id_unidad: number,
  label_unidad?: string | null,
  cantidad: number | string,
  gramos?: number | string,
}

/** Receta (de /recetas). El slug lo genera el backend a partir del título */
export type RecetaProps = {
  id: number,
  titulo: string,
  slug: string,
  porciones: number,
  dificultad: DificultadReceta | '',
  /** Viene en el listado y en el detalle */
  nutricion?: { total: NutricionProps, por_porcion: NutricionProps },
  /** Solo vienen en el detalle (/recetas/id/:id) */
  ingredientes?: RecetaIngredienteProps[],
  alergenos?: { id_alergeno: number, label_alergeno?: string | null }[],
};

export type RecetaState = {
  recetas: RecetaProps[],
  receta: RecetaProps,
}

const initialReceta: RecetaProps = {
  id: 0,
  titulo: '',
  slug: '',
  porciones: 1,
  dificultad: '',
  ingredientes: [],
}
export const initialStateReceta: RecetaState = {
  receta: initialReceta,
  recetas: [],
};

export const recetaSlice = createSlice({
  name: "RECETA",
  initialState: initialStateReceta,
  reducers: {
    onSetDataRecetas: (state, action: PayloadAction<RecetaProps[]>)=>{
      state.recetas = action.payload;
    },
  },
});

export const { onSetDataRecetas } = recetaSlice.actions;
