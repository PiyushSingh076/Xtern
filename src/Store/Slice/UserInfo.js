// slices/roleSlice.js
import { createSlice } from '@reduxjs/toolkit';

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('roleState');
    if (serializedState === null) {
      return {
        selectedRole: '',
        auth: false,
      };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return {
      selectedRole: '',
      auth: false,
    };
  }
};

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('roleState', serializedState);
  } catch {
    // Ignore write errors
  }
};

const initialState = loadState();

const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    setRole: (state, action) => {
      state.selectedRole = action.payload;
      saveState(state);
    },
    setAuth: (state, action) => {
      state.auth = action.payload;
      saveState(state);
    },
  },
});

// Export the actions
export const { setRole, setAuth } = roleSlice.actions;

// Export the reducer
export default roleSlice.reducer;
