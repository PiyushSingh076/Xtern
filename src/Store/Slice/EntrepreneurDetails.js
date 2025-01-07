import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  entrepreneurDetails: null,
};

const entrepreneurSlice = createSlice({
  name: "entrepreneur",
  initialState,
  reducers: {
    setEntrepreneurDetails: (state, action) => {
      state.entrepreneurDetails = action.payload;
    },
    clearEntrepreneurDetails: (state) => {
      state.entrepreneurDetails = null;
    },
  },
});

export const { setEntrepreneurDetails, clearEntrepreneurDetails } = entrepreneurSlice.actions;

export default entrepreneurSlice.reducer;
