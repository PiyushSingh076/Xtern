import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  detail: {}, // Initial state as an empty object
};

const detailSlice = createSlice({
  name: 'detail',
  initialState,
  reducers: {
    setDetail: (state, action) => {
      state.detail = action.payload; // Update the detail object with the payload
    },
    clearDetail: (state) => {
      state.detail = {}; // Reset detail to an empty object
    },
  },
});

// Export actions
export const { setDetail, clearDetail } = detailSlice.actions;

// Export reducer
export default detailSlice.reducer;