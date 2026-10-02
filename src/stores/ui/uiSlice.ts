import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
export type uiState={
    totalShow: number,
    itemsLen: number,
    /** Búsquedas de tabla en curso (useCrudhook.searcher); > 0 = DataTableTest muestra el skeleton */
    cargandoTabla: number,
}
export const uiInitialState: uiState = {
    totalShow: 0,
    itemsLen: 0,
    cargandoTabla: 0
};

export const uiSlice = createSlice({
    name: "UI",
    initialState: uiInitialState,
    reducers: {
        onSetTotalShow: (state, action:PayloadAction<number>)=>{
            state.totalShow = action.payload
        },
        onSetItemsLen: (state, action:PayloadAction<number>)=>{
            state.itemsLen = action.payload
        },
        // Contador (no boolean): si una búsqueda se cancela y empieza otra, el skeleton sigue hasta que terminen todas
        onInicioCargaTabla: (state)=>{
            state.cargandoTabla += 1
        },
        onFinCargaTabla: (state)=>{
            state.cargandoTabla = Math.max(0, state.cargandoTabla - 1)
        }
    },
});

export const { onSetTotalShow, onSetItemsLen, onInicioCargaTabla, onFinCargaTabla } = uiSlice.actions;
