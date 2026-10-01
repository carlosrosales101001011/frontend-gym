import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { porcentajesDesdeMontos, repartirEnPartesIguales, repartirPorPorcentajes, sumarMontos } from '@/pages/GestionMeta/helpers/repartirMonto';

/** Meta tal como la devuelve /ventas-meta (los decimales pueden llegar como string) */
export type MetaProps = {
  id: number,
  nombre: string,
  /** yyyy-MM-dd */
  fecha_inicio: string,
  /** yyyy-MM-dd */
  fecha_fin: string,
  monto_programa: number,
};
/** Meta de un asesor (/detallemeta-asesor). id ausente = aún no se guarda */
export type AsesorMetaProps = {
  id?: number,
  id_empl: number,
  label_empl: string,
  monto: number,
  /** Solo front (no se guarda): parte del monto de programas que le toca al asesor, 0 a 100 */
  porcentaje: number,
};
export type FormMetaProps = MetaProps & {
  asesores: AsesorMetaProps[],
}
export type MetaState={
    metas: MetaProps[],
    meta: FormMetaProps,
    /** Asesores que ya existían en el backend al abrir la meta: se usan para saber qué crear/actualizar/eliminar */
    asesoresOriginales: AsesorMetaProps[],
}

const initialAsesor: AsesorMetaProps = {
  id_empl: 0,
  label_empl: '',
  monto: 0,
  porcentaje: 0,
}
const initialMeta: FormMetaProps = {
  id: 0,
  nombre: '',
  fecha_inicio: '',
  fecha_fin: '',
  monto_programa: 0,
  asesores: [],
}
export const initialStateMeta: MetaState = {
  metas: [],
  meta: initialMeta,
  asesoresOriginales: [],
};

/**
 * Reglas del reparto (monto de programas <-> asesores):
 * - cambia el monto de un asesor   -> el total es la suma y los porcentajes salen de los montos.
 * - cambia el total                -> cada asesor recibe su porcentaje del total.
 * - cambia el porcentaje de uno    -> los demás se reparten lo que falta para 100 (partes iguales)
 *                                     y los montos se recalculan sobre el mismo total.
 * Los porcentajes deben sumar 100 para guardar (ver ModalCustomMeta).
 */
const recalcularDesdeMontos = (meta: FormMetaProps) => {
  if (meta.asesores.length === 0) return
  meta.monto_programa = sumarMontos(meta.asesores.map((a) => a.monto))
  const porcentajes = porcentajesDesdeMontos(meta.asesores.map((a) => a.monto))
  meta.asesores.forEach((asesor, i) => { asesor.porcentaje = porcentajes[i] })
}
const recalcularDesdePorcentajes = (meta: FormMetaProps) => {
  const montos = repartirPorPorcentajes(meta.monto_programa, meta.asesores.map((a) => a.porcentaje))
  meta.asesores.forEach((asesor, i) => { asesor.monto = montos[i] })
}

export const metaSlice = createSlice({
  name: "META",
  initialState: initialStateMeta,
  reducers: {
    onSetDataMetas: (state, action: PayloadAction<MetaProps[]>)=>{
      state.metas = action.payload;
    },
    onSetMeta: (state, action: PayloadAction<{ meta: FormMetaProps, asesoresOriginales: AsesorMetaProps[] }>)=>{
      state.meta = action.payload.meta;
      state.asesoresOriginales = action.payload.asesoresOriginales;
    },
    onResetMeta: (state)=>{
      state.meta = initialMeta;
      state.asesoresOriginales = [];
    },
    onUpdateMetaCampo: (state, action: PayloadAction<{ name: 'nombre' | 'fecha_inicio' | 'fecha_fin', value: string }>)=>{
      state.meta[action.payload.name] = action.payload.value;
    },
    /** El usuario cambia el total: cada asesor recibe su porcentaje */
    onSetMontoPrograma: (state, action: PayloadAction<number>)=>{
      state.meta.monto_programa = action.payload;
      recalcularDesdePorcentajes(state.meta);
    },
    /**
     * El primer asesor recibe el 100% del monto ya escrito (así no se pierde);
     * los siguientes entran con 0% para no cambiar el reparto.
     */
    onAddAsesor: (state)=>{
      const esPrimero = state.meta.asesores.length === 0;
      state.meta.asesores.push({
        ...initialAsesor,
        monto: esPrimero ? state.meta.monto_programa : 0,
        porcentaje: esPrimero ? 100 : 0,
      });
    },
    onSetAsesor: (state, action: PayloadAction<{ index: number, id_empl: number, label_empl: string }>)=>{
      const asesor = state.meta.asesores[action.payload.index];
      asesor.id_empl = action.payload.id_empl;
      asesor.label_empl = action.payload.label_empl;
    },
    /** El usuario cambia la meta de un asesor: el total es la suma y los porcentajes se recalculan */
    onSetMontoAsesor: (state, action: PayloadAction<{ index: number, monto: number }>)=>{
      state.meta.asesores[action.payload.index].monto = action.payload.monto;
      recalcularDesdeMontos(state.meta);
    },
    /**
     * El usuario cambia el porcentaje de un asesor (máx. 100): lo que falta para 100 se reparte
     * en partes iguales entre los demás (si solo hay otro, se lleva todo el restante).
     * Los montos se recalculan sobre el mismo total.
     */
    onSetPorcentajeAsesor: (state, action: PayloadAction<{ index: number, porcentaje: number }>)=>{
      const { index } = action.payload;
      const porcentaje = Math.min(100, Math.max(0, action.payload.porcentaje));
      const asesores = state.meta.asesores;
      asesores[index].porcentaje = porcentaje;
      const restantes = repartirEnPartesIguales(100 - porcentaje, asesores.length - 1);
      asesores
        .filter((_, i) => i !== index)
        .forEach((asesor, i) => { asesor.porcentaje = restantes[i] });
      recalcularDesdePorcentajes(state.meta);
    },
    /** Mismo porcentaje para todos (100 / n) */
    onRepartirIgual: (state)=>{
      const porcentajes = repartirEnPartesIguales(100, state.meta.asesores.length);
      state.meta.asesores.forEach((asesor, i) => { asesor.porcentaje = porcentajes[i] });
      recalcularDesdePorcentajes(state.meta);
    },
    onRemoveAsesor: (state, action: PayloadAction<number>)=>{
      state.meta.asesores.splice(action.payload, 1);
      recalcularDesdeMontos(state.meta);
    },
  },
});


export const { onSetDataMetas, onSetMeta, onResetMeta, onUpdateMetaCampo, onSetMontoPrograma, onAddAsesor, onSetAsesor, onSetMontoAsesor, onSetPorcentajeAsesor, onRepartirIgual, onRemoveAsesor } = metaSlice.actions;
