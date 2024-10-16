// slices/roleSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedRole: '',
};

const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    setRole: (state, action) => {
      state.selectedRole = action.payload;
    },
  },
});

// Export the actions
export const { setRole } = roleSlice.actions;

// Export the reducer
export default roleSlice.reducer;
