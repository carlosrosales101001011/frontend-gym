import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
export type uiState={
    totalShow: number,
    itemsLen: number,
}
export const uiInitialState: uiState = {
    totalShow: 0,
    itemsLen: 0
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
        }
    },
});

export const { onSetTotalShow, onSetItemsLen } = uiSlice.actions;
